#!/bin/bash

case "$1" in
  "build")
    echo "🏗️ Building Docker image (with no cache)..."
    docker-compose build --no-cache
    ;;
    
  "start")
    echo "🚀 Starting container..."
    docker-compose up -d
    ;;
    
  "stop")
    echo "🛑 Stopping container..."
    docker-compose down
    ;;
    
  "restart")
    echo "🔄 Restarting container..."
    docker-compose down
    docker-compose up -d
    ;;
    
  "shell")
    echo "📦 Entering container shell..."
    docker-compose exec app bash
    ;;
    
  "logs")
    echo "📋 Showing container logs..."
    docker-compose logs -f
    ;;
    
  "clean")
    echo "🧹 Cleaning Docker system..."
    docker-compose down --remove-orphans
    docker system prune -f
    ;;

  *)
    echo "Usage: ./docker.sh [command]"
    echo "Commands:"
    echo "  build   - Build the Docker image (with no cache)"
    echo "  start   - Start the container"
    echo "  stop    - Stop the container"
    echo "  restart - Restart the container"
    echo "  shell   - Enter container shell"
    echo "  logs    - Show container logs"
    echo "  clean   - Clean Docker system"
    ;;
esac 