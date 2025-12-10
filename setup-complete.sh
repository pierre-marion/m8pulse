#!/bin/bash

echo "🎯 Configuration complète de M8Pulse + Google Sheets"
echo ""

# Configuration
API_URL="http://localhost:8000"
ADMIN_EMAIL="admin@m8pulse.com"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="M8Pulse2024!"

# 1. Créer l'utilisateur admin
echo "1️⃣  Création de l'utilisateur admin..."
docker exec m8pulse_backend php bin/console app:create-admin \
  "$ADMIN_EMAIL" \
  "$ADMIN_USERNAME" \
  "$ADMIN_PASSWORD" \
  2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Utilisateur admin créé"
else
    echo "ℹ️  Utilisateur admin déjà existant"
fi

echo ""

# 2. Obtenir un token JWT
echo "2️⃣  Connexion et récupération du token JWT..."
TOKEN_RESPONSE=$(curl -s -X POST "$API_URL/api/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USERNAME\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Erreur lors de la récupération du token"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

echo "✅ Token JWT obtenu"
echo ""

# 3. Sauvegarder le token pour utilisation ultérieure
echo "$TOKEN" > .m8pulse-token
echo "💾 Token sauvegardé dans .m8pulse-token"
echo ""

# 4. Afficher les informations
echo "📝 ===== INFORMATIONS DE CONNEXION ====="
echo ""
echo "Email:    $ADMIN_EMAIL"
echo "Password: $ADMIN_PASSWORD"
echo ""
echo "Token JWT (à utiliser dans vos requêtes) :"
echo "$TOKEN"
echo ""
echo "========================================="
echo ""

# 5. Instructions pour Google Sheets
echo "📊 ===== CONFIGURATION GOOGLE SHEETS ====="
echo ""
echo "Pour importer vos Google Sheets :"
echo ""
echo "1️⃣  Partagez votre Google Sheet avec :"
echo "   📧 admin-419@sae5012.iam.gserviceaccount.com"
echo "   (Accès en lecture seule)"
echo ""
echo "2️⃣  Testez la récupération d'infos :"
echo ""
echo "curl -X POST $API_URL/api/google-sheets/info \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer $TOKEN' \\"
echo "  -d '{\"url\": \"VOTRE_URL_GOOGLE_SHEET\"}'"
echo ""
echo "3️⃣  Importez vos données :"
echo ""
echo "curl -X POST $API_URL/api/google-sheets/import \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer $TOKEN' \\"
echo "  -d '{"
echo "    \"url\": \"VOTRE_URL_GOOGLE_SHEET\","
echo "    \"name\": \"Nom du dataset\","
echo "    \"description\": \"Description\","
echo "    \"public\": true"
echo "  }'"
echo ""
echo "==========================================="
echo ""

echo "✅ Configuration terminée !"
echo ""
echo "📚 Consultez les guides :"
echo "   - GOOGLE_SHEETS_GUIDE.md"
echo "   - IMPORT_DONNEES.md"
echo ""
echo "🌐 Interfaces disponibles :"
echo "   - Frontend:   http://localhost:3000"
echo "   - Backend:    http://localhost:8000"
echo "   - PHPMyAdmin: http://localhost:8080"
echo "   - API Doc:    http://localhost:8000/api/doc"
echo ""
