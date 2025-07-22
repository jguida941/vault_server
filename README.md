# THE VAULT - YouTube Music Player Without Ads

A clean, ad-free YouTube music player that lets you build and manage your own music collection with auto-play functionality.

## Features

### Current Features
- Ad-free YouTube playback using youtube-nocookie.com embeds
- No tracking or analytics
- Add videos by URL or video ID with YouTube thumbnail preview
- Professional dark theme UI with grid/list view toggle
- Video categorization system (Hip Hop, Rock, Electronic, Chill, custom categories)
- Delete individual videos with hover × button
- Delete categories with all associated videos
- LocalStorage for permanent video storage
- Save/load collections as JSON files
- Public/Private mode toggle
- Auto-play player with shuffle and repeat
- Keyboard shortcuts in player
- Session persistence across browser restarts
- Real-time statistics tracking

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

## Quick Start

### Requirements
- Node.js installed
- npm (comes with Node.js)

### Installation
```bash
# Clone the repository
git clone https://github.com/jguida941/vault-player.git
cd vault-player

# Install dependencies
npm install

# Start the server
npm start
```

### Access the Vault
- Open browser to http://localhost:8080 (automatically redirects to the vault)
- Or directly visit http://localhost:8080/working.html

## For Justin

### Running the Server (Quick Reminder)
```bash
# Navigate to your vault folder
cd /Users/jguida941/Desktop/vault_server

# Start the server (it runs on port 8080)
npm start

# Or use the all-in-one command that starts server AND opens browser
npm run vault
```

### Adding Your Music
1. Go to http://localhost:8080 after starting the server
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
│   User Opens    │────▶│  server.js:8080  │────▶│  Redirects to   │
│ localhost:8080  │     │  Express Server  │     │ /working.html   │
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

## Project Structure & File Descriptions

```
vault_server/
├── server.js              # Express server with redirect and embed endpoint
├── package.json           # Project configuration
├── package-lock.json      # Dependency lock file
├── README.md             # This file
│
├── public/               # Frontend files
│   ├── index.html        # Legacy player (redirects to working.html)
│   ├── working.html      # Main vault interface
│   ├── player.html       # Auto-play player page
│   └── test.html         # Test page
│
└── docs/                 # Documentation
    ├── VAULT_PHASES.md   # Original development phases
    └── VAULT_ROADMAP.md  # Future feature roadmap
```

### File Descriptions

#### `server.js`
- Express.js server running on port 8080
- Serves static files from `/public` directory
- Auto-redirects root `/` to `/working.html`
- Dynamic embed endpoint `/embed/:id` for YouTube iframe generation
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

## NPM Scripts

```bash
npm start         # Start the server
npm stop          # Stop the server
npm restart       # Restart the server
npm run open      # Open vault in browser
npm run vault     # Start server and auto-open browser
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
