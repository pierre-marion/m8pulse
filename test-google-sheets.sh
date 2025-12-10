#!/bin/bash

echo "🧪 Test de l'API Google Sheets M8Pulse"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL de l'API
API_URL="http://localhost:8000"

# Test 1 : Backend accessible
echo "1️⃣  Test de connexion au backend..."
if curl -s -o /dev/null -w "%{http_code}" "$API_URL" | grep -q "200\|302\|404"; then
    echo -e "${GREEN}✅ Backend accessible${NC}"
else
    echo -e "${RED}❌ Backend inaccessible${NC}"
    echo "   Assurez-vous que Docker est lancé et que le backend tourne"
    exit 1
fi

echo ""

# Test 2 : Endpoint Google Sheets
echo "2️⃣  Test de l'endpoint Google Sheets..."
RESPONSE=$(curl -s -X POST "$API_URL/api/google-sheets/info" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://docs.google.com/spreadsheets/d/INVALID"}' \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "400" ] || [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✅ Endpoint Google Sheets fonctionne${NC}"
else
    echo -e "${RED}❌ Endpoint non accessible (code: $HTTP_CODE)${NC}"
    echo "   Response: $(echo "$RESPONSE" | head -n-1)"
fi

echo ""

# Instructions
echo "📝 ${YELLOW}Prochaines étapes :${NC}"
echo ""
echo "1️⃣  Partagez votre Google Sheet avec :"
echo "   📧 ${GREEN}admin-419@sae5012.iam.gserviceaccount.com${NC}"
echo ""
echo "2️⃣  Testez avec votre vraie URL :"
echo "   ${YELLOW}curl -X POST http://localhost:8000/api/google-sheets/info \\${NC}"
echo "   ${YELLOW}  -H \"Content-Type: application/json\" \\${NC}"
echo "   ${YELLOW}  -d '{\"url\": \"VOTRE_URL_GOOGLE_SHEET\"}'${NC}"
echo ""
echo "3️⃣  Pour importer vos données, lisez le guide :"
echo "   📖 ${GREEN}GOOGLE_SHEETS_GUIDE.md${NC}"
echo ""
echo "4️⃣  Documentation interactive :"
echo "   🌐 ${GREEN}http://localhost:8000/api/doc${NC}"
echo ""
