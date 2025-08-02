# The Vault - Command Reference

## 🚀 Quick Start Commands

All commands should be run from the project root directory: `/Users/jguida941/Desktop/vault_server/`

### Recommended Launch Method
```bash
python3 scripts/launch_vault.py
```

### Alternative Launch Methods
```bash
# Shell script launcher
./scripts/start_vault.sh

# macOS double-click
# Just double-click: scripts/launch_vault.command

# Manual start
npm start
# Then open http://localhost:8888 in browser
```

## 📋 All Available Commands

### Server Commands
```bash
npm start          # Start server on port 8888
npm stop           # Stop the server
npm restart        # Restart server
npm run vault      # Start server + auto-open browser
```

### Desktop App Commands (Work in Progress)
```bash
npm run electron   # Run Electron app (limited features)
npm run tauri      # Run Tauri app (experimental)
```

### Build Commands
```bash
npm run dist       # Build for current platform
npm run dist-mac   # Build macOS .dmg
npm run dist-win   # Build Windows .exe
npm run dist-linux # Build Linux AppImage
```

### Utility Scripts
```bash
./scripts/install.sh         # Interactive installer
./scripts/prepare-release.sh # Prepare for release
```

## 🛠️ Troubleshooting

### Port Already in Use
The Python launcher handles this automatically, but manually:
```bash
lsof -ti:8888 | xargs kill -9
```

### Make Scripts Executable
```bash
chmod +x scripts/*.sh scripts/*.command
```

### Missing Dependencies
```bash
npm install
```

## 📝 Notes

- The web server version is fully functional
- Desktop apps (Electron/Tauri) are work in progress
- Always run commands from the project root directory
- Python launcher is the most reliable method