# 🎮 Guide : Récupérer les stats depuis Google Sheets

## ✅ Ce qui est déjà configuré

Ton backend est déjà configuré avec :
- ✅ API Google Sheets connectée
- ✅ Compte de service : `admin-419@sae5012.iam.gserviceaccount.com`
- ✅ Fonctions pour récupérer les stats Valorant, COD et CS2

## 🚀 Comment récupérer les données depuis ton front-end

### Étape 1 : Partager ton Google Sheet (IMPORTANT !)

1. Ouvre ton Google Sheet avec les stats
2. Clique sur **"Partager"**
3. Ajoute l'email : `admin-419@sae5012.iam.gserviceaccount.com`
4. Donne les permissions **"Lecteur"** (lecture seule)
5. Clique sur **"Envoyer"**

⚠️ **Sans cette étape, l'API ne pourra pas accéder à tes données !**

### Étape 2 : Trouver l'ID de ton Google Sheet

Dans l'URL de ton Google Sheet :
```
https://docs.google.com/spreadsheets/d/1ABC123XYZ456/edit
                                      ^^^^^^^^^^^^^ 
                                      C'est l'ID !
```

### Étape 3 : Récupérer les données depuis ton front-end

#### Option A : Appel direct avec l'ID dans l'URL

```javascript
// Dans ton composant React
const fetchValorantStats = async () => {
  try {
    const SHEET_ID = '1ABC123XYZ456'; // Remplace par ton ID
    
    const response = await fetch(
      `http://localhost:8000/api/google-sheets/players/valorant?spreadsheetId=${SHEET_ID}`
    );
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Joueurs récupérés:', data.players);
      // data.players contient tous tes joueurs avec leurs stats
      setPlayers(data.players);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

#### Option B : Configurer l'ID par défaut (recommandé)

1. Édite le fichier `back-end/.env.local` (ou crée-le)
2. Ajoute l'ID de ton Google Sheet :

```bash
# Pour Valorant
GOOGLE_SHEET_VALORANT_ID=1ABC123XYZ456

# Pour COD
GOOGLE_SHEET_COD_ID=1DEF789UVW012

# Pour CS2
GOOGLE_SHEET_CS2_ID=1GHI345RST678
```

3. Ensuite dans ton front-end, pas besoin de l'ID :

```javascript
const fetchValorantStats = async () => {
  const response = await fetch('http://localhost:8000/api/google-sheets/players/valorant');
  const data = await response.json();
  
  if (data.success) {
    setPlayers(data.players);
  }
};
```

## 📊 Format des données retournées

### Valorant
```json
{
  "success": true,
  "game": "valorant",
  "count": 10,
  "players": [
    {
      "id": "1",
      "name": "Scream",
      "roleSpecific": "Duelist",
      "nationality": "FR",
      "joinDate": "2024-01-15",
      "status": "Active",
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

### Call of Duty (COD)
```json
{
  "players": [
    {
      "id": "1",
      "name": "Player1",
      "overallKD": 1.25,
      "hpKD": 1.18,
      "sndKD": 1.42,
      "olKD": 1.15,
      ...
    }
  ]
}
```

### Counter-Strike 2 (CS2)
```json
{
  "players": [
    {
      "id": "1",
      "name": "Player1",
      "rating": 1.15,
      "tRating": 1.20,
      "ctRating": 1.10,
      ...
    }
  ]
}
```

## 🔄 Utilisation dans React

### Exemple complet : Afficher les stats Valorant

```javascript
import React, { useState, useEffect } from 'react';

const ValorantStatsPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Remplace par l'ID de ton Google Sheet
      const SHEET_ID = '1ABC123XYZ456';
      
      const response = await fetch(
        `http://localhost:8000/api/google-sheets/players/valorant?spreadsheetId=${SHEET_ID}`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setPlayers(data.players);
      } else {
        console.error('Erreur:', data.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement des stats...</div>;

  return (
    <div className="valorant-stats">
      <h1>Statistiques Valorant</h1>
      <button onClick={fetchStats}>🔄 Rafraîchir</button>
      
      <table>
        <thead>
          <tr>
            <th>Joueur</th>
            <th>Rôle</th>
            <th>Matchs</th>
            <th>V/D</th>
            <th>KDA</th>
            <th>ACS</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.roleSpecific}</td>
              <td>{player.gamesPlayed}</td>
              <td>{player.wins}/{player.losses}</td>
              <td>{player.kda?.toFixed(2)}</td>
              <td>{player.acs?.toFixed(1)}</td>
              <td>{player.rating?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ValorantStatsPage;
```

## 📝 Routes API disponibles

| Route | Description | Exemple |
|-------|-------------|---------|
| `GET /api/google-sheets/players/valorant` | Stats Valorant | `?spreadsheetId=1ABC...` |
| `GET /api/google-sheets/players/cod` | Stats Call of Duty | `?spreadsheetId=1ABC...` |
| `GET /api/google-sheets/players/cs2` | Stats CS2 | `?spreadsheetId=1ABC...` |

## 🔧 Test rapide

Dans ton terminal, teste que ça fonctionne :

```bash
# Remplace 1ABC123 par ton vrai ID
curl "http://localhost:8000/api/google-sheets/players/valorant?spreadsheetId=1ABC123"
```

Si tu vois tes données en JSON, c'est bon ! ✅

## ⚠️ Troubleshooting

### Erreur "Permission denied"
→ Tu n'as pas partagé le Google Sheet avec `admin-419@sae5012.iam.gserviceaccount.com`

### Erreur "Invalid credentials"
→ Vérifie que le fichier `back-end/config/google-credentials.json` existe

### Données vides
→ Vérifie que la feuille s'appelle bien "PlayerRoster" ou spécifie le nom dans l'URL

### CORS Error
→ Vérifie que CORS est activé dans `back-end/config/packages/nelmio_cors.yaml`

## 💡 Astuces

1. **Rafraîchissement automatique** : Utilise `setInterval()` pour actualiser les stats toutes les 5 minutes
2. **Cache** : Stocke les données dans `localStorage` pour éviter trop d'appels API
3. **Loading states** : Affiche un spinner pendant le chargement
4. **Error handling** : Gère les erreurs proprement avec des messages utilisateur

## 🎯 Prochaines étapes

1. Configure ton ID de Google Sheet dans `.env.local`
2. Partage ton Google Sheet avec le compte de service
3. Utilise l'API dans ton composant React
4. Style tes statistiques comme tu veux !

---

**Need help?** Regarde les exemples dans `GOOGLE_SHEETS_GUIDE.md` ou teste avec le script `./test-google-sheets.sh`
