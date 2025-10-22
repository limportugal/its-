# ===============================
# 🧱 STAGE 1: Base Image
# ===============================
FROM ubuntu:latest AS base

# Set timezone and disable interactive prompts
ENV TZ=Asia/Manila
ENV DEBIAN_FRONTEND=noninteractive

# Install PHP 8.4 and system tools
RUN apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    git \
    unzip \
    ca-certificates \
 && update-ca-certificates \
 && add-apt-repository ppa:ondrej/php -y \
 && apt-get update \
 && apt-get install -y \
    php8.4-cli \
    php8.4-common \
    php8.4-mbstring \
    php8.4-xml \
    php8.4-mysql \
    php8.4-curl \
    php8.4-bcmath \
    php8.4-zip \
    php8.4-soap \
    php8.4-readline \
    php8.4-intl \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# ===============================
# 📦 STAGE 2: Dependencies
# ===============================
FROM base AS dependencies

# Install Composer
RUN curl -sS --retry 5 --retry-delay 5 --connect-timeout 60 -o composer-setup.php https://getcomposer.org/installer \
 && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
 && rm composer-setup.php \
 && composer config --global process-timeout 7200

# Set Composer environment variables for better performance
ENV COMPOSER_MEMORY_LIMIT=-1 \
    COMPOSER_PROCESS_TIMEOUT=7200 \
    COMPOSER_DISABLE_XDEBUG_WARN=1

# Install NVM and Node.js v24
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=24.1.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash \
 && . "$NVM_DIR/nvm.sh" \
 && nvm install $NODE_VERSION \
 && nvm alias default $NODE_VERSION \
 && nvm use default

# Update PATH
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin:${PATH}"

# Enable Corepack and prepare PNPM
RUN corepack enable \
 && corepack prepare pnpm@latest --activate

# Working directory for dependencies
WORKDIR /deps

# Copy lock and dependency files
COPY composer.json composer.lock ./
COPY package.json pnpm-lock.yaml ./

# Install PHP dependencies with optimizations
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --no-progress \
    --ignore-platform-reqs \
    && composer clear-cache

# Install Node.js dependencies via pnpm
RUN pnpm install --frozen-lockfile

# ===============================
# 🏗️ STAGE 3: Builder
# ===============================
FROM dependencies AS builder

# Set working directory
WORKDIR /builder

# Copy installed dependencies
COPY --from=dependencies /deps/vendor ./vendor
COPY --from=dependencies /deps/node_modules ./node_modules

# Copy the rest of the app
COPY . .

# Build steps
RUN composer dump-autoload --optimize \
 && pnpm run build

# ===============================
# 🚀 STAGE 4: Runner
# ===============================
FROM base AS runner

# Create non-root user for security
RUN groupadd -g 1001 appuser \
 && useradd -u 1001 -g appuser -s /bin/bash -m appuser

# Set working directory
WORKDIR /app

# Copy application files
COPY --from=builder --chown=appuser:appuser /builder/vendor ./vendor/
COPY --from=builder --chown=appuser:appuser /builder/public ./public/
COPY --from=builder --chown=appuser:appuser /builder/app ./app/
COPY --from=builder --chown=appuser:appuser /builder/bootstrap ./bootstrap/
COPY --from=builder --chown=appuser:appuser /builder/config ./config/
COPY --from=builder --chown=appuser:appuser /builder/database ./database/
COPY --from=builder --chown=appuser:appuser /builder/resources ./resources/
COPY --from=builder --chown=appuser:appuser /builder/routes ./routes/
COPY --from=builder --chown=appuser:appuser /builder/storage ./storage/
COPY --from=builder --chown=appuser:appuser /builder/artisan ./
COPY --from=builder --chown=appuser:appuser /builder/.env.example ./.env

# Set proper permissions
RUN mkdir -p \
    storage/framework/{sessions,views,cache} \
    storage/logs \
    bootstrap/cache \
 && chown -R appuser:appuser \
    storage \
    bootstrap/cache \
 && chmod -R 775 \
    storage \
    bootstrap/cache

# Switch to non-root user
USER appuser

# Generate application key
RUN php artisan key:generate --force

# Expose Laravel dev server port
EXPOSE 9000

# Start Laravel built-in dev server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=9000"]
