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
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    },
    frame: false
  });
  

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);


  // win.webContents.openDevTools()

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