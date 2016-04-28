const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const Tray = electron.Tray
const Menu = electron.Menu
const Positioner = require('electron-positioner')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 275,
    height: 500,
    show: false,
    resizable: false,
    transparent: true,
    frame: false,
  });
  mainWindow.loadURL('file://' + __dirname + '/control.html');
  // mainWindow.webContents.openDevTools();
  mainWindow.webContents.on('dom-ready', function() {
    mainWindow.webContents.send('windowId', mainWindow.id)
  })

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  const appIcon = new Tray(__dirname + '/IconTemplate.png');
  const positioner = new Positioner(mainWindow)
  const show = function(pos) {
    var position = positioner.calculate('trayCenter', pos)

    mainWindow.setPosition(position.x, position.y)
    mainWindow.show()
  }
  const hide = function() {
    mainWindow.hide()
  }
  appIcon.on('click', function(e, bounds) {
    if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return hide()
    if (mainWindow.isVisible()) return hide()
    show(bounds)
  })
});
