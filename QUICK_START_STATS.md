# 🚀 UTILISATION RAPIDE - Stats Google Sheets

## ⚡ Ce qu'il faut savoir

Ton backend peut **récupérer automatiquement** les stats depuis Google Sheets. Ton pote a déjà fait tout le travail ! 🎉

## 📋 Étape 1 : Partager ton Google Sheet (2 minutes)

1. Ouvre ton Google Sheet avec les stats Valorant/COD/CS2
2. Clique sur **"Partager"** (bouton en haut à droite)
3. Ajoute cet email : `admin-419@sae5012.iam.gserviceaccount.com`
4. Mets les permissions sur **"Lecteur"**
5. Clique sur **"Envoyer"**

✅ C'est tout ! Maintenant l'API peut lire tes données.

## 🔑 Étape 2 : Récupérer l'ID de ton Google Sheet

Dans l'URL de ton Google Sheet, copie la partie entre `/d/` et `/edit` :

```
https://docs.google.com/spreadsheets/d/1ABC123XYZ456DEF789/edit
                                      ^^^^^^^^^^^^^^^^^^^
                                      Copie cette partie !
```

## 🧪 Étape 3 : Tester que ça marche

Lance ce script avec ton ID :

```bash
./test-api-sheets.sh 1ABC123XYZ456DEF789 valorant
```

Si tu vois tes joueurs en JSON → **C'est bon !** ✅

## 💻 Étape 4 : Utiliser dans ton code React

### Option simple : Copie-colle ce composant

```javascript
import PlayerStats from './components/PlayerStats';

function App() {
  return (
    <PlayerStats 
      game="valorant" 
      spreadsheetId="1ABC123XYZ456DEF789"
      autoRefresh={true}
    />
  );
}
```

### Option manuelle : Fetch les données toi-même

```javascript
const [players, setPlayers] = useState([]);

const fetchStats = async () => {
  const SHEET_ID = '1ABC123XYZ456DEF789'; // TON ID ICI
  
  const response = await fetch(
    `http://localhost:8000/api/google-sheets/players/valorant?spreadsheetId=${SHEET_ID}`
  );
  
  const data = await response.json();
  
  if (data.success) {
    setPlayers(data.players);
    // data.players = array de joueurs avec toutes les stats
  }
};
```

## 🎮 Jeux supportés

| Jeu | URL | Colonnes attendues |
|-----|-----|-------------------|
| **Valorant** | `/players/valorant` | ID, Name, Role, Nationality, Games, Wins, Losses, KDA, ACS, Rating |
| **Call of Duty** | `/players/cod` | ID, Name, Role, Nationality, Games, Wins, Losses, Overall KD, HP KD, S&D KD, OL KD |
| **CS2** | `/players/cs2` | ID, Name, Role, Nationality, Games, Wins, Losses, Rating, T Rating, CT Rating |

## 🔄 Rafraîchissement automatique

Pour actualiser les stats toutes les 5 minutes :

```javascript
useEffect(() => {
  fetchStats(); // Charge au démarrage
  
  const interval = setInterval(fetchStats, 5 * 60 * 1000); // Toutes les 5 min
  
  return () => clearInterval(interval); // Nettoie quand le composant se démonte
}, []);
```

## 🛠️ Configuration (optionnel)

Pour ne pas avoir à mettre l'ID dans le code, ajoute-le dans `.env.local` :

```bash
# Dans back-end/.env.local
GOOGLE_SHEET_VALORANT_ID=1ABC123XYZ456DEF789
GOOGLE_SHEET_COD_ID=1DEF789ABC123
GOOGLE_SHEET_CS2_ID=1GHI456JKL789
```

Ensuite, appelle juste :
```javascript
fetch('http://localhost:8000/api/google-sheets/players/valorant')
```

Sans avoir à passer le spreadsheetId !

## 📊 Exemple de données reçues

```json
{
  "success": true,
  "game": "valorant",
  "count": 5,
  "players": [
    {
      "id": "1",
      "name": "Scream",
      "roleSpecific": "Duelist",
      "nationality": "FR",
      "gamesPlayed": 45,
      "wins": 32,
      "losses": 13,
      "kda": 1.45,
      "acs": 285.5,
      "rating": 1.32
    }
  ]
}
```

## ⚠️ Problèmes courants

### "Permission denied"
→ Tu n'as pas partagé le Google Sheet avec le compte de service

### "Invalid credentials"  
→ Le fichier `back-end/config/google-credentials.json` est absent ou corrompu

### CORS Error
→ Le backend doit autoriser les requêtes depuis localhost:3000

### Données vides
→ Vérifie que ta feuille s'appelle "PlayerRoster" (ou spécifie le nom)

## 🎯 TL;DR

1. **Partage ton Google Sheet** avec `admin-419@sae5012.iam.gserviceaccount.com`
2. **Copie l'ID** du Google Sheet depuis l'URL
3. **Appelle l'API** : `GET /api/google-sheets/players/valorant?spreadsheetId=TON_ID`
4. **Affiche les stats** dans ton composant React

C'est tout ! 🚀

---

**Fichiers utiles:**
- `RECUPERER_STATS.md` : Guide complet avec tous les détails
- `test-api-sheets.sh` : Script pour tester l'API
- `front-end/src/components/PlayerStats.js` : Composant React prêt à l'emploi
