#!/bin/bash

echo "🚀 Starting ShopSmart Full Stack App..."

# Stop old containers
docker-compose down

# Build and run
docker-compose up --build -d

echo "✅ App running:"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
