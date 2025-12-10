# ✅ INSTALLATION TERMINÉE - Stats Google Sheets

## 🎉 Tout est configuré !

Ton site M8Pulse peut maintenant récupérer les stats en temps réel depuis Google Sheets !

---

## 📊 Ce qui a été fait

### 1. ✅ Backend (API)
- **Route API créée** : `GET /api/google-sheets/players/valorant`
- **Accès public** : Pas besoin d'authentification pour lire les stats
- **Données en temps réel** depuis ton Google Sheet

### 2. ✅ Frontend (React)
- **TeamPage modifiée** : Charge automatiquement les vraies stats
- **Indicateur "Données en direct"** : Badge vert quand les données viennent de Google Sheets
- **Bouton "Actualiser"** : Pour rafraîchir les stats manuellement
- **Spinner de chargement** : Pendant la récupération des données
- **Affichage amélioré** : Nationalité, W/L, toutes les stats

### 3. ✅ Configuration
- **Google Sheet ID** : `1d6b3E3KEy1TwPRJgjvbgcrDrUbawUkHl9ckpNESyzeg`
- **Compte de service** : `admin-419@sae5012.iam.gserviceaccount.com`
- **CORS activé** : Le frontend peut appeler le backend

---

## 🚀 Comment l'utiliser

### 1. Ouvre ton site
```
http://localhost:3000
```

### 2. Va sur la page "Équipe"
- Clique sur "Équipe" dans le menu
- Sélectionne "Valorant"

### 3. Les stats se chargent automatiquement ! 🎮
- Badge vert "Données en direct" si les données viennent de Google Sheets
- Bouton "🔄 Actualiser" pour rafraîchir les stats
- Toutes les stats de tes 5 joueurs s'affichent :
  - **Minny** (Sentinels) - KDA: 1.56, ACS: 209
  - **bipo** (Duelist) - KDA: 1.35, ACS: 231
  - **GLYPH** (Co-IGL/Smoker) - KDA: 1.60, ACS: 175
  - **marteen** (Flex) - KDA: 1.68, ACS: 261
  - **starxo** (IGL/Initiator) - KDA: 1.17, ACS: 154

---

## 🔄 Pour mettre à jour les stats

### Option 1 : Automatique (Recommandé)
1. Modifie ton Google Sheet
2. Les changements apparaissent **immédiatement** quand tu cliques sur "Actualiser" ou recharges la page

### Option 2 : Rafraîchissement auto
Les stats se rechargent **automatiquement** quand :
- Tu changes d'onglet de jeu
- Tu reviens sur la page Équipe
- Tu cliques sur le bouton "Actualiser"

---

## 📝 Modifier le Google Sheet

1. Ouvre ton Google Sheet : 
   ```
   https://docs.google.com/spreadsheets/d/1d6b3E3KEy1TwPRJgjvbgcrDrUbawUkHl9ckpNESyzeg/edit
   ```

2. Colonnes attendues :
   - **ID** : Pseudo du joueur
   - **Name** : Nom complet
   - **Role Specific** : Rôle (Duelist, Sentinel, etc.)
   - **Nationality** : Pays
   - **Join Date** : Date d'arrivée
   - **Status** : Active/Inactive
   - **Games Played** : Nombre de matchs
   - **Wins** : Victoires
   - **Losses** : Défaites
   - **KDA** : Ratio K/D/A
   - **ACS** : Average Combat Score
   - **Rating** : Rating global

3. Modifie les valeurs
4. **C'est tout !** Les changements sont en direct ✨

---

## 🧪 Tester l'API directement

```bash
# Test simple
curl "http://localhost:8000/api/google-sheets/players/valorant?spreadsheetId=1d6b3E3KEy1TwPRJgjvbgcrDrUbawUkHl9ckpNESyzeg"

# Avec le script
./test-api-sheets.sh 1d6b3E3KEy1TwPRJgjvbgcrDrUbawUkHl9ckpNESyzeg valorant
```

---

## 🎯 Prochaines étapes (optionnel)

### 1. Ajouter COD et CS2
Pour ajouter les mêmes stats pour COD et CS2 :

**a. Crée des Google Sheets pour COD et CS2**

**b. Partage-les avec** : `admin-419@sae5012.iam.gserviceaccount.com`

**c. Modifie `TeamPage.js`** pour charger aussi COD et CS2 :
```javascript
useEffect(() => {
  if (currentGame === 'Valorant') {
    fetchLivePlayersData('valorant', VALO_SHEET_ID);
  } else if (currentGame === 'Call of Duty') {
    fetchLivePlayersData('cod', COD_SHEET_ID);
  } else if (currentGame === 'Counter Strike') {
    fetchLivePlayersData('cs2', CS2_SHEET_ID);
  }
}, [currentGame]);
```

### 2. Configurer l'ID par défaut
Ajoute dans `back-end/.env.local` :
```bash
GOOGLE_SHEET_VALORANT_ID=1d6b3E3KEy1TwPRJgjvbgcrDrUbawUkHl9ckpNESyzeg
```

Puis dans le code, enlève le `spreadsheetId` de l'URL.

### 3. Rafraîchissement automatique
Pour actualiser les stats toutes les 5 minutes automatiquement :
```javascript
useEffect(() => {
  fetchLivePlayersData();
  const interval = setInterval(fetchLivePlayersData, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, [currentGame]);
```

---

## ⚠️ Troubleshooting

### Les stats ne s'affichent pas
1. ✅ Le backend tourne ? → `docker ps`
2. ✅ Le frontend tourne ? → Ouvre `http://localhost:3000`
3. ✅ Google Sheet partagé ? → Vérifie que `admin-419@sae5012.iam.gserviceaccount.com` a accès
4. ✅ Regarde la console du navigateur (F12) pour voir les erreurs

### Erreur CORS
```bash
docker exec m8pulse_backend php bin/console cache:clear
```

### Données vides
Vérifie que ta feuille Google Sheet s'appelle bien **"PlayerRoster"** (ou change le nom dans le code)

---

## 📚 Fichiers modifiés

- ✅ `back-end/src/Controller/GoogleSheetsController.php` - Nouvelle route API
- ✅ `back-end/config/packages/security.yaml` - Accès public à l'API
- ✅ `front-end/src/components/TeamPage.js` - Chargement des stats en direct
- ✅ `front-end/src/components/TeamPage.css` - Styles pour le badge live
- ✅ `test-api-sheets.sh` - Script de test
- ✅ `QUICK_START_STATS.md` - Guide rapide
- ✅ `RECUPERER_STATS.md` - Documentation complète

---

## 🎮 Ton site est prêt !

Ouvre **http://localhost:3000** et va sur l'onglet **Équipe** → **Valorant** !

Les stats de ton Google Sheet s'affichent en direct ! 🚀

---

**Besoin d'aide ?** Regarde les fichiers :
- `QUICK_START_STATS.md` - Guide rapide
- `RECUPERER_STATS.md` - Documentation détaillée
