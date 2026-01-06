Write-Host "Demarrage de M8Pulse avec Docker..." -ForegroundColor Cyan
Write-Host ""

# Arreter les conteneurs existants
Write-Host "Nettoyage des anciens conteneurs..." -ForegroundColor Yellow
docker compose down -v

# Construction des images
Write-Host "Construction des images Docker..." -ForegroundColor Yellow
docker compose build

# Demarrage des services
Write-Host "Demarrage des services..." -ForegroundColor Yellow
docker compose up -d

# Attendre que la base de donnees soit prete
Write-Host "Attente de la base de donnees..." -ForegroundColor Yellow
Write-Host "   Verification de la disponibilite de MySQL..."
$maxAttempts = 30
$attempt = 0
do {
    $attempt++
    $result = docker exec m8pulse_db mysqladmin ping -h localhost -u m8user -pm8password --silent 2>$null
    if ($LASTEXITCODE -eq 0) {
        break
    }
    if ($attempt -eq $maxAttempts) {
        Write-Host "La base de donnees n'a pas demarre dans les temps" -ForegroundColor Red
        exit 1
    }
    Write-Host "   Tentative $attempt/$maxAttempts..."
    Start-Sleep -Seconds 2
} while ($true)
Write-Host "   Base de donnees prete!" -ForegroundColor Green

# Installation des dependances Symfony
Write-Host "Installation des dependances Symfony..." -ForegroundColor Yellow
docker exec m8pulse_backend composer install

# Generer les cles JWT si elles n'existent pas
Write-Host "Generation des cles JWT..." -ForegroundColor Yellow
$jwtCheck = docker exec m8pulse_backend test -f config/jwt/private.pem 2>$null
if ($LASTEXITCODE -ne 0) {
    docker exec m8pulse_backend sh -c "mkdir -p config/jwt && openssl genrsa -out config/jwt/private.pem -aes256 -passout pass:votre_passphrase 4096 && openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem -passin pass:votre_passphrase"
    Write-Host "Cles JWT generees" -ForegroundColor Green
} else {
    Write-Host "Cles JWT deja existantes" -ForegroundColor Green
}

# Verifier si la base de donnees existe
Write-Host "Verification de la base de donnees..." -ForegroundColor Yellow
$dbCheck = docker exec m8pulse_db mysql -u root -prootpassword -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'm8pulse';" 2>$null
$dbExists = $dbCheck -match "m8pulse"

if (-not $dbExists) {
    Write-Host "   Creation de la base de donnees..."
    docker exec m8pulse_db mysql -u root -prootpassword -e "CREATE DATABASE m8pulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>$null
    docker exec m8pulse_db mysql -u root -prootpassword -e "GRANT ALL PRIVILEGES ON m8pulse.* TO 'm8user'@'%';" 2>$null
}

# Executer les migrations Doctrine
Write-Host "Execution des migrations..." -ForegroundColor Yellow
docker exec m8pulse_backend php bin/console doctrine:migrations:migrate --no-interaction

# Creer les utilisateurs administrateurs par defaut
Write-Host "Creation des utilisateurs administrateurs par defaut..." -ForegroundColor Yellow
docker exec m8pulse_backend php bin/console app:create-admins --no-interaction 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Utilisateurs administrateurs deja crees" -ForegroundColor Gray
}

Write-Host ""
Write-Host "M8Pulse est maintenant en ligne !" -ForegroundColor Green
Write-Host ""
Write-Host "Services disponibles :" -ForegroundColor Cyan
Write-Host "   - Frontend (React):     http://localhost:3000"
Write-Host "   - Backend (Symfony):    http://localhost:8000"
Write-Host "   - PHPMyAdmin:           http://localhost:8080"
Write-Host "   - Base de donnees:      localhost:3306"
Write-Host ""
Write-Host "Informations de connexion base de donnees :" -ForegroundColor Cyan
Write-Host "   - User: m8user"
Write-Host "   - Password: m8password"
Write-Host "   - Database: m8pulse"
Write-Host ""
Write-Host "Commandes utiles :" -ForegroundColor Cyan
Write-Host "   - Voir les logs:        docker-compose logs -f"
Write-Host "   - Arreter:              docker-compose down"
Write-Host "   - Redemarrer:           docker-compose restart"
Write-Host ""
