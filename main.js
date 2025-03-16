const { app, BrowserWindow, ipcMain } = require('electron');
const { parseArguments, processArguments } = require('./shared/argsParser');
const { saveAppsettings, loadAppsettings } = require('./shared/appsettings');
const { getCursorPosition } = require('./shared/utils');

let config;
let mainWindow;
let args;
let argsResults;

app.whenReady().then(() => {

    // Load configuration
    config = loadAppsettings();

    //Load command line arguments
    args = parseArguments(process.argv);
    argsResults = processArguments(args);

    // Create the main window
    initalizeMainWindow();

    // Configure Main Window Events
    configureMainWindowEvents();

    // Configure Inter Process Comunication
    configureIpcMainEvents();
});

app.on('window-all-closed', () => {
    app.quit();
});

function configureMainWindowEvents() {

    // 'blur' event
    mainWindow.on('blur', () => {
        if (config.closeOnBlur) {
            mainWindow.webContents.send('close-window');
            setTimeout(async () => {
                app.quit();
            }, 1000);
        }
    });
}

function configureIpcMainEvents() {

    // 'resize-window' event
    ipcMain.on('resize-window', (event, width, height) => {
        mainWindow.setSize(width, height); // Resize the window
    });

    // 'theme-changed' event
    ipcMain.on('theme-changed', (event, theme) => {
        config.theme = theme;
        saveAppsettings(config);
    });

    // 'close-on-blur-changed' event
    ipcMain.on('close-on-blur-changed', (event) => {
        config.closeOnBlur = !config.closeOnBlur;
        saveAppsettings(config);
    });

    ipcMain.on('target-language-changed', (event, targetLanguage) => {
        console.log("target-language-changed", targetLanguage);
        config.translationStrategyOptions.targetLanguage = targetLanguage;
        mainWindow.webContents.send('translate', argsResults.text);
        saveAppsettings(config);
    });
}

function initalizeMainWindow() {
    {
        let cusrsorPosition = getCursorPosition()

        mainWindow = new BrowserWindow({
            skipTaskbar: config.mainWindow.skipTaskbar || false, // Hide from taskbar
            frame: config.mainWindow.frame || false, // Remove window frame
            resizable: config.mainWindow.resizable || true, // Prevent manual resizing
            transparent: config.mainWindow.transparent || true, // Enable transparency
            backgroundMaterial: config.mainWindow.backgroundMaterial || 'acrylic', // Apply acrylic effect on Windows
            alwaysOnTop: config.mainWindow.alwaysOnTop || true, // Keep window on top
            x: cusrsorPosition.x, // Offset from the mouse position
            y: cusrsorPosition.y, // Offset from the mouse position
            webPreferences: {
                nodeIntegration: true, // Important for renderer.js to work
                contextIsolation: false, // Allow ipcRenderer
            }
        });

        mainWindow.loadFile('./pages/index/index.html');

        // Send theme and arguments to the renderer
        mainWindow.webContents.once('did-finish-load', () => {
            mainWindow.webContents.send('theme', config.theme);
            mainWindow.webContents.send('config', config);
            mainWindow.webContents.send('translate', argsResults.text);
        });
    }
}