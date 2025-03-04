const { app, BrowserWindow, ipcMain, screen } = require('electron');
const fs = require("fs");
const path = require("path");

let config;
let mainWindow;
let commandLineArguments;
let textToTranslate;

app.whenReady().then(() => {

    // Load configuration
    loadAppsettings();

    //Load command line arguments
    loadCommandLineArguments();

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
        saveConfig();
    });

    // 'close-on-blur-changed' event
    ipcMain.on('close-on-blur-changed', (event) => {
        config.closeOnBlur = !config.closeOnBlur;
        saveConfig();
    });
}


async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function saveConfig() {
    try {
        const configPath = path.join(__dirname, "appsettings.json");
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
        console.log("Config saved:", config);
    }
    catch (error) {
        console.error("Failed to save config:", error);
    }
}

function loadAppsettings() {
    try {
        const configPath = path.join(__dirname, "appsettings.json");
        const data = fs.readFileSync(configPath, "utf-8");
        config = JSON.parse(data);
        console.log("Config loaded:", config);
    }
    catch (error) {
        console.error("Failed to load config:", error);
    }
}

function loadCommandLineArguments() {
    let args = process.argv.slice(2);
    let parsedArgs = {};

    args.forEach((arg, index) => {
        if (arg.startsWith('--')) {
            const key = arg.replace(/^--/, "");
            const value = args[index + 1]?.startsWith('--') || args[index + 1] === undefined ? true : args[index + 1];
            parsedArgs[key] = value;
        }
    });

    commandLineArguments = parsedArgs;
    console.log("Command line arguments:", commandLineArguments);

    const fileIndex = args.indexOf("--file"); // Find "--file" argument

    if (fileIndex !== -1 && args[fileIndex + 1]) { // Ensure there's a value after "--file"
        const filePath = args[fileIndex + 1];

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }

            textToTranslate = data;
            console.log("Selected Text:", data); // Process the file content
        });
    }
}

function getCursorPosition() {
    const cursorPoint = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(cursorPoint);

    const windowX = cursorPoint.x;
    const windowY = cursorPoint.y;

    const { width, height, x, y } = display.bounds;
    const winWidth = 400, winHeight = 300;

    const finalX = Math.min(Math.max(windowX, x), x + width - winWidth);
    const finalY = Math.min(Math.max(windowY, y), y + height - winHeight);

    return {
        x: finalX,
        y: finalY
    }
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

        mainWindow.loadFile('./index/index.html');

        // Send theme and arguments to the renderer
        mainWindow.webContents.once('did-finish-load', () => {
            mainWindow.webContents.send('theme', config.theme);
            mainWindow.webContents.send('config', config);
            mainWindow.webContents.send('translate', commandLineArguments, textToTranslate);
        });
    }
}