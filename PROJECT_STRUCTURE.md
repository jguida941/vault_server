# The Vault - Project Structure

## File Tree

```
vault_server/
├── server.js                 # Express server (port 8888)
├── package.json              # Node dependencies & scripts
├── README.md                 # Main documentation
├── LICENSE.md                # MIT License
│
├── public/                   # Frontend files (served by Express)
│   ├── v2.html               # Main vault interface
│   ├── themes/               # 10 theme JSON files
│   │   ├── material-dark.json
│   │   ├── material-light.json
│   │   ├── ocean.json
│   │   ├── forest.json
│   │   ├── sunset.json
│   │   ├── cyber.json
│   │   ├── rose.json
│   │   ├── midnight.json
│   │   ├── mono.json
│   │   └── amber.json
│   │
│   └── src/                  # Modular JavaScript
│       ├── app.js            # Application entry point
│       ├── core/             # Core modules
│       │   ├── storage.js    # LocalStorage wrapper
│       │   └── state.js      # State management
│       ├── theme/            # Theme system
│       │   ├── themes.js     # Theme loader
│       │   ├── themeManager.js
│       │   └── tokens.js     # Design tokens
│       ├── ui/               # UI components
│       │   ├── components.js
│       │   ├── icons.js
│       │   └── notifications.js
│       ├── player/           # Player modules
│       │   ├── playlist.js
│       │   └── youtubePlayer.js
│       ├── utils/            # Utilities
│       │   └── validators.js
│       └── styles/           # Stylesheets
│           └── main.css
│
├── img/                      # README screenshots
│
├── scripts/                  # Launch scripts
│   ├── launch_vault.py       # Python launcher (recommended)
│   ├── launch_vault.command  # macOS double-click launcher
│   ├── launch_vault.bat      # Windows launcher
│   └── COMMANDS.md           # Command documentation
│
├── icons/                    # App icons
├── assets/                   # Additional assets
└── desktop/                  # Desktop app files (Electron/Tauri)
```

## Quick Start

```bash
# RECOMMENDED - Python launcher
python3 scripts/launch_vault.py

# Alternative - npm commands
npm start         # Start server on port 8888
npm run vault     # Start server + open browser
npm stop          # Stop the server
```

## Server Details

- **Port**: 8888
- **URL**: http://localhost:8888
- **Main page**: /v2.html (auto-redirected from /)

## Key Files

### Core
- **server.js** - Express server with embed endpoint
- **package.json** - Dependencies and npm scripts

### Frontend
- **public/v2.html** - Main vault interface (modular)
- **public/themes/** - 10 customizable theme JSON files
- **public/src/** - Modular ES6 JavaScript

### Scripts
- **scripts/launch_vault.py** - Main launcher (recommended)
- **scripts/COMMANDS.md** - All available commands

## Custom Themes

Add custom themes by creating JSON files in `/public/themes/`. See existing themes for the format.
