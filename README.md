# THE VAULT - YouTube Music Player Without Ads

A clean, ad-free YouTube music player that lets you build and manage your own music collection with auto-play functionality.

## Features

### Current Features
- Ad-free YouTube playback using youtube-nocookie.com embeds
- No tracking or analytics
- Add videos by URL or video ID
- Professional dark theme UI
- Video categorization system (Hip Hop, Rock, Electronic, Chill, custom categories)
- LocalStorage for permanent video storage
- Save/load collections as JSON files
- Public/Private mode toggle
- Auto-play player with shuffle and repeat
- Keyboard shortcuts in player
- Session persistence across browser restarts

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
git clone https://github.com/jguida941/youtube-music-vault.git
cd youtube-music-vault

# Install dependencies
npm install

# Start the server
npm start
```

### Access the Vault
1. Open browser to http://localhost:8080
2. The server will automatically redirect to the working vault interface

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

## Project Structure

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