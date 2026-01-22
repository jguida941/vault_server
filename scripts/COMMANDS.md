# The Vault - Launch Guide

## Quick Start

### macOS
Double-click `launch_vault.command` or run:
```bash
./scripts/launch_vault.command
```

### Windows
Double-click `launch_vault.bat` or run:
```cmd
scripts\launch_vault.bat
```

### Any Platform (Python)
```bash
python3 scripts/launch_vault.py
```

## Alternative Methods

### Using npm
```bash
npm start          # Start server on port 8888
npm run vault      # Start + open browser
npm stop           # Stop server
```

### Direct Access
Open http://localhost:8888 in your browser after starting the server.

## Troubleshooting

### Port Already in Use
The Python launcher handles this automatically. To manually clear:

**macOS/Linux:**
```bash
lsof -ti:8888 | xargs kill -9
```

**Windows:**
```cmd
netstat -ano | findstr :8888
taskkill /PID <PID> /F
```

### Missing Dependencies
```bash
npm install
```

### Make Scripts Executable (macOS/Linux)
```bash
chmod +x scripts/launch_vault.command
```
