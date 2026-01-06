#!/bin/bash

# Script pour réinitialiser complètement la base de données
# ⚠️  ATTENTION : Cela supprime TOUTES les données !

echo "⚠️  RÉINITIALISATION COMPLÈTE DE LA BASE DE DONNÉES"
echo ""
echo "Ce script va :"
echo "  - Supprimer toute la base de données m8pulse"
echo "  - Recréer une base vide"
echo "  - Exécuter toutes les migrations"
echo "  - Créer uniquement les 3 comptes admin par défaut (Hugo, Pierre, Nathan)"
echo ""
echo "⚠️  TOUS VOS UTILISATEURS ET DONNÉES SERONT PERDUS !"
echo ""
read -p "Êtes-vous sûr de vouloir continuer ? (tapez 'oui' pour confirmer) : " confirmation

if [ "$confirmation" != "oui" ]; then
    echo "❌ Opération annulée"
    exit 0
fi

echo ""
echo "🗑️  Suppression de la base de données..."
docker exec m8pulse_db mysql -u root -prootpassword -e "DROP DATABASE IF EXISTS m8pulse;" 2>/dev/null

echo "📋 Création d'une nouvelle base de données..."
docker exec m8pulse_db mysql -u root -prootpassword -e "CREATE DATABASE m8pulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; GRANT ALL PRIVILEGES ON m8pulse.* TO 'm8user'@'%';" 2>/dev/null

echo "🗃️  Exécution des migrations..."
docker exec m8pulse_backend php bin/console doctrine:migrations:migrate --no-interaction

echo "👤 Création des administrateurs par défaut..."
docker exec m8pulse_backend php bin/console app:create-admins --no-interaction

echo ""
echo "✅ Base de données réinitialisée avec succès !"
echo ""
echo "📋 Comptes créés :"
echo "   - Hugo:   hugo@m8pulse.com / Admin123!Hugo"
echo "   - Pierre: pierre@m8pulse.com / Admin123!Pierre"
echo "   - Nathan: nathan@m8pulse.com / Admin123!Nathan"
echo ""
echo "💡 Pour recréer vos comptes personnalisés, utilisez l'API ou le dashboard admin"
echo ""
