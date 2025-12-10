#!/bin/bash

# 🧪 Script de test de l'API Google Sheets
# Usage: ./test-api-sheets.sh [spreadsheet-id] [game]

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🧪 Test API Google Sheets${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

SHEET_ID="${1:-}"
GAME="${2:-valorant}"

if [ -z "$SHEET_ID" ]; then
    echo -e "${YELLOW}📋 ID de ton Google Sheet:${NC}"
    echo "  (Trouve-le dans l'URL: /d/[ID_ICI]/edit)"
    read -p "ID: " SHEET_ID
fi

if [ -z "$SHEET_ID" ]; then
    echo -e "${RED}❌ ID manquant${NC}"
    exit 1
fi

echo -e "${BLUE}Configuration:${NC}"
echo -e "  Sheet ID: ${GREEN}${SHEET_ID}${NC}"
echo -e "  Jeu: ${GREEN}${GAME}${NC}"
echo ""

echo -e "${BLUE}🔍 Test de l'API...${NC}"
echo ""

RESPONSE=$(curl -s "http://localhost:8000/api/google-sheets/players/${GAME}?spreadsheetId=${SHEET_ID}")

# Vérifier le succès
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Succès !${NC}"
    echo ""
    
    # Afficher le nombre de joueurs
    COUNT=$(echo "$RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
    echo -e "${BLUE}📊 Joueurs récupérés: ${GREEN}${COUNT}${NC}"
    echo ""
    
    # Afficher la réponse formatée
    echo -e "${YELLOW}Données reçues:${NC}"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    
else
    echo -e "${RED}❌ Erreur${NC}"
    echo ""
    echo -e "${YELLOW}Réponse:${NC}"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    echo ""
    echo -e "${YELLOW}💡 Vérifications:${NC}"
    echo "  1. As-tu partagé le Google Sheet avec: admin-419@sae5012.iam.gserviceaccount.com ?"
    echo "  2. Le backend est-il lancé ? (./start.sh)"
    echo "  3. L'ID du Google Sheet est-il correct ?"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Test terminé !${NC}"
echo ""
echo -e "${BLUE}💡 Utilise cette URL dans ton front-end:${NC}"
echo -e "   ${GREEN}http://localhost:8000/api/google-sheets/players/${GAME}?spreadsheetId=${SHEET_ID}${NC}"
