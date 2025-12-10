# 🚀 M8Pulse - Guide de démarrage Docker

## Prérequis
- Docker Desktop installé et lancé
- Ports disponibles : 3000, 8000, 8080, 3306

## 🎯 Démarrage rapide

### 1. Rendre les scripts exécutables
```bash
chmod +x start.sh stop.sh
```

### 2. Lancer l'application
```bash
./start.sh
```

Le script va :
- 🧹 Nettoyer les anciens conteneurs
- 🔨 Construire les images Docker
- ▶️  Démarrer tous les services (DB, Backend, Frontend, PHPMyAdmin)
- 📚 Installer les dépendances
- 🔑 Générer les clés JWT
- 🗃️  Créer la base de données
- 👤 Créer un utilisateur admin

### 3. Accéder à l'application

Une fois démarré, vous pouvez accéder à :

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Application React |
| **Backend** | http://localhost:8000 | API Symfony |
| **PHPMyAdmin** | http://localhost:8080 | Interface de gestion DB |
| **Base de données** | localhost:3306 | MySQL |

### 4. Connexion base de données
- **Utilisateur** : `m8user`
- **Mot de passe** : `m8password`
- **Base** : `m8pulse`

## 📋 Commandes utiles

### Arrêter l'application
```bash
./stop.sh
# ou
docker-compose down
```

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Redémarrer un service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Accéder au terminal d'un conteneur
```bash
# Backend (Symfony)
docker exec -it m8pulse_backend bash

# Frontend (React)
docker exec -it m8pulse_frontend sh

# Base de données
docker exec -it m8pulse_db mysql -u m8user -pm8password m8pulse
```

### Commandes Symfony dans le conteneur
```bash
# Accéder au conteneur backend
docker exec -it m8pulse_backend bash

# Puis lancer vos commandes Symfony
php bin/console cache:clear
php bin/console doctrine:migrations:migrate
php bin/console app:create-admin email@example.com username password
```

### Réinitialiser complètement
```bash
# Arrêter et supprimer tout (y compris les volumes)
docker-compose down -v

# Relancer
./start.sh
```

## 🔧 Résolution de problèmes

### Le port 3000/8000/3306 est déjà utilisé
Modifiez les ports dans `docker-compose.yml` :
```yaml
ports:
  - "3001:3000"  # Change 3000 to 3001
```

### Erreur de connexion à la base de données
Attendez quelques secondes que MySQL démarre complètement, puis :
```bash
docker-compose restart backend
```

### Le frontend ne se connecte pas au backend
Vérifiez que l'URL de l'API est correcte dans `front-end/.env` :
```
REACT_APP_API_URL=http://localhost:8000
```

### Erreur JWT
Les clés JWT doivent être générées. Si elles ne le sont pas :
```bash
docker exec -it m8pulse_backend bash
mkdir -p config/jwt
openssl genrsa -out config/jwt/private.pem -aes256 -passout pass:votre_passphrase 4096
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem -passin pass:votre_passphrase
```

## 🎨 Architecture

```
┌─────────────────┐
│   Frontend      │  React (port 3000)
│   (React)       │  
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Backend       │  Symfony (port 8000)
│   (Symfony)     │  API REST
└────────┬────────┘
         │
         │ Doctrine ORM
         ▼
┌─────────────────┐
│   Database      │  MySQL 8.0 (port 3306)
│   (MySQL)       │  
└─────────────────┘

┌─────────────────┐
│  PHPMyAdmin     │  Interface Web (port 8080)
└─────────────────┘
```

## 🔐 Sécurité (Production)

Pour la production, changez :
1. Les mots de passe dans `docker-compose.yml`
2. `APP_SECRET` dans `back-end/.env`
3. La passphrase JWT
4. Mettez `APP_ENV=prod`

## 📦 Structure Docker

- **db** : MySQL 8.0 avec initialisation automatique via `db/init.sql`
- **backend** : PHP 8.2 + Apache + Symfony
- **frontend** : Node 18 + React
- **phpmyadmin** : Interface de gestion de base de données

Tous les conteneurs communiquent via le réseau `m8pulse_network`.
