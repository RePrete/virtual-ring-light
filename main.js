const {app, BrowserWindow, Tray, ipcMain, MessageChannelMain} = require('electron')
const path = require('path')
const positioner = require('electron-traywindow-positioner');

let lightWindow, tray, trayWindow;

function createWindow () {
  lightWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '/windows/shared/preload.js'),
      nodeIntegration: true,
    },
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    skipTaskbar: true,
    hasShadow: false,
  })

  lightWindow.loadFile(path.join(__dirname, '/windows/light/light.html'));
  lightWindow.maximize();
  lightWindow.setIgnoreMouseEvents(true, { forward: true });
  lightWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  let level = "normal";
  if (process.platform === "darwin") {
    level = "floating";
  }
  lightWindow.setAlwaysOnTop(true, level);
}

function createTray() {
  if (app.dock) {
    app.dock.hide();
  }

  tray = new Tray(path.join(__dirname, "/assets/iconTemplate@4x.png"));

  tray.setToolTip("Daily");
  tray.setIgnoreDoubleClickEvents(true);
  tray.on("click", function (e) {
    if (trayWindow.isVisible()) {
      trayWindow.hide();
      return;
    }
    trayWindow.show();
  });
  tray.on("right-click", () => {
    tray.popUpContextMenu(tray.contextMenu);
  });

  positioner.position(trayWindow, tray.getBounds());
}

function createTrayWindow() {
  // Create the window that opens on app start
  // and tray click
  trayWindow = new BrowserWindow({
    title: "Daily",
    webPreferences: {
      preload: path.join(__dirname, "/windows/shared/preload.js"),
      nodeIntegration: true,
    },
    width: 290,
    height: 300,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    setVisibleOnAllWorkspaces: true,
    transparent: true,
    skipTaskbar: true,
    hasShadow: false,
  });

  trayWindow.loadFile(path.join(__dirname, "/windows/tray/tray.html"));

  let level = "normal";
  if (process.platform === "darwin") {
    level = "floating";
  }

  trayWindow.setAlwaysOnTop(true, level);
  trayWindow.on("blur", () => {
    trayWindow.hide();
  });
  trayWindow.on("show", () => {
    positioner.position(trayWindow, tray.getBounds());
    trayWindow.focus();
  });
}

app.whenReady().then(() => {
  createWindow()
  createTrayWindow();
  createTray();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('light-config-updated', (event, args) => {
  console.log(args)
  lightWindow.webContents.send('light-config-updated', args)
})