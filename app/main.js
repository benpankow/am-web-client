const electron = require("electron");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let authWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadFile("./dist/index.html");

  console.log("Te2st");

  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  mainWindow.webContents.on("new-window", function(event, url) {
    event.preventDefault();

    if (!authWindow && url != "about:blank") {
      authWindow = new BrowserWindow({ width: 800, height: 600 });
      authWindow.webContents.on("will-navigate", function(event, url) {
        console.log(event);
        console.log(url);
      });
      authWindow.loadFile("./dist/form.html");
    }
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
