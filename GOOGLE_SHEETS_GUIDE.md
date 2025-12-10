# 📊 Guide Google Sheets - M8Pulse

## ✅ Configuration terminée !

Votre backend M8Pulse est maintenant connecté à Google Sheets ! 🎉

## 🔐 Étape 1 : Partager votre Google Sheet

Pour que M8Pulse puisse accéder à vos Google Sheets, vous devez les partager avec le compte de service :

**Email du compte de service :**
```
admin-419@sae5012.iam.gserviceaccount.com
```

### Comment partager :
1. Ouvrez votre Google Sheet
2. Cliquez sur **"Partager"** (en haut à droite)
3. Ajoutez l'email : `admin-419@sae5012.iam.gserviceaccount.com`
4. Définissez les permissions sur **"Lecteur"** (read-only)
5. Cliquez sur **"Envoyer"**

⚠️ **Important** : Sans cette étape, l'API ne pourra pas accéder à vos sheets !

## 🚀 Étape 2 : Utiliser l'API

### A. Récupérer les infos d'un Google Sheet

```bash
curl -X POST http://localhost:8000/api/google-sheets/info \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.google.com/spreadsheets/d/VOTRE_ID_ICI/edit"
  }'
```

**Réponse :**
```json
{
  "title": "Stats FPS 2024",
  "sheets": [
    {
      "title": "Matchs",
      "sheetId": 0,
      "rowCount": 100,
      "columnCount": 10
    },
    {
      "title": "Joueurs",
      "sheetId": 1,
      "rowCount": 50,
      "columnCount": 8
    }
  ]
}
```

### B. Récupérer les données d'une feuille

```bash
curl -X POST http://localhost:8000/api/google-sheets/data \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.google.com/spreadsheets/d/VOTRE_ID_ICI/edit",
    "range": "Matchs!A1:Z100"
  }'
```

**Réponse :**
```json
{
  "data": [
    {
      "match_id": "1",
      "date": "2024-12-09",
      "team1": "Gentlemates",
      "team2": "TeamA",
      "score1": "16",
      "score2": "14"
    }
  ],
  "count": 42
}
```

### C. Importer un Google Sheet comme Dataset

D'abord, créez un utilisateur admin :

```bash
docker exec -it m8pulse_backend php bin/console app:create-admin admin@m8pulse.com admin AdminPass123!
```

Obtenez un token JWT :

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@m8pulse.com",
    "password": "AdminPass123!"
  }'
```

Puis importez le sheet :

```bash
curl -X POST http://localhost:8000/api/google-sheets/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -d '{
    "url": "https://docs.google.com/spreadsheets/d/VOTRE_ID_ICI/edit",
    "name": "Stats FPS 2024",
    "description": "Statistiques des matchs FPS",
    "range": "Matchs!A1:Z100",
    "public": true
  }'
```

**Réponse :**
```json
{
  "message": "Google Sheet importé avec succès",
  "dataset": {
    "id": 1,
    "name": "Stats FPS 2024",
    "rowCount": 42,
    "columns": [
      {"name": "match_id", "type": "string"},
      {"name": "date", "type": "string"},
      {"name": "score1", "type": "number"}
    ]
  }
}
```

## 📝 Exemples pratiques

### Exemple 1 : Stats de matchs

**Structure du Google Sheet "Matchs" :**
```
| match_id | date       | team1        | team2    | score1 | score2 | map     |
|----------|------------|--------------|----------|--------|--------|---------|
| 1        | 2024-12-09 | Gentlemates  | TeamA    | 16     | 14     | Dust2   |
| 2        | 2024-12-08 | Gentlemates  | TeamB    | 13     | 16     | Mirage  |
```

**Commande d'import :**
```bash
curl -X POST http://localhost:8000/api/google-sheets/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "url": "https://docs.google.com/spreadsheets/d/ABC123/edit",
    "name": "Matchs FPS",
    "description": "Historique des matchs",
    "range": "Matchs!A1:G1000",
    "public": true
  }'
