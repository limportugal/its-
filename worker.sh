#!/bin/bash

# Laravel Queue Worker Startup Script
# This script starts the Laravel queue worker for email processing

echo "Starting Laravel Queue Worker..."

# Check if we're in the correct directory
if [ ! -f "artisan" ]; then
    echo "Error: artisan file not found. Please run this script from the Laravel project root."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found. Please ensure your environment is configured."
    exit 1
fi

# Start the queue worker
echo "Starting queue worker with the following settings:"
echo "- Sleep: 3 seconds"
echo "- Max tries: 3"
echo "- Max time: 3600 seconds (1 hour)"
echo ""
echo "Press Ctrl+C to stop the worker"
echo ""

php artisan queue:work --sleep=3 --tries=3 --max-time=3600 --verbose
