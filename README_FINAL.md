# 🎉 M8Pulse - Configuration complète réussie !

## ✅ Tout est configuré et fonctionnel !

Votre application M8Pulse est maintenant **100% opérationnelle** avec :
- ✅ **Frontend React** sur http://localhost:3000
- ✅ **Backend Symfony** sur http://localhost:8000
- ✅ **Base de données MySQL** configurée
- ✅ **PHPMyAdmin** sur http://localhost:8080
- ✅ **API Google Sheets** intégrée
- ✅ **Authentification JWT** fonctionnelle

---

## 🔑 Identifiants admin

**Email** : `admin@m8pulse.com`  
**Mot de passe** : `M8Pulse2024!`

**Token JWT** (exemple) :
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
```

---

## 📊 Utiliser l'API Google Sheets

### 1️⃣ Partagez vos Google Sheets

**IMPORTANT** : Pour que M8Pulse accède à vos Google Sheets, partagez-les avec :

📧 **`admin-419@sae5012.iam.gserviceaccount.com`**

**Comment faire** :
1. Ouvrez votre Google Sheet
2. Cliquez sur "Partager" (bouton vert)
3. Entrez : `admin-419@sae5012.iam.gserviceaccount.com`
4. Donnez les droits de "Lecteur"
5. Cliquez sur "Envoyer"

### 2️⃣ Obtenez votre token JWT

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@m8pulse.com","password":"M8Pulse2024!"}'
```

**Réponse** :
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGci..."
}
```

Copiez ce token, vous en aurez besoin pour les prochaines étapes.

### 3️⃣ Récupérez les infos de votre Google Sheet

```bash
curl -X POST http://localhost:8000/api/google-sheets/info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "url": "https://docs.google.com/spreadsheets/d/VOTRE_SHEET_ID/edit"
  }'
```

### 4️⃣ Récupérez les données

```bash
curl -X POST http://localhost:8000/api/google-sheets/data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "url": "https://docs.google.com/spreadsheets/d/VOTRE_SHEET_ID/edit",
    "range": "Sheet1!A1:Z1000"
  }'
```

### 5️⃣ Importez comme dataset dans M8Pulse

```bash
curl -X POST http://localhost:8000/api/google-sheets/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "url": "https://docs.google.com/spreadsheets/d/VOTRE_SHEET_ID/edit",
    "name": "Stats FPS 2024",
    "description": "Statistiques des matchs FPS",
    "range": "Matchs!A1:Z1000",
    "public": true
  }'
```

**Réponse** :
```json
{
  "message": "Google Sheet importé avec succès",
  "dataset": {
    "id": 1,
    "name": "Stats FPS 2024",
    "rowCount": 42,
    "columns": [...]
  }
}
```

---

## 🚀 Script d'import automatique

Créez un fichier `import-my-sheets.sh` :

```bash
#!/bin/bash

# Vos Google Sheets (remplacez les URLs)
SHEET_MATCHS="https://docs.google.com/spreadsheets/d/ABC123/edit"
SHEET_JOUEURS="https://docs.google.com/spreadsheets/d/DEF456/edit"
SHEET_STATS="https://docs.google.com/spreadsheets/d/GHI789/edit"

# Connexion
TOKEN=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@m8pulse.com","password":"M8Pulse2024!"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"

# Import des sheets
echo "Import des matchs..."
curl -X POST http://localhost:8000/api/google-sheets/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"url\":\"$SHEET_MATCHS\",\"name\":\"Matchs FPS\",\"public\":true}"

echo ""
echo "Import des joueurs..."
curl -X POST http://localhost:8000/api/google-sheets/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"url\":\"$SHEET_JOUEURS\",\"name\":\"Joueurs\",\"public\":true}"

echo ""
echo "Import des stats..."
curl -X POST http://localhost:8000/api/google-sheets/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"url\":\"$SHEET_STATS\",\"name\":\"Statistiques\",\"public\":true}"

echo ""
echo "✅ Import terminé !"
```

Rendez-le exécutable :
```bash
chmod +x import-my-sheets.sh
./import-my-sheets.sh
```

---

## 📍 URLs importantes

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface React |
| **Backend** | http://localhost:8000 | API Symfony |
| **PHPMyAdmin** | http://localhost:8080 | Gestion BDD |
| **API Doc** | http://localhost:8000/api/doc | Documentation Swagger |
| **Login** | http://localhost:8000/api/login | Authentification |

---

## 🔧 Commandes utiles

### Démarrer l'application
```bash
./start.sh
```

### Arrêter l'application
```bash
./stop.sh
```

### Voir les logs
```bash
export PATH="/usr/local/bin:$PATH"
docker compose logs -f backend
docker compose logs -f frontend
```

### Accéder au backend
```bash
docker exec -it m8pulse_backend bash
```

### Accéder à la base de données
```bash
docker exec -it m8pulse_db mysql -u m8user -pm8password m8pulse
```

---

## 📚 Documentation

- `DEMARRAGE.md` - Guide de démarrage complet
- `DOCKER_GUIDE.md` - Guide Docker détaillé  
- `GOOGLE_SHEETS_GUIDE.md` - Guide Google Sheets
- `IMPORT_DONNEES.md` - Guide d'import de données
- `back-end/API_DOCUMENTATION.md` - Documentation de l'API

---

## 🎯 Prochaines étapes

1. ✅ **Partagez vos Google Sheets** avec le compte de service
2. 📊 **Importez vos données** via l'API
3. 🎨 **Créez des visualisations** dans l'interface
4. 📝 **Rédigez des articles** avec vos données
5. 🌐 **Personnalisez le frontend** React
6. 🚀 **Déployez en production**

---

## 🆘 Besoin d'aide ?

**Problèmes courants** :

### ❌ "Permission denied" sur Google Sheets
➡️ N'oubliez pas de partager avec `admin-419@sae5012.iam.gserviceaccount.com`

### ❌ "Invalid credentials"
➡️ Utilisez : `admin@m8pulse.com` / `M8Pulse2024!`

### ❌ Docker ne démarre pas
➡️ Lancez Docker Desktop manuellement

### ❌ Port déjà utilisé
➡️ Modifiez les ports dans `docker-compose.yml`

---

## 🎉 Félicitations !

Votre plateforme M8Pulse est maintenant **100% opérationnelle** !

Vous pouvez maintenant :
- ✅ Importer vos données Google Sheets
- ✅ Créer des visualisations
- ✅ Publier des articles
- ✅ Gérer vos utilisateurs
- ✅ Et bien plus !

**Bon développement ! 🚀**
