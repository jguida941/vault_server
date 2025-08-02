#!/bin/bash

# Get the directory of this script and go to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

echo "🎵 Starting The Vault..."

# Kill any existing servers
pkill -f "node server.js" 2>/dev/null

# Start the server in background
PORT=8888 node server.js &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Starting server..."
sleep 3

# Check if server is running
if curl -s http://localhost:8888 > /dev/null; then
    echo "✅ Server is running on http://localhost:8888"
    
    # Source cargo environment and run Tauri
    source "$HOME/.cargo/env"
    cargo tauri dev
    
    # Kill server when Tauri exits
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Server failed to start"
    exit 1
fi