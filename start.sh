#!/bin/bash

# S'assurer que Docker est dans le PATH
export PATH="/usr/local/bin:$PATH"

echo "🚀 Démarrage de M8Pulse avec Docker..."
echo ""

# Arrêter les conteneurs existants
echo "📦 Nettoyage des anciens conteneurs..."
docker compose down -v

# Construction des images
echo "🔨 Construction des images Docker..."
docker compose build

# Démarrage des services
echo "▶️  Démarrage des services..."
docker compose up -d

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
echo "   Vérification de la disponibilité de MySQL..."
max_attempts=30
attempt=0
until docker exec m8pulse_db mysqladmin ping -h localhost -u m8user -pm8password --silent 2>/dev/null; do
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ La base de données n'a pas démarré dans les temps"
        exit 1
    fi
    echo "   Tentative $attempt/$max_attempts..."
    sleep 2
done
echo "   ✅ Base de données prête!"

# Installation des dépendances Symfony
echo "📚 Installation des dépendances Symfony..."
docker exec m8pulse_backend composer install

# Générer les clés JWT si elles n'existent pas
echo "🔑 Génération des clés JWT..."
docker exec m8pulse_backend sh -c "
    if [ ! -f config/jwt/private.pem ]; then
        mkdir -p config/jwt
        openssl genrsa -out config/jwt/private.pem -aes256 -passout pass:votre_passphrase 4096
        openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem -passin pass:votre_passphrase
        echo '✅ Clés JWT générées'
    else
        echo '✅ Clés JWT déjà existantes'
    fi
"

# Vérifier si la base de données existe
echo "🗃️  Vérification de la base de données..."
DB_EXISTS=$(docker exec m8pulse_db mysql -u root -prootpassword -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'm8pulse';" 2>/dev/null | grep -c m8pulse || echo "0")

if [ "$DB_EXISTS" = "0" ]; then
    echo "   📋 Création de la base de données..."
    docker exec m8pulse_db mysql -u root -prootpassword -e "CREATE DATABASE m8pulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; GRANT ALL PRIVILEGES ON m8pulse.* TO 'm8user'@'%';" 2>/dev/null
fi

# Exécuter les migrations Doctrine (ne modifie que si nécessaire)
echo "🗃️  Exécution des migrations..."
docker exec m8pulse_backend php bin/console doctrine:migrations:migrate --no-interaction

# Créer les utilisateurs administrateurs par défaut (Hugo, Pierre, Nathan)
echo "👤 Création des utilisateurs administrateurs par défaut..."
docker exec m8pulse_backend php bin/console app:create-admins --no-interaction 2>/dev/null || echo "ℹ️  Utilisateurs administrateurs déjà créés"

echo ""
echo "✅ M8Pulse est maintenant en ligne !"
echo ""
echo "📍 Services disponibles :"
echo "   - Frontend (React):     http://localhost:3000"
echo "   - Backend (Symfony):    http://localhost:8000"
echo "   - PHPMyAdmin:           http://localhost:8080"
echo "   - Base de données:      localhost:3306"
echo ""
echo "🔑 Informations de connexion base de données :"
echo "   - User: m8user"
echo "   - Password: m8password"
echo "   - Database: m8pulse"
echo ""
echo "📋 Commandes utiles :"
echo "   - Voir les logs:        docker-compose logs -f"
echo "   - Arrêter:              docker-compose down"
echo "   - Redémarrer:           docker-compose restart"
echo ""
