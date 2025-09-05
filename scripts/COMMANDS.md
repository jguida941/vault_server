# The Vault - Command Reference

## 🚀 Quick Start - ONLY USE THESE

### Best Method (Recommended)
```bash
cd /Users/jguida941/Desktop/vault_server
python3 scripts/launch_vault.py
```
This handles everything automatically!

### Alternative Methods
```bash
# Direct npm commands
npm start          # Start server on port 8888
npm run vault      # Start + open browser
npm stop           # Stop server

# Access in browser
http://localhost:8888
```

## ✅ VERIFIED WORKING Commands

### Server Control
```bash
npm start          # Start server on port 8888
npm stop           # Stop the server  
npm restart        # Stop then start
npm run vault      # Start + auto-open browser
npm run open       # Just open browser (server must be running)
```

### Desktop App (Only if Electron installed)
```bash
npm run electron   # Run as desktop app
npm run electron-dev # Dev mode with console
```

### Build Commands (Requires Electron Builder)
```bash
npm run dist-mac   # Build macOS .dmg
npm run dist-win   # Build Windows .exe
npm run dist-linux # Build Linux AppImage
```

## ⚠️ Commands That DON'T Work Without Additional Setup

### Tauri Commands (Requires Rust/Cargo)
```bash
npm run tauri      # Needs Rust installed
npm run tauri-build # Needs cargo command
```

### Shell Scripts (May need permissions)
```bash
./scripts/install.sh  # Run: chmod +x scripts/install.sh first
./scripts/start_vault.sh # Alternative launcher
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