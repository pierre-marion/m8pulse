# 📊 Guide d'importation des données M8Pulse

## 🎯 Votre backend est prêt !

Votre application M8Pulse est maintenant lancée avec :
- ✅ Base de données MySQL
- ✅ Backend Symfony avec API REST
- ✅ Frontend React
- ✅ Système d'import de datasets (CSV/JSON)

## 📍 URLs importantes

| Service | URL | Utilisation |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur |
| **Backend API** | http://localhost:8000/api | API REST |
| **PHPMyAdmin** | http://localhost:8080 | Gestion de la BDD |
| **Swagger Doc** | http://localhost:8000/api/doc | Documentation API interactive |

## 📥 Comment importer vos données

### Option 1 : Via l'API (Recommandé)

#### 1. Créer un utilisateur admin
```bash
docker exec -it m8pulse_backend php bin/console app:create-admin admin@m8pulse.com admin AdminPassword123!
```

#### 2. Se connecter pour obtenir un token
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@m8pulse.com",
    "password": "AdminPassword123!"
  }'
```

Vous recevrez un token JWT comme :
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGci..."
}
```

#### 3. Importer un fichier CSV/JSON

**A. Si votre fichier est sur Google Drive :**

1. Téléchargez-le localement
2. Uploadez-le via l'API :

```bash
curl -X POST http://localhost:8000/api/datasets \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -F "file=@/chemin/vers/votre/fichier.csv" \
  -F "name=Nom du dataset" \
  -F "description=Description de vos données" \
  -F "public=true"
```

**B. Format JSON direct :**

```bash
curl -X POST http://localhost:8000/api/datasets \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Stats FPS 2024",
    "data": {
      "matches": [...],
      "players": [...],
      "stats": [...]
    }
  }'
```

### Option 2 : Via PHPMyAdmin (Simple)

1. Allez sur http://localhost:8080
2. Connectez-vous :
   - Serveur : `db`
   - Utilisateur : `m8user`
   - Mot de passe : `m8password`
3. Sélectionnez la base `m8pulse`
4. Utilisez l'onglet "Importer" pour charger vos CSV

### Option 3 : Via le conteneur backend (Rapide)

#### A. Copier vos fichiers dans le conteneur

```bash
# Copier un fichier CSV
docker cp /chemin/local/vers/fichier.csv m8pulse_backend:/tmp/

# Se connecter au conteneur
docker exec -it m8pulse_backend bash

# Charger le CSV en base
# (exemple avec un script PHP)
php public/import-data.php /tmp/fichier.csv
```

#### B. Script d'import personnalisé

Créez un script PHP dans `back-end/public/import-custom.php` :

```php
<?php
require_once __DIR__ . '/../vendor/autoload.php';

use App\Kernel;
use Symfony\Component\Dotenv\Dotenv;

(new Dotenv())->bootEnv(__DIR__.'/../.env');

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();
$container = $kernel->getContainer();
$em = $container->get('doctrine')->getManager();

// Lire votre CSV
$file = fopen('/tmp/votre-fichier.csv', 'r');
$headers = fgetcsv($file);

while ($row = fgetcsv($file)) {
    // Créer vos entités selon vos besoins
    $data = array_combine($headers, $row);
    
    // Exemple : créer un Dataset
    $dataset = new \App\Entity\Dataset();
    $dataset->setName($data['name']);
    // ... autres champs
    
    $em->persist($dataset);
}

$em->flush();
fclose($file);

echo "Import terminé !\n";
```

Puis lancez :
```bash
docker exec -it m8pulse_backend php public/import-custom.php
```

## 📋 Structure de données disponible

Votre base de données a déjà ces tables :

### 1. **users** - Utilisateurs
- id, email, username, password, role, subscription_level

### 2. **datasets** - Fichiers de données
- id, name, description, filename, file_path, provider_id, status

### 3. **articles** - Articles de data storytelling
- id, title, summary, content, author_id, status

### 4. **blocks** - Blocs dans les articles
- id, article_id, type (text, viz, media), content, position

### 5. **visualizations** - Visualisations
- id, dataset_id, type (bar, line, pie...), config

### 6. **media** - Médias (images, vidéos)
- id, filename, mime_type, size_bytes

### 7. **ratings** - Notations
- id, article_id, user_id, rating, comment

### 8. **themes** - Thèmes visuels
- id, name, colors, fonts

## 🎮 Exemple : Importer des stats de matchs FPS

### Format CSV attendu

```csv
match_id,date,team1,team2,score1,score2,map,game_mode
1,2024-12-09,Gentlemates,TeamA,16,14,Dust2,Competitive
2,2024-12-08,Gentlemates,TeamB,13,16,Mirage,Competitive
```

### Script d'import

```bash
# 1. Copier le CSV
docker cp stats_matchs.csv m8pulse_backend:/tmp/

# 2. Se connecter
docker exec -it m8pulse_backend bash

# 3. Créer un dataset via console Symfony
php bin/console app:import-csv /tmp/stats_matchs.csv "Stats FPS Matchs" "Stats des matchs 2024"
```

## 🔧 Besoin d'aide spécifique ?

Dites-moi :
1. **Quel type de données** vous avez (matchs, joueurs, stats, etc.)
2. **Dans quel format** (CSV, JSON, Excel, Google Sheets)
3. **Où sont les fichiers** (Google Drive, local, etc.)
4. **Ce que vous voulez afficher** sur le site

Je vous créerai un script d'import personnalisé ! 🚀

## 📊 Vérifier vos données importées

### Via l'API
```bash
curl http://localhost:8000/api/datasets
```

### Via PHPMyAdmin
http://localhost:8080 → base `m8pulse` → table `datasets`

### Via le frontend
http://localhost:3000 → Section Datasets

## 🎨 Prochaines étapes

1. ✅ Importer vos données
2. 🎨 Créer des visualisations
3. 📝 Créer des articles avec les visualisations
4. 🌐 Personnaliser le frontend
5. 🚀 Déployer en production
