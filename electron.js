const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

const isDev = !app.isPackaged;

const waitOn = require('wait-on');

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });

  const devURL = 'http://localhost:3000';
  const prodURL = `file://${path.join(__dirname, 'frontend/out/index.html')}`;

  const appURL = isDev ? devURL : prodURL;

  if (isDev) {
    try {
      console.log('⏳ Waiting for frontend to be ready...');
      await waitOn({ resources: [devURL], timeout: 30000 }); // wait max 30s
      console.log('Frontend ready, loading...');
    } catch (err) {
      console.error('Failed to start frontend dev server');
      app.quit();
      return;
    }
  }

  win.loadURL(appURL);
}


app.whenReady().then(() => {
  if (isDev) {
    // Run backend dev server
    spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'backend'),
      shell: true,
      stdio: 'inherit',
    });

    // Run frontend dev server
    spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'frontend'),
      shell: true,
      stdio: 'inherit',
    });

    // Optionally wait or poll for localhost:3000 to be available
  } else {
    // Start backend production server
    spawn('npm', ['run', 'start'], {
      cwd: path.join(__dirname, 'backend'),
      shell: true,
      stdio: 'inherit',
    });
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
