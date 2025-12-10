#!/bin/bash

# M8Pulse Backend Setup Script
# Ce script configure automatiquement l'environnement Symfony

set -e

echo "🚀 M8Pulse Backend Setup"
echo "=========================="
echo ""

# Vérifier si Composer est installé
if ! command -v composer &> /dev/null; then
    echo "❌ Composer n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "📦 Installation des dépendances Composer..."
composer install --no-interaction

echo ""
echo "🔑 Génération des clés JWT..."

# Créer le répertoire pour les clés JWT
mkdir -p config/jwt

# Générer la clé privée
if [ ! -f config/jwt/private.pem ]; then
    openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:m8pulse2024
    echo "✅ Clé privée JWT générée"
else
    echo "⚠️  Clé privée JWT existe déjà"
fi

# Générer la clé publique
if [ ! -f config/jwt/public.pem ]; then
    openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:m8pulse2024
    echo "✅ Clé publique JWT générée"
else
    echo "⚠️  Clé publique JWT existe déjà"
fi

echo ""
echo "📁 Création des répertoires d'upload..."
mkdir -p public/uploads/media
mkdir -p public/uploads/datasets
chmod -R 777 public/uploads

echo ""
echo "🗄️  Configuration de la base de données..."

# Vérifier si la base de données existe
if php bin/console doctrine:database:create --if-not-exists; then
    echo "✅ Base de données créée ou existante"
else
    echo "⚠️  La base de données existe déjà"
fi

echo ""
echo "📋 Exécution des migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

echo ""
echo "✅ Setup terminé avec succès !"
echo ""
echo "🌐 Vous pouvez maintenant démarrer le serveur avec :"
echo "   php -S 0.0.0.0:8000 -t public"
echo ""
echo "📚 Documentation de l'API : API_DOCUMENTATION.md"
echo ""
