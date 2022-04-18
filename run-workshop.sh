#!/bin/bash

# MySpot Modular Monolith Workshop Runner
# This script starts both the backend API and the workshop frontend

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down apps..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $WORKSHOP_PID 2>/dev/null || true

    echo ""
    echo "What would you like to do with Docker containers?"
    echo "  1) Keep PostgreSQL running (faster next startup)"
    echo "  2) Stop and remove containers"
    echo ""
    read -p "Choose [1/2] (default: 1): " choice

    case "$choice" in
        2)
            echo "🐘 Stopping Docker containers..."
            docker-compose -f "$SCRIPT_DIR/docker-compose.yml" down > /dev/null 2>&1 || true
            echo "✅ Containers stopped!"
            ;;
        *)
            echo "🐘 Keeping PostgreSQL running..."
            ;;
    esac

    echo ""
    echo "👋 Goodbye!"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "🚀 Starting MySpot Workshop Environment..."
echo ""

# Start infrastructure (postgres)
echo "🐘 Starting PostgreSQL..."
# Remove any conflicting container with same name
docker rm -f postgres 2>/dev/null || true
docker-compose -f "$SCRIPT_DIR/docker-compose.yml" up -d 2>&1 | grep -v "is obsolete" || true

# Wait for PostgreSQL to be ready
until docker exec postgres pg_isready -U postgres > /dev/null 2>&1; do
    sleep 2
done
echo "✅ PostgreSQL is ready!"

# Start workshop frontend
echo "🎨 Starting Workshop App..."
cd "$SCRIPT_DIR/workshops"
npm install > /dev/null 2>&1
npm run dev:all > /dev/null 2>&1 &
WORKSHOP_PID=$!
echo "✅ Workshop App started!"

# Start backend API
echo "⚙️  Starting Backend API..."
cd "$SCRIPT_DIR/src/Bootstrapper/MySpot.Bootstrapper"
dotnet run --urls "http://localhost:5000" > /dev/null 2>&1 &
BACKEND_PID=$!
echo "✅ Backend API started!"

# Wait a moment for services to fully initialize
sleep 3

# Clear screen and show the summary
clear
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  🎉 MySpot Workshop Environment Ready! 🎉  ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  🐘 PostgreSQL        ✅ Running           ║"
echo "║  ⚙️  Backend API       ✅ Running           ║"
echo "║  🎨 Workshop App      ✅ Running           ║"
echo "║                                            ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  🔗 Backend API:   http://localhost:5000   ║"
echo "║  🔗 Workshop App:  http://localhost:5173   ║"
echo "║                                            ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  Press Ctrl+C to stop all services 🛑      ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Wait for any process to exit
wait
