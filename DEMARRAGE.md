# 🎯 M8Pulse - Guide de démarrage complet

## 📋 Étape 1 : Vérifier les prérequis

### Docker Desktop
Docker Desktop doit être installé sur votre Mac. ✅ (Déjà installé dans `/Applications/Docker.app`)

Si ce n'est pas le cas, téléchargez-le depuis : https://www.docker.com/products/docker-desktop

## 🚀 Étape 2 : Démarrer l'application (MÉTHODE SIMPLE)

### Option A : Lancement automatique (RECOMMANDÉ)

Ouvrez un terminal dans le dossier du projet et lancez :

```bash
./launch.sh
```

Ce script va :
1. ✅ Vérifier que Docker est lancé
2. 🚀 Démarrer Docker automatiquement si nécessaire
3. 📦 Créer tous les conteneurs
4. 🗃️ Initialiser la base de données
5. ⚙️ Configurer le backend et le frontend

### Option B : Lancement manuel

Si le script automatique ne fonctionne pas :

**1. Lancer Docker Desktop manuellement**
   - Ouvrez l'application "Docker" depuis vos Applications
   - Attendez que l'icône Docker dans la barre de menu soit stable (✅ vert)

**2. Ensuite, dans le terminal :**
```bash
./start.sh
```

## 📍 Étape 3 : Accéder à l'application

Une fois démarré (patientez 1-2 minutes la première fois), vous pouvez accéder à :

| 🎯 Service | 🔗 URL | 📝 Description |
|-----------|--------|---------------|
| **Frontend React** | http://localhost:3000 | Application utilisateur |
| **Backend Symfony** | http://localhost:8000 | API REST |
| **PHPMyAdmin** | http://localhost:8080 | Gestion base de données |
| **MySQL** | localhost:3306 | Base de données |

