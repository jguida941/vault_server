const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Redirect root to working.html
app.get('/', (req, res) => {
    res.redirect('/working.html');
});

// Direct embed endpoint - uses YouTube's own embed
app.get('/embed/:id', (req, res) => {
  // Sanitize video ID - only allow alphanumeric, underscore, and hyphen
  const videoId = req.params.id.replace(/[^a-zA-Z0-9_-]/g, '');
  
  // Set proper content type
  res.set('Content-Type', 'text/html');
  res.set('X-Frame-Options', 'SAMEORIGIN');
  
  // Get optional query params
  const autoplay = req.query.autoplay || '1';
  const controls = req.query.controls || '1';
  const start = req.query.start || '0';
  const mute = req.query.mute || '0';
  
  // Build query string
  const queryParams = new URLSearchParams({
    autoplay: autoplay,
    controls: controls,
    start: start,
    mute: mute,
    rel: '0', // Don't show related videos
    modestbranding: '1', // Minimal YouTube branding
    fs: '1' // Allow fullscreen
  }).toString();
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Video Player</title>
    </head>
    <body style="margin:0; padding:0; background:#000;">
      <iframe width="100%" height="100%" 
        src="https://www.youtube-nocookie.com/embed/${videoId}?${queryParams}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    </body>
    </html>
  `);
});

// Start server and save PID
const server = app.listen(PORT, () => {
  console.log(`🔊 Vault server started!`);
  console.log(`📺 Open in browser: http://localhost:${PORT}/working.html`);
  console.log(`🛑 To stop server: Press Ctrl+C or run 'npm stop'`);
  
  // Write PID file for npm stop command
  const fs = require('fs');
  fs.writeFileSync('.pid', process.pid.toString());
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down vault server...');
  const fs = require('fs');
  if (fs.existsSync('.pid')) {
    fs.unlinkSync('.pid');
  }
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});