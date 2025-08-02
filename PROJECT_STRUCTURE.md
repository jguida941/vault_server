# Project Structure - The Vault V2

## Clean Directory Layout

```
vault_server/
│
├──  Core Files
│   ├── server.js              # Express server (main functionality)
│   ├── package.json          # Dependencies and npm scripts
│   ├── package-lock.json    # Lock file
│   ├── README.md           # Main documentation
│   ├── PROJECT_STRUCTURE.md # This file
│   ├── .gitignore         # Git ignore rules
│   └── .env.example      # Environment template
│
├──  public/             # Web Interface
│   ├── working.html      # Main application
│   ├── player.html      # Auto-player window
│   ├── test.html       # Test page
│   └── themes/        # 40+ theme files
│       └── *.json
│
├──  scripts/           # All Launch & Utility Scripts
│   ├── launch_vault.py         # Python launcher (recommended)
│   ├── launch_vault.command   # macOS double-click
│   ├── start_vault.sh        # Simple bash launcher
│   ├── run-vault.sh         # Alternative runner
│   ├── install.sh          # Installation helper
│   └── prepare-release.sh # Release preparation
│
├──  desktop/          # Desktop App Files (WIP)
│   ├── electron.js     # Electron wrapper
│   ├── tauri.conf.json # Tauri config
│   ├── Cargo.toml     # Rust dependencies
│   ├── Cargo.lock    # Rust lock file
│   ├── build.rs      # Build script
│   ├── src/         # Rust source
│   │   ├── main.rs
│   │   └── lib.rs
│   ├── gen/        # Generated files
│   └── target/    # Build output
│
├── assets/         # Images & Icons
│   ├── icon.png
│   └── icons/
│       ├── icon.png
│       ├── icon.ico
│       └── icon.icns
│
├── docs/          # Documentation
│   ├── PROJECT_STATUS.md
│   ├── VAULT_PHASES.md
│   └── VAULT_ROADMAP.md
│
└── release/      # Releases
    ├── RELEASE_NOTES.md
    └── The_Vault_V1.dmg
```

## Quick Start

From the root directory:

```bash
# Easiest method - Python launcher
python3 scripts/launch_vault.py

# Alternative - Direct server start
npm start
# Then open http://localhost:8888

# Desktop app (limited functionality, work in progress, use python launcher)
npm run electron
```

## Key Points

1. **Root directory** - Only essential files (server.js, package.json, README)
2. **scripts/** - All launch and utility scripts organized
3. **desktop/** - All desktop app related files (Electron, Tauri)
4. **public/** - Web interface with themes subfolder
5. **assets/** - All images and icons
6. **docs/** - Additional documentation

## Benefits of This Structure

- ✅ Clean root directory
- ✅ Logical grouping of related files
- ✅ Easy to navigate
- ✅ Clear separation of concerns
- ✅ Ready for version control
- ✅ Professional organization