### 🔐 Identifiants base de données
- **Utilisateur** : `m8user`
- **Mot de passe** : `m8password`
- **Base de données** : `m8pulse`
- **Host (depuis l'extérieur)** : `localhost:3306`
- **Host (depuis les conteneurs)** : `db:3306`

## 🛑 Étape 4 : Arrêter l'application

```bash
./stop.sh
```

ou

```bash
docker-compose down
```

## 🔧 Commandes utiles

### Voir les logs en temps réel
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Redémarrer un service
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db
```

### Accéder au terminal d'un conteneur
```bash
# Backend Symfony (PHP)
docker exec -it m8pulse_backend bash

# Frontend React (Node)
docker exec -it m8pulse_frontend sh

# Base de données MySQL
docker exec -it m8pulse_db mysql -u m8user -pm8password m8pulse
```

### Commandes Symfony (dans le conteneur backend)
```bash
# D'abord, entrer dans le conteneur
docker exec -it m8pulse_backend bash

# Puis lancer vos commandes
php bin/console cache:clear
php bin/console doctrine:migrations:migrate
php bin/console debug:router
php bin/console app:create-admin admin@example.com admin Password123!
```

### Commandes React (dans le conteneur frontend)
```bash
# D'abord, entrer dans le conteneur
docker exec -it m8pulse_frontend sh

# Puis lancer vos commandes
npm install
npm run build
```

### Réinitialiser complètement le projet
```bash
# Arrêter et supprimer TOUT (conteneurs, volumes, base de données)
docker-compose down -v

# Nettoyer les images
docker system prune -a

# Relancer depuis zéro
./launch.sh
```

## 🐛 Résolution de problèmes

### ❌ "Docker n'est pas lancé"
**Solution :**
1. Ouvrez l'application Docker depuis `/Applications/Docker.app`
2. Attendez que l'icône soit verte dans la barre de menu
3. Relancez `./launch.sh`

### ❌ "Port 3000/8000/3306 déjà utilisé"
**Solution :** Un autre service utilise ce port. Vous pouvez :
- Arrêter l'autre service
- Ou modifier les ports dans `docker-compose.yml`

```yaml
# Exemple pour changer le port frontend de 3000 à 3001
frontend:
  ports:
    - "3001:3000"
```

### ❌ "Cannot connect to database"
**Solution :**
1. Attendez 30 secondes que MySQL démarre
2. Vérifiez que le conteneur DB est bien lancé :
   ```bash
   docker ps | grep m8pulse_db
   ```
3. Redémarrez le backend :
   ```bash
   docker-compose restart backend
   ```

### ❌ Le frontend ne charge pas
**Solution :**
1. Vérifiez les logs :
   ```bash
   docker-compose logs -f frontend
   ```
2. Vérifiez que le fichier `.env` existe dans `front-end/`
3. Reconstruisez le conteneur :
   ```bash
   docker-compose up -d --build frontend
   ```

### ❌ Erreur JWT / Token
**Solution :** Générez les clés JWT manuellement :
```bash
docker exec -it m8pulse_backend bash
mkdir -p config/jwt
openssl genrsa -out config/jwt/private.pem -aes256 -passout pass:votre_passphrase 4096
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem -passin pass:votre_passphrase
chmod 644 config/jwt/*.pem
exit
docker-compose restart backend
```

### ❌ "Composer install failed"
**Solution :**
```bash
docker exec -it m8pulse_backend composer install
docker exec -it m8pulse_backend composer update
```

### ❌ Les modifications du code ne s'appliquent pas
**Solution :** Les volumes Docker montent votre code local. Si les changements ne s'appliquent pas :

Pour le **backend** :
```bash
docker exec -it m8pulse_backend php bin/console cache:clear
```

Pour le **frontend** :
```bash
docker-compose restart frontend
```

## 📊 Architecture du projet

```
m8pulse/
├── docker-compose.yml          # Configuration Docker principale
├── launch.sh                   # 🚀 Script de lancement automatique
├── start.sh                    # Script de démarrage
├── stop.sh                     # Script d'arrêt
│
├── back-end/                   # 🔧 Backend Symfony (PHP)
│   ├── Dockerfile
│   ├── .env                    # Configuration Symfony
│   ├── composer.json
│   ├── src/                    # Code source PHP
│   ├── config/                 # Configuration Symfony
│   └── public/                 # Point d'entrée web
│
├── front-end/                  # 🎨 Frontend React
│   ├── Dockerfile
│   ├── .env                    # Configuration React
│   ├── package.json
│   ├── src/                    # Code source React
│   └── public/                 # Assets statiques
│
└── db/
    └── init.sql                # 🗃️ Script d'initialisation DB
```

## 🎯 Workflow de développement

1. **Démarrer** : `./launch.sh`
2. **Développer** :
   - Modifiez les fichiers dans `back-end/src/` ou `front-end/src/`
   - Les changements sont automatiquement synchronisés
3. **Tester** :
   - Frontend : http://localhost:3000
   - Backend : http://localhost:8000
4. **Débugger** :
   - Consultez les logs : `docker-compose logs -f`
5. **Arrêter** : `./stop.sh`

## 🎓 Prochaines étapes

Une fois l'application lancée :

1. **Créer un utilisateur admin** :
   ```bash
   docker exec -it m8pulse_backend php bin/console app:create-admin admin@m8pulse.com admin Password123!
   ```

2. **Accéder à l'API** :
   - Documentation Swagger : http://localhost:8000/api/doc

3. **Développer** :
   - Backend : Ajoutez vos controllers dans `back-end/src/Controller/`
   - Frontend : Ajoutez vos composants dans `front-end/src/components/`

4. **Tester la connexion** :
   - Frontend → Backend : Vérifiez que `REACT_APP_API_URL` est correct
   - Backend → DB : Vérifiez que `DATABASE_URL` est correct

## 📚 Documentation supplémentaire

- `DOCKER_GUIDE.md` : Guide Docker détaillé
- `back-end/API_DOCUMENTATION.md` : Documentation de l'API
- `back-end/README.md` : Documentation du backend

## ✅ Checklist de démarrage

- [ ] Docker Desktop installé
- [ ] Docker Desktop lancé (icône verte dans la barre de menu)
- [ ] Terminé dans le dossier du projet
- [ ] Lancé `./launch.sh`
- [ ] Attendu 2-3 minutes (première fois)
- [ ] Vérifié http://localhost:3000 (Frontend)
- [ ] Vérifié http://localhost:8000 (Backend)
- [ ] Créé un utilisateur admin

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** : `docker-compose logs -f`
2. **Vérifiez les conteneurs** : `docker ps -a`
3. **Redémarrez tout** : `./stop.sh` puis `./launch.sh`
4. **Réinitialisez tout** : `docker-compose down -v` puis `./launch.sh`

---

Bon développement ! 🚀
