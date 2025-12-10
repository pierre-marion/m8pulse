FROM php:8.2-apache

# Dépendances système
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql zip gd

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Apache
RUN a2enmod rewrite

# Configuration d'Apache pour pointer vers le dossier public
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    ServerName localhost\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

COPY . /var/www/html

RUN composer install --no-interaction || true

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
