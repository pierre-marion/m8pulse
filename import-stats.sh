#!/bin/bash

# 🎮 Script d'import des statistiques depuis Google Sheets
# Usage: ./import-stats.sh [google-sheet-url] [game-type] [dataset-name]

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🎮 M8Pulse - Import Google Sheets${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Vérifier que Docker tourne
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}❌ Erreur: Docker n'est pas lancé${NC}"
    exit 1
fi

# Vérifier que le container backend existe
if ! docker ps | grep -q m8pulse_backend; then
    echo -e "${RED}❌ Erreur: Le container backend n'est pas lancé${NC}"
    echo -e "${YELLOW}💡 Lancez d'abord: ./start.sh${NC}"
    exit 1
fi

# Variables par défaut
GOOGLE_SHEET_URL="${1:-}"
GAME_TYPE="${2:-valorant}"
DATASET_NAME="${3:-Stats ${GAME_TYPE}}"

# Si pas d'URL fournie, demander à l'utilisateur
if [ -z "$GOOGLE_SHEET_URL" ]; then
    echo -e "${YELLOW}📋 Veuillez fournir l'URL de votre Google Sheet:${NC}"
    read -p "URL: " GOOGLE_SHEET_URL
fi

if [ -z "$GOOGLE_SHEET_URL" ]; then
    echo -e "${RED}❌ URL manquante${NC}"
    exit 1
fi

# Demander le type de jeu si pas fourni
if [ "$GAME_TYPE" == "valorant" ]; then
    echo ""
    echo -e "${YELLOW}🎮 Type de jeu:${NC}"
    echo "  1) Valorant (défaut)"
    echo "  2) Call of Duty (COD)"
    echo "  3) Counter-Strike 2 (CS2)"
    echo "  4) Autre (import générique)"
    read -p "Choix [1-4]: " game_choice
    
    case $game_choice in
        2) GAME_TYPE="cod" ;;
        3) GAME_TYPE="cs2" ;;
        4) GAME_TYPE="generic" ;;
        *) GAME_TYPE="valorant" ;;
    esac
fi

# Demander le nom du dataset
echo ""
echo -e "${YELLOW}📝 Nom du dataset:${NC}"
read -p "Nom [${DATASET_NAME}]: " user_dataset_name
if [ ! -z "$user_dataset_name" ]; then
    DATASET_NAME="$user_dataset_name"
fi

echo ""
echo -e "${BLUE}📊 Configuration:${NC}"
echo -e "  URL: ${GREEN}${GOOGLE_SHEET_URL}${NC}"
echo -e "  Jeu: ${GREEN}${GAME_TYPE}${NC}"
echo -e "  Nom: ${GREEN}${DATASET_NAME}${NC}"
echo ""

# Vérifier si l'admin existe
echo -e "${BLUE}🔐 Vérification de l'utilisateur admin...${NC}"
ADMIN_EXISTS=$(docker exec m8pulse_backend php -r "
require '/var/www/vendor/autoload.php';
\$kernel = new App\Kernel('dev', true);
\$kernel->boot();
\$em = \$kernel->getContainer()->get('doctrine')->getManager();
\$user = \$em->getRepository('App\Entity\User')->findOneBy(['email' => 'admin@m8pulse.com']);
echo \$user ? 'yes' : 'no';
" 2>/dev/null || echo "no")

if [ "$ADMIN_EXISTS" != "yes" ]; then
    echo -e "${YELLOW}⚠️  Admin n'existe pas. Création...${NC}"
    docker exec m8pulse_backend php bin/console app:create-admin admin@m8pulse.com admin AdminPass123! || {
        echo -e "${RED}❌ Erreur lors de la création de l'admin${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ Admin créé avec succès${NC}"
fi

# Obtenir le token JWT
echo -e "${BLUE}🔑 Authentification...${NC}"
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"admin@m8pulse.com\",\"password\":\"AdminPass123!\"}")

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Erreur d'authentification${NC}"
    echo "Réponse: $TOKEN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Authentifié${NC}"

# Lancer l'import
echo ""
echo -e "${BLUE}📥 Import des données...${NC}"
IMPORT_RESPONSE=$(curl -s -X POST http://localhost:8000/api/google-sheets/quick-import \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"url\": \"${GOOGLE_SHEET_URL}\",
        \"name\": \"${DATASET_NAME}\",
        \"description\": \"Importé automatiquement depuis Google Sheets\",
        \"game\": \"${GAME_TYPE}\",
        \"public\": true
    }")

# Vérifier le succès
if echo "$IMPORT_RESPONSE" | grep -q '"success":true'; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ Import réussi !${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    
    # Extraire les infos
    DATASET_ID=$(echo $IMPORT_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    ROW_COUNT=$(echo $IMPORT_RESPONSE | grep -o '"rowCount":[0-9]*' | cut -d':' -f2)
    
    echo -e "${BLUE}📊 Résumé:${NC}"
    echo -e "  Dataset ID: ${GREEN}${DATASET_ID}${NC}"
    echo -e "  Lignes importées: ${GREEN}${ROW_COUNT}${NC}"
    echo ""
    echo -e "${BLUE}🌐 Accès:${NC}"
    echo -e "  Frontend: ${GREEN}http://localhost:3000${NC}"
    echo -e "  Dataset API: ${GREEN}http://localhost:8000/api/datasets/${DATASET_ID}${NC}"
    echo ""
    
    # Afficher un aperçu si disponible
    if echo "$IMPORT_RESPONSE" | grep -q '"preview"'; then
        echo -e "${BLUE}👀 Aperçu des données:${NC}"
        echo "$IMPORT_RESPONSE" | python3 -m json.tool 2>/dev/null | grep -A 20 '"preview"' || echo "$IMPORT_RESPONSE"
    fi
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}❌ Erreur lors de l'import${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo -e "${YELLOW}Réponse complète:${NC}"
    echo "$IMPORT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$IMPORT_RESPONSE"
    echo ""
    echo -e "${YELLOW}💡 Vérifications:${NC}"
    echo "  1. Avez-vous partagé le Google Sheet avec: admin-419@sae5012.iam.gserviceaccount.com ?"
    echo "  2. L'URL est-elle correcte ?"
    echo "  3. La feuille contient-elle les bonnes colonnes ?"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Terminé !${NC}"
