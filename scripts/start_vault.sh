#!/bin/bash
# The Vault - Simple Start Script

# Get the directory of this script and go to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

echo "🔥 THE VAULT 🔒 - Starting..."

# Kill any existing process on port 8888
echo "🔍 Checking port 8888..."
if lsof -ti:8888 > /dev/null 2>&1; then
    echo "⚠️  Port 8888 in use, clearing..."
    lsof -ti:8888 | xargs kill -9 2>/dev/null
    sleep 1
    echo "✓ Port cleared"
fi

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start server
echo "🚀 Starting server..."
npm start &

# Wait for server to start
sleep 3

# Open in browser
echo "🌐 Opening browser..."
open http://localhost:8888

echo ""
echo "================================"
echo "✅ The Vault is running!"
echo "Press Ctrl+C to stop"
echo "================================"

# Wait for Ctrl+C
wait