const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

const isDev = !app.isPackaged;

async function createWindow() {
  console.log('Creating Electron window...');
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

  win.loadURL(appURL);
}

app.whenReady().then(async () => {
  if (isDev) {
    // Start backend dev server
    spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'backend'),
      shell: true,
      stdio: 'inherit',
    });

    // Start frontend dev server
    spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'frontend'),
      shell: true,
      stdio: 'inherit',
    });

    try {
      console.log('Waiting for frontend to be ready...');
      await waitOn({ resources: ['http://localhost:3000'], timeout: 30000 });
      console.log('Frontend is ready.');
      createWindow();
    } catch (err) {
      console.error('Frontend did not start in time:', err);
      app.quit();
    }
  } else {
    // Start backend production server
    spawn('npm', ['run', 'start'], {
      cwd: path.join(__dirname, 'backend'),
      shell: true,
      stdio: 'inherit',
    });

    createWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
