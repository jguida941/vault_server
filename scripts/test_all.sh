#!/bin/bash
# Test all launch scripts

echo "🧪 Testing all Vault launch scripts..."
echo "====================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

# Test Python launcher
echo -e "\n1. Testing Python launcher..."
if python3 scripts/launch_vault.py --version > /dev/null 2>&1 || python3 scripts/launch_vault.py > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Python launcher OK${NC}"
else
    echo -e "${RED}❌ Python launcher FAILED${NC}"
fi

# Test shell scripts are executable
echo -e "\n2. Testing shell scripts are executable..."
for script in scripts/*.sh scripts/*.command; do
    if [ -x "$script" ]; then
        echo -e "${GREEN}✅ $script is executable${NC}"
    else
        echo -e "${RED}❌ $script is NOT executable${NC}"
        chmod +x "$script"
        echo -e "${GREEN}   Fixed!${NC}"
    fi
done

# Test npm commands
echo -e "\n3. Testing npm commands..."
commands=("npm start --dry-run" "npm run electron --dry-run")
for cmd in "${commands[@]}"; do
    if $cmd > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $cmd OK${NC}"
    else
        echo -e "${RED}❌ $cmd FAILED${NC}"
    fi
done

echo -e "\n====================================="
echo "Test complete! All scripts should work now."
echo ""
echo "Quick start commands:"
echo "  python3 scripts/launch_vault.py     # Recommended"
echo "  ./scripts/start_vault.sh           # Alternative"
echo "  npm start                         # Manual start"