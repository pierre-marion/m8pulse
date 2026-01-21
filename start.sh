#!/bin/bash

# S'assurer que Docker est dans le PATH
export PATH="/usr/local/bin:$PATH"

echo "ðŸš€ DÃ©marrage de M8Pulse avec Docker..."
echo ""

# ArrÃªter les conteneurs existants
echo "ðŸ“¦ Nettoyage des anciens conteneurs..."
docker compose down -v

# Construction des images
echo "ðŸ”¨ Construction des images Docker..."
docker compose build

# DÃ©marrage des services
echo "â–¶ï¸  DÃ©marrage des services..."
docker compose up -d

# Attendre que la base de donnÃ©es soit prÃªte
echo "â³ Attente de la base de donnÃ©es..."
echo "   VÃ©rification de la disponibilitÃ© de MySQL..."
max_attempts=30
attempt=0
until docker exec m8pulse_db mysqladmin ping -h localhost -u m8user -pm8password --silent 2>/dev/null; do
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo "âŒ La base de donnÃ©es n'a pas dÃ©marrÃ© dans les temps"
        exit 1
    fi
    echo "   Tentative $attempt/$max_attempts..."
    sleep 2
done
echo "   âœ… Base de donnÃ©es prÃªte!"

# Installation des dÃ©pendances Symfony
echo "ðŸ“š Installation des dÃ©pendances Symfony..."
docker exec m8pulse_backend composer install

# GÃ©nÃ©rer les clÃ©s JWT si elles n'existent pas
echo "ðŸ”‘ GÃ©nÃ©ration des clÃ©s JWT..."
docker exec m8pulse_backend sh -c "
    if [ ! -f config/jwt/private.pem ]; then
        mkdir -p config/jwt
        openssl genrsa -out config/jwt/private.pem -aes256 -passout pass:votre_passphrase 4096
        openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem -passin pass:votre_passphrase
        echo 'âœ… ClÃ©s JWT gÃ©nÃ©rÃ©es'
    else
        echo 'âœ… ClÃ©s JWT dÃ©jÃ  existantes'
    fi
"

# VÃ©rifier si la base de donnÃ©es existe
echo "ðŸ—ƒï¸  VÃ©rification de la base de donnÃ©es..."
DB_EXISTS=$(docker exec m8pulse_db mysql -u root -prootpassword -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'm8pulse';" 2>/dev/null | grep -c m8pulse || echo "0")

if [ "$DB_EXISTS" = "0" ]; then
    echo "   ðŸ“‹ CrÃ©ation de la base de donnÃ©es..."
    docker exec m8pulse_db mysql -u root -prootpassword -e "CREATE DATABASE m8pulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; GRANT ALL PRIVILEGES ON m8pulse.* TO 'm8user'@'%';" 2>/dev/null
fi

# ExÃ©cuter les migrations Doctrine (ne modifie que si nÃ©cessaire)
echo "ðŸ—ƒï¸  ExÃ©cution des migrations..."
docker exec m8pulse_backend php bin/console doctrine:migrations:migrate --no-interaction

# CrÃ©er les utilisateurs administrateurs par dÃ©faut (Hugo, Pierre, Nathan)
echo "ðŸ‘¤ CrÃ©ation des utilisateurs administrateurs par dÃ©faut..."
docker exec m8pulse_backend php bin/console app:create-admins --no-interaction 2>/dev/null || echo "â„¹ï¸  Utilisateurs administrateurs dÃ©jÃ  crÃ©Ã©s"

# CrÃ©er tous les comptes de test
echo "ðŸ‘¥ CrÃ©ation des comptes de test..."
./create-all-test-accounts.sh

# Initialiser les articles de dÃ©mo
echo "ðŸ“ Initialisation des articles de dÃ©mo..."
docker exec -i m8pulse_db mysql -u m8user -pm8password m8pulse < init-articles.sql
echo "   âœ… 3 articles crÃ©Ã©s (Valorant, CS2, CoD)"

echo ""
echo "âœ… M8Pulse est maintenant en ligne !"
echo ""
echo "ðŸ“ Services disponibles :"
echo "   - Frontend (React):     http://localhost:3000"
echo "   - Backend (Symfony):    http://localhost:8000"
echo "   - PHPMyAdmin:           http://localhost:8080"
echo "   - Base de donnÃ©es:      localhost:3306"
echo ""
echo "ðŸ”‘ Informations de connexion base de donnÃ©es :"
echo "   - User: m8user"
echo "   - Password: m8password"
echo "   - Database: m8pulse"
echo ""
echo "ðŸ“‹ Commandes utiles :"
echo "   - Voir les logs:        docker-compose logs -f"
echo "   - ArrÃªter:              docker-compose down"
echo "   - RedÃ©marrer:           docker-compose restart"
echo ""
