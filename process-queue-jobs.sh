#!/bin/bash
echo "Processing Laravel Queue Jobs..."
echo "Press Ctrl+C to stop"
echo

while true; do
    php artisan queue:work --once --verbose
    sleep 5
done
