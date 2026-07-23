FROM php:8.4-cli

# Install SQLite extensions
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_sqlite

WORKDIR /app

COPY . /app

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

RUN touch /app/database/database.sqlite
RUN php artisan key:generate --force
RUN php artisan migrate:fresh --seed --force

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
