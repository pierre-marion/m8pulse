Write-Host "Demarrage de M8Pulse avec Docker"
Write-Host ""

# Nettoyage
Write-Host "Nettoyage des conteneurs..."
docker compose down -v

# Build
Write-Host "Construction des images..."
docker compose build

# Start
Write-Host "Demarrage des services..."
docker compose up -d

# Attente MySQL
Write-Host "Attente de la base de donnees..."
$maxAttempts = 30
$attempt = 0
$dbReady = $false

while ($attempt -lt $maxAttempts) {
    docker exec m8pulse_db mysqladmin ping -h localhost -u m8user -pm8password --silent 2>$null
    if ($LASTEXITCODE -eq 0) {
        $dbReady = $true
        break
    }
    $attempt++
    Write-Host "Tentative $attempt/$maxAttempts..."
    Start-Sleep -Seconds 2
}

if (-not $dbReady) {
    Write-Host "La base de donnees n'a pas demarre"
    exit 1
}

Write-Host "Base de donnees prete"

# Composer
Write-Host "Installation des dependances Symfony..."
docker exec m8pulse_backend composer install

# JWT
Write-Host "Verification des cles JWT..."
docker exec m8pulse_backend sh -c '
if [ ! -f config/jwt/private.pem ]; then
  mkdir -p config/jwt
  openssl genrsa -out config/jwt/private.pem -aes256 -passout pass:votre_passphrase 4096
  openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem -passin pass:votre_passphrase
  echo "Cles JWT generees"
else
  echo "Cles JWT deja existantes"
fi
'

# Base de donnees
Write-Host "Verification de la base..."
$dbCheck = docker exec m8pulse_db mysql -u root -prootpassword -e "SHOW DATABASES LIKE 'm8pulse';" 2>$null

if (-not ($dbCheck -match "m8pulse")) {
    Write-Host "Creation de la base m8pulse..."
    docker exec m8pulse_db mysql -u root -prootpassword -e `
    "CREATE DATABASE m8pulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     GRANT ALL PRIVILEGES ON m8pulse.* TO 'm8user'@'%';"
}

# Migrations
Write-Host "Execution des migrations..."
docker exec m8pulse_backend php bin/console doctrine:migrations:migrate --no-interaction

# Admins
Write-Host "Creation des admins..."
docker exec m8pulse_backend php bin/console app:create-admins --no-interaction
if ($LASTEXITCODE -ne 0) {
    Write-Host "Admins deja existants"
}

Write-Host ""
Write-Host "M8Pulse est en ligne"
Write-Host ""
Write-Host "Frontend  : http://localhost:3000"
Write-Host "Backend   : http://localhost:8000"
Write-Host "PHPMyAdmin: http://localhost:8080"
