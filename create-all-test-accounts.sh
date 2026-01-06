#!/bin/bash

# Script pour créer tous les comptes de test documentés
echo "👥 Création des comptes utilisateurs de test..."
echo ""

# Fonction pour créer un utilisateur via l'API Symfony console
create_user() {
    local email=$1
    local username=$2
    local password=$3
    local roles=$4
    
    echo "📝 Création de $username ($email)..."
    docker exec m8pulse_backend php bin/console app:create-user "$email" "$username" "$password" "$roles" --no-interaction 2>/dev/null || echo "   ℹ️  Utilisateur déjà existant"
}

# Administrateurs
echo "👑 COMPTES ADMINISTRATEURS"
create_user "admin@m8pulse.com" "admin" "password" "ROLE_ADMIN,ROLE_EDITOR,ROLE_DESIGNER,ROLE_PROVIDER"
create_user "superadmin@m8pulse.com" "superadmin" "super123" "ROLE_ADMIN"

# Éditeurs
echo ""
echo "📝 COMPTES ÉDITEURS"
create_user "editor@m8pulse.com" "editor" "editor123" "ROLE_EDITOR,ROLE_AUTHOR,ROLE_SUBSCRIBER"

# Auteurs
echo ""
echo "✍️ COMPTES AUTEURS"
create_user "author1@m8pulse.com" "author1" "author123" "ROLE_AUTHOR,ROLE_SUBSCRIBER"
create_user "author2@m8pulse.com" "author2" "author123" "ROLE_AUTHOR,ROLE_SUBSCRIBER"

# Designers
echo ""
echo "🎨 COMPTES DESIGNERS"
create_user "designer@m8pulse.com" "designer" "design123" "ROLE_DESIGNER,ROLE_SUBSCRIBER"

# Fournisseurs de données
echo ""
echo "📊 COMPTES FOURNISSEURS DE DONNÉES"
create_user "provider@m8pulse.com" "provider" "provider123" "ROLE_PROVIDER,ROLE_SUBSCRIBER"

# Abonnés
echo ""
echo "👤 COMPTES ABONNÉS"
create_user "subscriber1@m8pulse.com" "subscriber1" "sub123" "ROLE_SUBSCRIBER"
create_user "subscriber2@m8pulse.com" "subscriber2" "sub123" "ROLE_SUBSCRIBER"
create_user "test@m8pulse.com" "testuser" "test123" "ROLE_USER"

echo ""
echo "✅ Tous les comptes de test ont été créés !"
echo ""
echo "📋 Consultez le fichier pour voir tous les identifiants"
echo ""