```

### Exemple 2 : Stats de joueurs

**Structure du Google Sheet "Joueurs" :**
```
| pseudo   | kills | deaths | assists | kd_ratio | team        |
|----------|-------|--------|---------|----------|-------------|
| Player1  | 245   | 180    | 89      | 1.36     | Gentlemates |
| Player2  | 198   | 201    | 76      | 0.98     | Gentlemates |
```

**Commande d'import :**
```bash
curl -X POST http://localhost:8000/api/google-sheets/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "url": "https://docs.google.com/spreadsheets/d/ABC123/edit",
    "name": "Stats Joueurs",
    "description": "Statistiques individuelles",
    "range": "Joueurs!A1:F1000",
    "public": true
  }'
```

### Exemple 3 : Récupérer TOUTES les feuilles

```bash
curl -X POST http://localhost:8000/api/google-sheets/all \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.google.com/spreadsheets/d/ABC123/edit"
  }'
```

Cela récupère automatiquement toutes les feuilles du document !

## 🎯 Script d'import automatique

Créez un fichier `import-sheets.sh` :

```bash
#!/bin/bash

# Configuration
API_URL="http://localhost:8000"
EMAIL="admin@m8pulse.com"
PASSWORD="AdminPass123!"

# Liste de vos Google Sheets
declare -A SHEETS
SHEETS["Stats Matchs"]="https://docs.google.com/spreadsheets/d/ABC123/edit"
SHEETS["Stats Joueurs"]="https://docs.google.com/spreadsheets/d/DEF456/edit"
SHEETS["Classements"]="https://docs.google.com/spreadsheets/d/GHI789/edit"

# Connexion et récupération du token
echo "🔐 Connexion..."
TOKEN=$(curl -s -X POST "$API_URL/api/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | grep -o '"token":"[^"]*"' \
  | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Erreur de connexion"
  exit 1
fi

echo "✅ Token obtenu"

# Import de chaque sheet
for NAME in "${!SHEETS[@]}"; do
  URL="${SHEETS[$NAME]}"
  echo "📊 Import de: $NAME"
  
  curl -X POST "$API_URL/api/google-sheets/import" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"url\": \"$URL\",
      \"name\": \"$NAME\",
      \"description\": \"Importé automatiquement\",
      \"public\": true
    }" \
    | jq '.'
  
  echo ""
done

echo "✅ Import terminé !"
```

Rendez-le exécutable :
```bash
chmod +x import-sheets.sh
./import-sheets.sh
```

## 🔍 Trouver l'ID de votre Google Sheet

L'ID est dans l'URL de votre Google Sheet :

```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                        C'EST L'ID !
```

Vous pouvez utiliser soit l'URL complète, soit juste l'ID.

## 📚 Endpoints disponibles

| Endpoint | Méthode | Description | Auth requise |
|----------|---------|-------------|--------------|
| `/api/google-sheets/info` | POST | Récupère infos du sheet | Non |
| `/api/google-sheets/data` | POST | Récupère données d'une feuille | Non |
| `/api/google-sheets/all` | POST | Récupère toutes les feuilles | Non |
| `/api/google-sheets/import` | POST | Importe comme dataset | Oui (JWT) |

## 🐛 Résolution de problèmes

### Erreur : "Permission denied"
➡️ N'oubliez pas de partager votre Google Sheet avec `admin-419@sae5012.iam.gserviceaccount.com`

### Erreur : "Invalid credentials"
➡️ Vérifiez que le fichier `back-end/config/google-credentials.json` est présent

### Erreur : "Range not found"
➡️ Vérifiez le nom de la feuille et la plage (ex: `Sheet1!A1:Z100`)

### Données vides
➡️ Assurez-vous que la première ligne contient les en-têtes de colonnes

## 📊 Tester avec Swagger

Accédez à la documentation interactive :
👉 http://localhost:8000/api/doc

Vous pourrez tester tous les endpoints directement depuis votre navigateur !

## 🎨 Prochaines étapes

1. ✅ Partagez vos Google Sheets avec le compte de service
2. 📥 Importez vos données via l'API
3. 📊 Créez des visualisations dans l'interface
4. 📝 Rédigez des articles avec vos données
5. 🚀 Publiez sur le site !

---

**Besoin d'aide ?** Donnez-moi :
- L'URL de votre Google Sheet
- Le nom des feuilles à importer
- Le type de données (matchs, joueurs, etc.)

Et je vous créerai un script personnalisé ! 🚀
