"use strict";

import { app, BrowserWindow, Menu, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import fixPath from "fix-path";

// Updates the process path variable for build
fixPath();

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
let updateAvailable = false;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    titleBarStyle: "hidden"
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  setUpMenu();
  setUpAutoUpdateListeners();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function setUpMenu() {
  var template = [
    {
      label: "Lifeboat",
      submenu: [
        {
          label: "About Lifeboat",
          selector: "orderFrontStandardAboutPanel:"
        },
        { type: "separator" },
        { type: "separator" },
        {
          label: "Hide Lifeboat",
          accelerator: "CommandOrControl+H",
          selector: "hide:",
          visible: process.platform === "darwin"
        },
        {
          label: "Hide Others",
          accelerator: "CommandOrControl+Alt+H",
          selector: "hideOtherApplications:",
          visible: process.platform === "darwin"
        },
        {
          label: "Show All",
          selector: "unhideAllApplications:",
          visible: process.platform === "darwin"
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: function() {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        },
        { type: "separator" },
        {
          label: "Open Developer Tools",
          accelerator:
            process.platform === "darwin" ? "Alt+Cmd+I" : "Ctrl+Shift+I",
          click() {
            mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

/**
 * Listen for important autoUpdate events, and pass them to the mainWindow
 * so Vue components can pick up and listen to them.
 */
function setUpAutoUpdateListeners() {
  [
    "error",
    "checking-for-update",
    "update-available",
    "update-not-available",
    "update-downloaded"
  ].forEach(e => {
    autoUpdater.on(e, data => {
      mainWindow.webContents.send(`autoupdate-${e}`, data);
    });
  });
}

autoUpdater.on("update-downloaded", () => {
  updateAvailable = true;
});

app.on("ready", () => {
  if (process.env.NODE_ENV === "production") autoUpdater.checkForUpdates();
});

ipcMain.on("autoupdate-check", (e, data) => {
  // Only actually check for updates on production, since it crashes dev
  if (process.env.NODE_ENV === "production") {
    autoUpdater.checkForUpdates();
  } else {
    setTimeout(() => {
      // Send a test response instead
      // mainWindow.webContents.send("autoupdate-update-downloaded", {});
      // mainWindow.webContents.send("autoupdate-update-available", {});
      mainWindow.webContents.send("autoupdate-update-not-available", {});
    }, 500);
  }
});

ipcMain.on("autoupdate-quitandinstall", () => {
  if (updateAvailable) {
    autoUpdater.quitAndInstall();
  } else {
    app.relaunch();
    app.quit();
  }
});
