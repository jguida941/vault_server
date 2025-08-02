#!/bin/bash

# Get the directory of this script and go to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

echo "🎵 Welcome to The Vault Installer! 🎵"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "1) Run The Vault in browser mode (recommended for first time)"
echo "2) Run The Vault as desktop app"
echo "3) Build The Vault installer for your platform"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting The Vault in browser mode..."
        npm run vault
        ;;
    2)
        echo ""
        echo "🚀 Starting The Vault as desktop app..."
        npm run electron
        ;;
    3)
        echo ""
        echo "Which platform installer do you want to build?"
        echo "1) macOS"
        echo "2) Windows"
        echo "3) Linux"
        echo "4) All platforms"
        read -p "Enter your choice (1-4): " platform
        
        case $platform in
            1)
                echo "📦 Building macOS installer..."
                npm run dist-mac
                ;;
            2)
                echo "📦 Building Windows installer..."
                npm run dist-win
                ;;
            3)
                echo "📦 Building Linux installer..."
                npm run dist-linux
                ;;
            4)
                echo "📦 Building installers for all platforms..."
                npm run dist-all
                ;;
            *)
                echo "Invalid choice"
                ;;
        esac
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Build complete! Check the 'dist' folder for your installer."
        fi
        ;;
    *)
        echo "Invalid choice"
        ;;
esac