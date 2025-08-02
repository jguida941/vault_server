#!/bin/bash
# The Vault - Quick Launch Script for macOS
# Double-click this file to start The Vault

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to script directory
cd "$DIR"

# Run the Python launcher
python3 launch_vault.py

# Keep terminal open if there's an error
if [ $? -ne 0 ]; then
    echo "Press any key to exit..."
    read -n 1
fi