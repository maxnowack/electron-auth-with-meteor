var ipc = require('electron').ipcRenderer

var getLoginToken = function(iframe, callback) {
  iframe.addEventListener('load', function() {
    var win = iframe.contentWindow
    win.Tracker.autorun(function(computation) {
      win.FlowRouter.watchPathChange()
      var token = win.localStorage.getItem('Meteor.loginToken')
      if (token) callback(token, win.location.href)
      computation.stop()
    })
    var hook = win.Accounts.onLogin(function() {
      console.log(this);
      var token = win.localStorage.getItem('Meteor.loginToken')
      if (token) {
        callback(token, win.location.href)
        hook.stop()
      }
    })
  })
}
ipc.on('sendLogin', function(event, winId) {
  console.log('sending login to window with id', winId);
  console.log('waiting until token is ready');
  var iframe = document.getElementsByTagName('iframe')[0]
  getLoginToken(iframe, function(token, path) {
    var controlWindow = require('electron').remote.BrowserWindow.fromId(winId)

    console.log('got login token', token);
    controlWindow.webContents.send('login', token)
  })
})
