# THE VAULT V1 - Your Personal Music Library

**The Vault** is a revolutionary music player that transforms YouTube into your personal, ad-free music library. Built as a native desktop application, it lets you curate, organize, and play your favorite tracks without interruptions, tracking, or advertisements.

## 🚀 NEW: Easy Python Launcher

**Easiest way to run The Vault:**
**Located in the scripts directory** 
```bash
python3 scripts/launch_vault.py
```

This will automatically:
- Check for Node.js
- Install dependencies
- Clear any port conflicts
- Start the server
- Open your browser

**Note:** The Electron desktop app is currently a work in progress. Use the Python launcher above for full functionality.

## 🚧 Known Issues & TODO

### Features to Continue Working On:
1. **Analytics System** - Implement comprehensive analytics tracking
2. **Radio Mode Issues**:
   - Fix: Songs don't change when playlist is launched
   - Fix: Auto-advance between tracks in radio playlists
   - Improve playlist queue management
3. **Desktop App** - Complete Electron app functionality

## 🎯 Purpose & Vision

The Vault was created to solve a simple problem: YouTube has amazing music content, but the experience is cluttered with ads, recommendations, and distractions. The Vault strips all that away, giving you:

- **Pure Music Experience**: No ads, no interruptions, just your music
- **Personal Library**: Save and organize your favorite tracks permanently
- **Privacy First**: No tracking, no analytics, your data stays on your device
- **Native Performance**: Lightning-fast desktop app, not a sluggish web wrapper
- **Offline Ready**: Once saved, your library persists even without internet

## 🚀 Version 1.0 Features

This is **Version 1** of The Vault, focusing on core music playback and library management:

### ✅ What's Working in V1
- **Add Videos**: Paste any YouTube URL to add to your library
- **Categorize**: Organize tracks by genre (Hip Hop, Rock, Electronic, etc.)
- **Private Mode**: Hide sensitive tracks with privacy toggle
- **Save/Load**: Export and import your entire collection
- **40+ Themes**: Customize your vault with unique visual themes
- **Native App**: One-click launch desktop app
- **Browser Mode**: Full functionality including auto-player and delete

### 📝 V1 Known Limitations (Desktop App)
- **Auto-Player**: Currently only works in browser mode (security restriction)
- **Delete Button**: Currently only works in browser mode (security restriction)
- **Workaround**: Use `npm run vault` for browser mode with full features

### 🚧 Coming in V2
- Full auto-player support in desktop app
- Delete functionality in desktop app
- Music visualizer integration
- Playlist management
- Offline video caching
- Advanced search and filters
- Keyboard shortcuts

## 🎨 Latest Updates (July 2025)

### Complete Backend Integration & Feature Overhaul ⚡
- **✅ Fixed Radio Mode**: Updated live stream IDs to working YouTube streams (Lofi Girl, Coffee Shop Radio, etc.)
- **✅ YouTube API Integration**: Real channel fetching for Podcast mode with `/api/youtube/channel/:channelId` endpoint
- **✅ Working Podcast Downloads**: ytdl-core backend integration for MP3 downloads via `/api/download` endpoint
- **✅ Player Speed Controls**: 0.5x to 2x playback speed options in player interface
- **✅ Sleep Timer**: 15min to 2hr auto-pause timer for podcast listening
- **✅ Memory Auto-Compact**: Automatic storage cleanup when reaching 93% capacity (5MB threshold)

### YouTube API Setup (Optional - Free Tier Available)
- **Free Quota**: 10,000 API units per day (sufficient for most users)
- **No Billing Required**: YouTube API v3 is completely free for standard usage
- **Fallback Mode**: System works with mock data if no API key provided
- **Setup Instructions**: See `.env` file for API key configuration

### Previous Major Theme System Overhaul
- **40 Unique Themes**: Each theme now has completely distinct visual personality
- **Dynamic Typography**: Unique fonts, weights (300-900), letter spacing for each theme
- **Custom Button Styles**: Theme-specific gradients, shadows, and hover effects
- **No More Italics**: Replaced all cursive fonts with readable alternatives
- **Full Theme Coverage**: All UI elements now respond to theme changes

### Bug Fixes
- Fixed "Play Current Category Only" button - now correctly filters videos by category
- Fixed Radio mode "Video unavailable" errors with working stream IDs
- Improved text readability on light themes with subtle shadows
- Fixed CSS vendor prefix warnings for better browser compatibility
- All hardcoded colors replaced with theme variables

## Features

### Current Features
- **Ad-free YouTube playback** using youtube-nocookie.com embeds
- **No tracking or analytics** - privacy first
- **Add videos by URL or video ID** with YouTube thumbnail preview
- **Professional UI** with 40+ themes and grid/list view toggle
- **Radio Mode** with working live streams (Lofi Girl, Coffee Shop Radio, etc.)
- **Podcast Mode** with real YouTube channel fetching and MP3 downloads
- **Video categorization system** (Hip Hop, Rock, Electronic, Chill, Podcast, custom categories)
- **Auto-play player** with shuffle, repeat, speed controls (0.5x-2x), and sleep timer
- **Memory management** with auto-compact at 5MB threshold
- **LocalStorage persistence** with automatic cleanup
- **Save/load collections** as JSON files
- **Public/Private mode** toggle
- **Keyboard shortcuts** in player
- **Real-time statistics** tracking

