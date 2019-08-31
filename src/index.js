const { app, BrowserWindow } = require('electron')
const server = require('./server')
const path = require('path')

let mainWindow
const serverApp = server(3000)

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    // and load the index.html of the app.
    mainWindow.loadURL('http://127.0.0.1:3000/')

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})
