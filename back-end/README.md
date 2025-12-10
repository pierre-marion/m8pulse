# M8Pulse Backend - API Symfony

Backend API REST pour la plateforme M8Pulse de Data Storytelling.

## 🚀 Démarrage rapide

### Avec Docker (Recommandé)

```bash
# Depuis le répertoire racine m8pulse/
docker compose up -d --build

# Accéder au conteneur backend
docker exec -it m8pulse_backend bash

# Installer et configurer
./setup.sh
```

### Sans Docker

```bash
# Installer les dépendances
composer install

# Configurer l'environnement
cp .env .env.local
# Éditer .env.local avec vos paramètres de base de données

# Exécuter le script de setup
chmod +x setup.sh
./setup.sh

# Démarrer le serveur
php -S 0.0.0.0:8000 -t public
```

## 📋 Prérequis

- PHP 8.2+
- MySQL 8.0+
- Composer
- OpenSSL (pour JWT)

## 📚 Documentation

La documentation complète de l'API est disponible dans [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Endpoints principaux

- **Authentification** : `/api/login`, `/api/users/register`
- **Utilisateurs** : `/api/users`
- **Articles** : `/api/articles`
- **Blocs** : `/api/blocks`
- **Media** : `/api/media`
- **Datasets** : `/api/datasets`
- **Visualisations** : `/api/visualizations`
- **Notations** : `/api/ratings`
- **Thèmes** : `/api/themes`
- **Page d'accueil** : `/api/welcome`

## 🔧 Configuration

### Variables d'environnement (.env)

```env
APP_ENV=dev
APP_SECRET=ChangeThisSecretKey
DATABASE_URL="mysql://user:password@localhost:3306/m8pulse"

# JWT
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=m8pulse2024
```

## 👥 Rôles utilisateurs

1. **ROLE_VISITOR** - Visiteur (lecture seule)
2. **ROLE_SUBSCRIBER** - Abonné (lecture + notation)
3. **ROLE_AUTHOR** - Auteur (création d'articles)
4. **ROLE_EDITOR** - Éditeur (gestion complète des articles)
5. **ROLE_DESIGNER** - Designer (gestion des thèmes)
6. **ROLE_PROVIDER** - Fournisseur de données (upload datasets)
7. **ROLE_ADMIN** - Administrateur (accès complet)

## 🗄️ Base de données

### Migrations

```bash
# Créer la base de données
php bin/console doctrine:database:create

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Créer une nouvelle migration
php bin/console make:migration
```

### Entités

- `User` - Utilisateurs
- `Article` - Articles
- `Block` - Blocs d'article
- `Media` - Fichiers média
- `Dataset` - Jeux de données
- `Visualization` - Visualisations
- `Rating` - Notations
- `Theme` - Thèmes graphiques
- `WelcomeConfig` - Configuration page d'accueil

## 🧪 Tests

```bash
# Tests unitaires
php bin/phpunit

# Tests d'un groupe spécifique
php bin/phpunit --group controller
```

## 📦 Structure du projet

```
backend/
├── config/              # Configuration Symfony
│   ├── packages/       # Config des bundles
│   └── routes/         # Routing
├── migrations/         # Migrations Doctrine
├── public/            # Point d'entrée web
│   ├── index.php     # Front controller
│   └── uploads/      # Fichiers uploadés
├── src/
│   ├── Controller/   # Contrôleurs API
│   ├── Entity/       # Entités Doctrine
│   └── Kernel.php   # Kernel Symfony
├── composer.json     # Dépendances PHP
├── setup.sh         # Script d'installation
└── API_DOCUMENTATION.md  # Documentation complète
```

## 🔒 Sécurité

- Authentification JWT
- Validation des entrées
- CORS configuré
- Hashage des mots de passe (bcrypt)
- Permissions basées sur les rôles

## 🛠️ Commandes utiles

```bash
# Lister les routes
php bin/console debug:router

# Vider le cache
php bin/console cache:clear

# Créer un utilisateur admin
php bin/console app:create-admin

# Générer une nouvelle clé secrète
php bin/console secrets:generate-keys
```

## 📝 Logs

Les logs sont disponibles dans `var/log/` :
- `dev.log` - Logs de développement
- `prod.log` - Logs de production

## 🤝 Contribution

1. Créer une branche feature : `git checkout -b feature/ma-fonctionnalite`
2. Commiter les changements : `git commit -am 'Ajout nouvelle fonctionnalité'`
3. Push sur la branche : `git push origin feature/ma-fonctionnalite`
4. Créer une Pull Request

## 📄 Licence

Propriétaire - M8Pulse Team

## 🆘 Support

Pour toute question, consultez la [documentation API](./API_DOCUMENTATION.md) ou contactez l'équipe de développement.
