const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;

function createWindow() {
  console.log('Creating main window...');
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      webviewTag: true,
      plugins: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#000000',
    show: false
  });

  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow.show();
  });

  console.log('Loading URL: http://localhost:8888/working.html');
  mainWindow.loadURL('http://localhost:8888/working.html');
  
  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();
  
  // Override prompt to use Electron's dialog
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      window._electronPrompt = window.prompt;
      window.prompt = function(message, defaultValue) {
        // For now, return a default value to make the app functional
        if (message.includes('title')) return 'My Track';
        if (message.includes('category')) return 'Music';
        if (message.includes('playlist')) return '';
        return defaultValue || '';
      };
    `);
  });
  
  // Force show after a delay if ready-to-show doesn't fire
  setTimeout(() => {
    if (mainWindow && !mainWindow.isVisible()) {
      console.log('Force showing window');
      mainWindow.show();
    }
  }, 3000);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save Collection',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              const button = document.querySelector('button[onclick*="saveCollection"]');
              if (button) button.click();
            `);
          }
        },
        {
          label: 'Load Collection',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              const button = document.querySelector('button[onclick*="loadCollection"]');
              if (button) button.click();
            `);
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About The Vault',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About The Vault',
              message: 'The Vault - YouTube Music Player',
              detail: 'Version 2.0.0\n\nAn ad-free YouTube music player that lets you build and manage your own music collection.',
              buttons: ['OK']
            });
          }
        },
        {
          label: 'View on GitHub',
          click: () => {
            shell.openExternal('https://github.com/jguida941/vault-player');
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { label: 'About ' + app.getName(), role: 'about' },
        { type: 'separator' },
        { label: 'Services', role: 'services', submenu: [] },
        { type: 'separator' },
        { label: 'Hide ' + app.getName(), accelerator: 'Command+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function startServer() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, 'server.js');
    
    serverProcess = spawn('node', [serverPath], {
      cwd: __dirname,
      env: { ...process.env, PORT: '8888' }
    });

    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data}`);
      if (data.toString().includes('Vault server started')) {
        setTimeout(resolve, 1000);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
      reject(error);
    });

    serverProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });
  });
}

app.whenReady().then(async () => {
  try {
    await startServer();
    createWindow();
  } catch (error) {
    console.error('Failed to start:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});