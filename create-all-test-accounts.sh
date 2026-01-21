#!/bin/bash

# Script pour crÃ©er tous les comptes de test documentÃ©s
echo "ðŸ‘¥ CrÃ©ation des comptes utilisateurs de test..."
echo ""

# Fonction pour crÃ©er un utilisateur via l'API Symfony console
create_user() {
    local email=$1
    local username=$2
    local password=$3
    local roles=$4
    
    echo "ðŸ“ CrÃ©ation de $username ($email)..."
    docker exec m8pulse_backend php bin/console app:create-user "$email" "$username" "$password" "$roles" --no-interaction 2>/dev/null || echo "   â„¹ï¸  Utilisateur dÃ©jÃ  existant"
}

# Administrateurs
echo "ðŸ‘‘ COMPTES ADMINISTRATEURS"
create_user "admin@m8pulse.com" "admin" "admin123" "ROLE_ADMIN,ROLE_EDITOR,ROLE_DESIGNER,ROLE_PROVIDER"
create_user "superadmin@m8pulse.com" "superadmin" "admin123" "ROLE_ADMIN"

# Ã‰diteurs
echo ""
echo "ðŸ“ COMPTES Ã‰DITEURS"
create_user "editor@m8pulse.com" "editor" "editor123" "ROLE_EDITOR,ROLE_AUTHOR,ROLE_SUBSCRIBER"

# Auteurs
echo ""
echo "âœï¸ COMPTES AUTEURS"
create_user "author1@m8pulse.com" "author1" "author123" "ROLE_AUTHOR,ROLE_SUBSCRIBER"
create_user "author2@m8pulse.com" "author2" "author123" "ROLE_AUTHOR,ROLE_SUBSCRIBER"

# Designers
echo ""
echo "ðŸŽ¨ COMPTES DESIGNERS"
create_user "designer@m8pulse.com" "designer" "designer123" "ROLE_DESIGNER,ROLE_SUBSCRIBER"

# Fournisseurs de donnÃ©es
echo ""
echo "ðŸ“Š COMPTES FOURNISSEURS DE DONNÃ‰ES"
create_user "provider@m8pulse.com" "provider" "provider123" "ROLE_PROVIDER,ROLE_SUBSCRIBER"

# AbonnÃ©s
echo ""
echo "ðŸ‘¤ COMPTES ABONNÃ‰S"
create_user "subscriber1@m8pulse.com" "subscriber1" "subscriber123" "ROLE_SUBSCRIBER"
create_user "subscriber2@m8pulse.com" "subscriber2" "subscriber123" "ROLE_SUBSCRIBER"
create_user "test@m8pulse.com" "testuser" "test123" "ROLE_USER"

echo ""
echo "âœ… Tous les comptes de test ont Ã©tÃ© crÃ©Ã©s !"
echo ""
echo "ðŸ“‹ Consultez le fichier pour voir tous les identifiants"
echo ""
