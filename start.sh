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
sleep 10

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

# Exécuter les migrations
echo "🗃️  Exécution des migrations..."
docker exec m8pulse_backend php bin/console doctrine:migrations:migrate --no-interaction

# Créer un utilisateur admin (optionnel)
echo "👤 Création d'un utilisateur admin..."
docker exec m8pulse_backend php bin/console app:create-admin admin@m8pulse.com admin Admin123! --no-interaction 2>/dev/null || echo "ℹ️  Utilisateur admin déjà existant ou commande non disponible"

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
