#!/bin/bash

# Default mode is not detached
DETACHED=false

# Parse command-line options
while getopts "d" opt; do
  case $opt in
    d) DETACHED=true ;;
    *) echo "Usage: $0 [-d]"; exit 1 ;;
  esac
done

# Update codebase with latest version
echo "Pulling latest code..."
git pull origin main || { echo "Failed to pull latest code"; exit 1; }

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again. If it is not installed, find details at https://www.docker.com/"
  exit 1
fi

# Build and run Docker containers
if [ "$DETACHED" = true ]; then
  echo "Running in detached mode..."
  docker compose up --build -d || { echo "Failed to build Docker containers"; exit 1; }
else
  echo "Running with local docker container..."
  docker compose up --build || { echo "Failed to build Docker containers"; exit 1; }
fi

# Navigate to frontend in browser
echo "Application is ready at http://localhost:3000..."
sleep 2 # Allow server to start

# Wait for servers to run if not in detached mode; terminate on user input
if [ "$DETACHED" = false ]; then
  echo "Frontend and backend servers are running."
  echo "Press Ctrl+C to stop the servers."
  wait $FRONTEND_PID $BACKEND_PID
else
  echo "Frontend and backend servers are running in detached mode."
fi
