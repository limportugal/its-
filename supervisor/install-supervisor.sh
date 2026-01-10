#!/bin/bash

# Install Supervisor on Ubuntu/Debian
echo "Installing Supervisor..."

# Update package list
sudo apt update

# Install supervisor
sudo apt install -y supervisor

# Create supervisor configuration directory if it doesn't exist
sudo mkdir -p /etc/supervisor/conf.d

# Copy Laravel worker configuration
sudo cp supervisor/laravel-worker-production.conf /etc/supervisor/conf.d/laravel-worker.conf

# Reload supervisor configuration
sudo supervisorctl reread

# Update supervisor
sudo supervisorctl update

# Start the worker
sudo supervisorctl start laravel-worker:*

echo "Supervisor installation and configuration completed!"
echo "To manage the workers, use:"
echo "  sudo supervisorctl status"
echo "  sudo supervisorctl start laravel-worker:*"
echo "  sudo supervisorctl stop laravel-worker:*"
echo "  sudo supervisorctl restart laravel-worker:*"
echo "  php artisan queue:failed"
echo "  php artisan queue:retry all"
echo "  php artisan queue:flush"