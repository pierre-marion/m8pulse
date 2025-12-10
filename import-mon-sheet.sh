#!/bin/bash

echo "📊 Import automatique de votre Google Sheet M8Pulse"
echo ""

# Configuration
API_URL="http://localhost:8000"
SHEET_URL="https://docs.google.com/spreadsheets/d/1d6b3E3KEy1TwPRJgjvbgcrDrUbawUkHl9ckpNESyzeg/edit?gid=1805606317#gid=1805606317"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Connexion et récupération du token
echo -e "${BLUE}1️⃣  Connexion à l'API...${NC}"
TOKEN_RESPONSE=$(curl -s -X POST "$API_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@m8pulse.com","password":"M8Pulse2024!"}')

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Erreur de connexion${NC}"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Token obtenu${NC}"
echo ""

# 2. Récupération des infos du sheet
echo -e "${BLUE}2️⃣  Récupération des informations du Google Sheet...${NC}"
INFO_RESPONSE=$(curl -s -X POST "$API_URL/api/google-sheets/info" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"url\":\"$SHEET_URL\"}")

echo "$INFO_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$INFO_RESPONSE"
echo ""

# 3. Demander quelles feuilles importer
echo -e "${YELLOW}📋 Feuilles disponibles détectées ci-dessus${NC}"
echo ""
echo "Voulez-vous importer :"
echo "  1) Toutes les feuilles automatiquement"
echo "  2) Une feuille spécifique"
echo ""
read -p "Votre choix (1 ou 2) : " CHOICE

if [ "$CHOICE" = "1" ]; then
    # Import de toutes les feuilles
    echo ""
    echo -e "${BLUE}3️⃣  Import de toutes les données...${NC}"
    
    ALL_DATA=$(curl -s -X POST "$API_URL/api/google-sheets/all" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "{\"url\":\"$SHEET_URL\"}")
    
    # Extraire les noms de feuilles et importer chacune
    echo "$ALL_DATA" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if 'sheets' in data:
    for sheet_name in data['sheets'].keys():
        print(sheet_name)
" | while read -r SHEET_NAME; do
        if [ ! -z "$SHEET_NAME" ]; then
            echo ""
            echo -e "${BLUE}📊 Import de la feuille: $SHEET_NAME${NC}"
            
            IMPORT_RESPONSE=$(curl -s -X POST "$API_URL/api/google-sheets/import" \
              -H "Content-Type: application/json" \
              -H "Authorization: Bearer $TOKEN" \
              -d "{
                \"url\": \"$SHEET_URL\",
                \"name\": \"$SHEET_NAME\",
                \"description\": \"Importé depuis Google Sheets\",
                \"range\": \"${SHEET_NAME}!A1:Z10000\",
                \"public\": true
              }")
            
            echo "$IMPORT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$IMPORT_RESPONSE"
        fi
    done
    
else
    # Import d'une feuille spécifique
    echo ""
    read -p "Nom de la feuille (ex: Sheet1, Matchs, etc.) : " SHEET_NAME
    read -p "Nom pour le dataset (ex: Stats FPS 2024) : " DATASET_NAME
    
    echo ""
    echo -e "${BLUE}3️⃣  Import de la feuille '$SHEET_NAME'...${NC}"
    
    IMPORT_RESPONSE=$(curl -s -X POST "$API_URL/api/google-sheets/import" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "{
        \"url\": \"$SHEET_URL\",
        \"name\": \"$DATASET_NAME\",
        \"description\": \"Importé depuis Google Sheets - $SHEET_NAME\",
        \"range\": \"${SHEET_NAME}!A1:Z10000\",
        \"public\": true
      }")
    
    echo "$IMPORT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$IMPORT_RESPONSE"
fi

echo ""
echo -e "${GREEN}✅ Import terminé !${NC}"
echo ""
echo "📍 Vous pouvez maintenant :"
echo "   - Voir vos datasets : curl http://localhost:8000/api/datasets"
echo "   - Accéder au frontend : http://localhost:3000"
echo "   - Gérer vos données : http://localhost:8080 (PHPMyAdmin)"
echo ""
