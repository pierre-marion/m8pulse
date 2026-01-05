# Script de création des utilisateurs de test M8 Pulse
# Exécution: .\create-test-users.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Création des utilisateurs de test M8Pulse" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000/api"

# Fonction pour créer un utilisateur
function Create-User {
    param(
        [string]$username,
        [string]$email,
        [string]$password,
        [string[]]$roles,
        [string]$subscription = "free"
    )
    
    Write-Host "Création de $username ($email)..." -NoNewline
    
    $body = @{
        username = $username
        email = $email
        password = $password
        roles = $roles
        subscriptionLevel = $subscription
    } | ConvertTo-Json
    
    try {
        # Obtenir le token admin (utiliser un compte admin existant)
        $loginBody = @{
            username = "pierre@m8pulse.com"
            password = "Admin123!Pierre"
        } | ConvertTo-Json
        
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
        $token = $loginResponse.token
        
        # Créer l'utilisateur
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri "$baseUrl/admin/users" -Method Post -Body $body -Headers $headers -ErrorAction Stop
        
        Write-Host " ✅ Créé" -ForegroundColor Green
        return $true
    }
    catch {
        $errorMessage = $_.Exception.Message
        if ($errorMessage -like "*already exists*" -or $errorMessage -like "*409*") {
            Write-Host " ⚠️  Existe déjà" -ForegroundColor Yellow
        }
        else {
            Write-Host " ❌ Erreur: $errorMessage" -ForegroundColor Red
        }
        return $false
    }
}

Write-Host "Creation des comptes administrateurs..." -ForegroundColor Magenta
Write-Host ""

Create-User -username "admin" -email "admin@m8pulse.com" -password "password" -roles @("ROLE_USER", "ROLE_ADMIN", "ROLE_EDITOR", "ROLE_DESIGNER", "ROLE_DATA_PROVIDER") -subscription "platinum"
Create-User -username "superadmin" -email "superadmin@m8pulse.com" -password "super123" -roles @("ROLE_USER", "ROLE_ADMIN") -subscription "platinum"

Write-Host ""
Write-Host "Creation des comptes editeurs..." -ForegroundColor Magenta
Write-Host ""

Create-User -username "editor" -email "editor@m8pulse.com" -password "editor123" -roles @("ROLE_USER", "ROLE_SUBSCRIBER", "ROLE_AUTHOR", "ROLE_EDITOR") -subscription "gold"

Write-Host ""
Write-Host "Creation des comptes auteurs..." -ForegroundColor Magenta
Write-Host ""

Create-User -username "author1" -email "author1@m8pulse.com" -password "author123" -roles @("ROLE_USER", "ROLE_SUBSCRIBER", "ROLE_AUTHOR") -subscription "silver"
Create-User -username "author2" -email "author2@m8pulse.com" -password "author123" -roles @("ROLE_USER", "ROLE_SUBSCRIBER", "ROLE_AUTHOR") -subscription "silver"

Write-Host ""
Write-Host "Creation des comptes designers..." -ForegroundColor Magenta
Write-Host ""

Create-User -username "designer" -email "designer@m8pulse.com" -password "design123" -roles @("ROLE_USER", "ROLE_SUBSCRIBER", "ROLE_DESIGNER") -subscription "gold"

Write-Host ""
Write-Host "Creation des comptes data providers..." -ForegroundColor Magenta
Write-Host ""

Create-User -username "provider" -email "provider@m8pulse.com" -password "provider123" -roles @("ROLE_USER", "ROLE_SUBSCRIBER", "ROLE_DATA_PROVIDER") -subscription "silver"

Write-Host ""
Write-Host "Creation des comptes abonnes..." -ForegroundColor Magenta
Write-Host ""

Create-User -username "subscriber1" -email "subscriber1@m8pulse.com" -password "sub123" -roles @("ROLE_USER", "ROLE_SUBSCRIBER") -subscription "free"
Create-User -username "subscriber2" -email "subscriber2@m8pulse.com" -password "sub123" -roles @("ROLE_USER", "ROLE_SUBSCRIBER") -subscription "free"
Create-User -username "testuser" -email "test@m8pulse.com" -password "test123" -roles @("ROLE_USER") -subscription "free"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Creation des utilisateurs terminee!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comptes crees:" -ForegroundColor White
Write-Host ""
Write-Host "ADMIN:" -ForegroundColor Yellow
Write-Host "   admin@m8pulse.com / password"
Write-Host "   superadmin@m8pulse.com / super123"
Write-Host ""
Write-Host "EDITEURS:" -ForegroundColor Cyan
Write-Host "   editor@m8pulse.com / editor123"
Write-Host ""
Write-Host "AUTEURS:" -ForegroundColor Blue
Write-Host "   author1@m8pulse.com / author123"
Write-Host "   author2@m8pulse.com / author123"
Write-Host ""
Write-Host "DESIGNERS:" -ForegroundColor Magenta
Write-Host "   designer@m8pulse.com / design123"
Write-Host ""
Write-Host "DATA PROVIDERS:" -ForegroundColor Green
Write-Host "   provider@m8pulse.com / provider123"
Write-Host ""
Write-Host "ABONNES:" -ForegroundColor White
Write-Host "   subscriber1@m8pulse.com / sub123"
Write-Host "   subscriber2@m8pulse.com / sub123"
Write-Host "   test@m8pulse.com / test123"
Write-Host ""
Write-Host "Utilisez ces comptes pour tester les differentes fonctionnalites!" -ForegroundColor Yellow
Write-Host ""
