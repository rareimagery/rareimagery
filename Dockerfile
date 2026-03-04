# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
RUN corepack enable
COPY frontend/package.json frontend/pnpm-workspace.yaml frontend/tsconfig.base.json ./
COPY frontend/apps ./apps
COPY frontend/packages ./packages
RUN pnpm install
RUN pnpm build

# Stage 2: PHP application
FROM php:8.3-fpm-bookworm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libwebp-dev \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Configure and install PHP extensions
RUN docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg \
    --with-webp \
    && docker-php-ext-install -j$(nproc) \
    gd \
    pdo \
    pdo_pgsql \
    pgsql \
    zip \
    intl \
    mbstring \
    xml \
    opcache \
    bcmath

# Install APCu for caching
RUN pecl install apcu && docker-php-ext-enable apcu

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# PHP configuration for Drupal
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY docker/php/drupal.ini /usr/local/etc/php/conf.d/drupal.ini

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY composer.json ./
COPY web/modules/custom web/modules/custom/
COPY web/themes/custom web/themes/custom/

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy any remaining files
COPY . .

# Copy built frontend assets into theme
COPY --from=frontend-build /app/frontend/apps/storefront/dist web/themes/custom/rareimagery/dist/storefront
COPY --from=frontend-build /app/frontend/apps/dashboard/dist web/themes/custom/rareimagery/dist/dashboard

# Fix permissions and create private files directory
RUN chown -R www-data:www-data /var/www/html/web/sites/default \
    && mkdir -p /var/www/html/web/sites/default/files \
    && chmod 755 /var/www/html/web/sites/default/files \
    && mkdir -p /var/www/html/private/files \
    && chown www-data:www-data /var/www/html/private/files

EXPOSE 9000
CMD ["php-fpm"]
