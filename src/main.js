const electron = require('electron')
const config = require('./config')
const ipcMain = require('electron').ipcMain
const mock = require('../mock');
const Fuse = require('fuse.js')

const fuseInstance = new Fuse(mock, config.fuse)

// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow(config.mainWindow)

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    ipcMain.on('search-request', (event, arg) => {
        let data = fuseInstance.search(arg)
        if (data.length > config.output.max) {
            //max nr of items shown
            mainWindow.setSize(
                config.mainWindow.width,
                config.mainWindow.height + (config.output.heightPerItem * config.output.max)
            )
        } else {
            //lower nr of items
            mainWindow.setSize(
                config.mainWindow.width,
                config.mainWindow.height + (config.output.heightPerItem * data.length))
        }
        event.sender.send('search-reply', data)
    })

    // to be used in the future if i want to reset other things
    ipcMain.on('reset', (event, arg) => {
        if (arg) {
            switch (arg) {
                case "size":
                    mainWindow.setSize(config.mainWindow.width, config.mainWindow.height);
                    break;
            }
        }
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.