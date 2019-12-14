const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 770,
    height: 500,
    minWidth: 770,
    maxWidth: 770,
    maximizable: false,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  });

  win.loadFile(path.resolve(__dirname + './views/main/main.view.html'));

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});