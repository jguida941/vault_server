# The Vault - Project Structure

## Complete File Tree

```
vault_server/
├── server.js                 # Express server (port 8888)
├── package.json              # Node dependencies & scripts  
├── package-lock.json         # Dependency lock file
├── .env                      # Environment variables (API keys)
├── .env.example              # Example environment template
├── README.md                 # Main documentation
├── PROJECT_STRUCTURE.md      # This file (you are here)
│
├── public/                   # Frontend files (served by Express)
│   ├── working.html          # Main vault interface
│   ├── player.html           # Auto-play player window
│   ├── test.html            # Test page
│   └── themes/              # 40+ theme JSON files
│       ├── themes.json      # Theme registry
│       └── [40 theme files] # Individual theme configs
│
├── scripts/                  # Launch & utility scripts
│   ├── launch_vault.py       # ✅ MAIN LAUNCHER - Python script
│   ├── COMMANDS.md          # Command documentation
│   ├── install.sh           # Dependency installer
│   ├── start_vault.sh       # Bash server starter
│   ├── run-vault.sh         # Tauri launcher (needs Rust)
│   ├── test_all.sh          # Test runner
│   ├── prepare-release.sh   # Release preparation
│   └── launch_vault.command # macOS double-click launcher
│
├── desktop/                  # Desktop app files (Electron/Tauri)
│   ├── electron.js          # Electron main process
│   ├── tauri.conf.json      # Tauri configuration
│   ├── gen/                 # Generated Tauri files
│   └── target/              # Rust build artifacts
│
├── docs/                     # Documentation
│   ├── VAULT_PHASES.md      # Development phases
│   ├── VAULT_ROADMAP.md     # Future features
│   └── PROJECT_STATUS.md    # Current status
│
├── release/                  # Release files
│   └── RELEASE_NOTES.md     # Version history
│
└── node_modules/            # Installed packages (gitignored)
```

## Quick Start Commands

```bash
# RECOMMENDED - Python launcher (handles everything)
python3 scripts/launch_vault.py

# Alternative - Direct npm commands
npm start         # Start server on port 8888
npm run vault     # Start server + open browser
npm stop          # Stop the server

# Desktop app (if Electron installed)
npm run electron  # Run as desktop app
```

## Server Details

- **Port**: 8888 (NOT 8080!)
- **URL**: http://localhost:8888
- **Auto-redirects**: / → /working.html

## API Endpoints

- `/api/youtube/channel/:id` - Fetch YouTube channel videos
- `/api/download` - Download MP3 from YouTube
- `/embed/:id` - YouTube video embed player

## Key Files Explained

### Core
- **server.js** - Express server with YouTube API integration
- **package.json** - Dependencies and npm scripts
- **.env** - YouTube API key (optional)

### Frontend
- **public/working.html** - Main vault interface
- **public/player.html** - Auto-play window
- **public/themes/** - 40 custom themes

### Scripts
- **scripts/launch_vault.py** - Main launcher (recommended)
- **scripts/COMMANDS.md** - All available commands