### Auto-Play Player
- Opens in separate window for uninterrupted playback
- Automatically advances to next video after completion
- 5-second countdown between videos
- Full playback controls (Previous/Next/Play/Pause)
- Shuffle mode for random playback
- Repeat mode for continuous looping
- Queue sidebar showing all videos
- Click any video in queue to play
- Keyboard shortcuts:
  - Space: Play/Pause
  - Left/Right arrows: Previous/Next
  - S: Toggle shuffle
  - R: Toggle repeat
  - Q: Show/hide queue

## 📦 Installation for The Vault V1

### Download Pre-built App (Easiest)
1. Download `The_Vault_V1.dmg` from [Releases](https://github.com/jguida941/vault-player/releases)
2. Open the DMG file
3. Drag The Vault to Applications
4. Double-click to launch!

### Build From Source
Follow the Quick Start instructions below if you want to build from source.

## Quick Start - Choose Your Setup

### Requirements
- Node.js 16+ installed ([Download here](https://nodejs.org/))
- npm (comes with Node.js)

### Option 1: Python Launcher (Easiest) 🚀
```bash
# Clone the repository
git clone https://github.com/jguida941/vault-player.git
cd vault-player

# Run the Python launcher
python3 scripts/launch_vault.py
```
The launcher will:
- Check for Node.js
- Install all dependencies
- Clear port conflicts
- Start server and open browser

### Option 2: Browser Mode 🌐
```bash
# Clone and install
git clone https://github.com/jguida941/vault-player.git
cd vault-player
npm install

# Start server and open browser
npm run vault
```

### Access Methods
- **Desktop App**: Runs as standalone application with native menus
- **Browser Mode**: Visit http://localhost:8888 after starting server
- **Installed App**: Double-click the app after building installer

## For Justin

### Running the Server (Quick Reminder)
```bash
# Navigate to your vault folder
cd /Users/jguida941/Desktop/vault_server

# Start the server (it runs on port 8888)
npm start

# Or use the all-in-one command that starts server AND opens browser
npm run vault
```

### Adding Your Music
1. Go to http://localhost:8888 after starting the server
2. Copy any YouTube URL and paste it in the input box
3. Click "Play" - it'll ask for a title and category
4. Your music is automatically saved in the browser

### Customizing Your Path
If you move the vault_server folder, just update your cd command:
```bash
# Example if you move it to Documents
cd /Users/jguida941/Documents/vault_server
npm start
```

### Quick Commands Cheat Sheet
- `npm start` - Start the server
- `npm stop` - Stop the server
- `npm restart` - Restart if acting weird
- `npm run vault` - Start + auto-open browser (easiest!)

### Pro Tips
- Use categories to organize (Hip Hop, Chill, Workout, etc.)
- Private mode hides videos you mark as private
- Save your collection regularly with "Save Collection" button
- Auto-player lets you play entire playlists hands-free

## Usage

### Adding Videos
1. Paste a YouTube URL or video ID in the input field
2. Click "Play" button
3. Enter a title when prompted
4. Choose a category or create a new one
5. Optionally mark as private (only visible in private mode)

### Managing Your Collection

#### Categories
- Filter videos by clicking category pills
- Create custom categories with "+ Add Category" button
- Videos display their category in brackets

#### Saving Collections
- Click "Save Collection" to export your vault as JSON
- File includes all videos, categories, and metadata
- Dated filename for easy organization

#### Loading Collections
- Click "Load Collection" to import a saved JSON file
- Merges videos and categories into your vault
- Preserves all metadata

#### Auto-Play Mode
- Click "Open Auto-Player (All Videos)" to play entire collection
- Click "Play Current Category Only" to play filtered videos
- Player opens in new window with full controls

### Private Mode
- Toggle switch in top-right corner
- Public mode: Shows instructions and all features
- Private mode: Hides instructions, only shows videos marked as non-private

## How It Works - System Flowchart

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User Opens    │────▶│  server.js:8888  │────▶│  Redirects to   │
│ localhost:8888  │     │  Express Server  │     │ /working.html   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                            │
                                                            ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Paste YouTube  │────▶│  Extract Video   │────▶│  Store in Local │
│   URL/Video ID  │     │  ID & Metadata   │     │     Storage     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                            │
                                                            ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Display Video  │◀────│  Fetch YouTube   │◀────│  Refresh Video  │
│  Grid/List View │     │   Thumbnails     │     │      List       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Project Structure

```
vault_server/
├── server.js              # Express server (port 8888)
├── package.json           # Dependencies & npm scripts
├── package-lock.json      # Dependency lock file
├── README.md              # This file
├── PROJECT_STRUCTURE.md   # Detailed file tree
├── .env                   # API keys (optional)
├── .env.example           # Environment template
├── .gitignore             # Git ignore file
├── .pid                   # Server process ID (auto-generated)
│
├── public/                # Frontend files
│   ├── working.html       # Main vault interface
│   ├── player.html        # Auto-play player
│   ├── test.html          # Test page
│   └── themes/            # 40+ custom themes
│       └── [40 JSON files]
│
├── scripts/               # Launch scripts
│   ├── launch_vault.py    # ✅ Main launcher
│   ├── COMMANDS.md        # Command documentation
│   ├── install.sh         # Installer script
│   ├── start_vault.sh     # Bash launcher
│   ├── run-vault.sh       # Tauri launcher
│   ├── test_all.sh        # Test runner
│   ├── prepare-release.sh # Release prep
│   └── launch_vault.command # macOS double-click
│
├── desktop/               # Desktop app files
│   ├── electron.js        # Electron main process
│   ├── tauri.conf.json    # Tauri config
│   ├── Cargo.toml         # Rust dependencies
│   ├── gen/               # Generated files
│   └── target/            # Rust build output
│
├── icons/                 # App icons
│   ├── icon.png           # Main icon
│   ├── icon.ico           # Windows icon
│   └── icon.icns          # macOS icon
│
├── assets/                # Additional assets
│
├── docs/                  # Documentation
│   ├── VAULT_ROADMAP.md   # Future features
│   ├── VAULT_PHASES.md    # Development phases
│   └── PROJECT_STATUS.md  # Current status
│
├── release/               # Release files
│   └── RELEASE_NOTES.md   # Version history
│
└── node_modules/          # Dependencies (gitignored)
```

For complete details, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

### File Descriptions

#### `server.js`
- Express.js server running on port 8888
- Serves static files from `/public` directory
- Auto-redirects root `/` to `/working.html`
- Dynamic embed endpoint `/embed/:id` for YouTube iframe generation
- YouTube API endpoint `/api/youtube/channel/:channelId` for channel fetching
- Download endpoint `/api/download` for MP3 podcast downloads
- PID file management for reliable stop/restart commands

#### `working.html`
- Main vault interface with all features
- Pure JavaScript implementation (no frameworks)
- Features:
  - Video management (add/delete)
  - Category system (create/delete)
  - Grid/List view toggle
  - Public/Private mode
  - Import/Export collections
  - LocalStorage persistence
  - Real-time statistics

#### `player.html`
- Standalone auto-play window
- YouTube IFrame API integration
- Features:
  - Sequential playback with 5-second countdown
  - Shuffle/Repeat modes
  - Keyboard shortcuts
  - Queue sidebar
  - Click-to-play from queue

## Desktop App Features

When running as a desktop app, you get:
- **Native Application**: No browser tabs, runs as a real app
- **Menu Bar Integration**: File menu with save/load shortcuts
- **Keyboard Shortcuts**: 
  - `Cmd/Ctrl+S`: Save collection
  - `Cmd/Ctrl+O`: Load collection
  - `Cmd/Ctrl+R`: Reload
  - `F11`: Fullscreen
- **App Icon**: Custom icon in dock/taskbar
- **Offline Mode**: Works without internet (for saved videos)
- **Auto-updates**: (Coming soon)

## NPM Scripts

### Working Commands
```bash
npm start         # Start server on port 8888
npm stop          # Stop the server
npm restart       # Restart the server
npm run vault     # Start server and auto-open browser

# Desktop app (requires Electron installed)
npm run electron  # Run as desktop app
```

## Technical Details

### Server (server.js)
- Express.js static file server
- Redirects root path to /working.html
- Dynamic embed endpoint at /embed/:id
- PID file management for reliable stop command

### Frontend (working.html)
- Pure JavaScript, no frameworks
- LocalStorage for data persistence
- Responsive design
- Category-based filtering
- Import/export functionality

### Player (player.html)
- YouTube IFrame API integration
- Auto-advance with countdown
- Full playback controls
- Keyboard navigation
- Queue management

## Data Storage

All data is stored in browser LocalStorage:
- `vaultVideos`: Array of video objects
- `vaultCategories`: Array of category names
- `privateMode`: Boolean for mode state
- `shuffleMode`: Boolean for shuffle state
- `repeatMode`: Boolean for repeat state

Video object structure:
```javascript
{
  id: "YouTube video ID",
  title: "Video title",
  category: "Category name",
  isPrivate: false,
  addedDate: timestamp
}
```

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Basic support (desktop recommended)

## Contributing

1. Check docs/VAULT_ROADMAP.md for planned features
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

## Future Development

See docs/VAULT_ROADMAP.md for detailed roadmap including:
- Thumbnail grid view
- Theme switcher
- Music visualizer
- Drag-drop import
- Offline mode
- And more

## License

MIT - Build your own music vault!

## Disclaimer

This tool uses YouTube's official embed player. Users are responsible for complying with YouTube's Terms of Service.
