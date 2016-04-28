var DDP = require('ddp')
var login = require('ddp-login')
var ipc = require('electron').ipcRenderer
var BrowserWindow = require('electron').remote.BrowserWindow

var ddp = new DDP({ url: 'ws://localhost:3000/websocket'})
var connected = false

var winId = null
ipc.on('windowId', function(event, id) {
  console.log('this window has id', id);
  winId = id
})

ddp.connect(function(err) {
  if (err) throw err
  var appWindow = new BrowserWindow({width: 800, height: 600});
  appWindow.loadURL('file://' + __dirname + '/app.html');
  appWindow.webContents.openDevTools();

  var ipcCalled = false
  appWindow.webContents.on('dom-ready', function() {
    if (ipcCalled) return
    console.log('getting login token from the app window');
    appWindow.webContents.send('sendLogin', winId)
    ipcCalled = true
  })


  appWindow.on('closed', function() {
    appWindow = null;
  });
  ipc.on('login', function(event, token) {
    console.log('logging in via ddp ...');
    login.loginWithToken(ddp, token, function (err, userInfo) {
      if (err) throw err;
      console.log('got userinfo from meteor', userInfo);
    });
  })
})
