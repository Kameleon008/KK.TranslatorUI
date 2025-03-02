const { app, BrowserWindow, ipcMain, screen } = require('electron');
const fs = require("fs");
const path = require("path");

let config;
let mainWindow;
let commandLineArguments;

app.whenReady().then(() => {

    loadAppsettings();
    loadCommandLineArguments();

    initalizeMainWindow();

    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.webContents.send('theme', config.theme);
        mainWindow.webContents.send('arguments', commandLineArguments);
    });

    mainWindow.on('blur', () => {
        if (commandLineArguments['close-on-blur']) {

            mainWindow.webContents.send('close-window');
            setTimeout(async () => {
                app.quit();
            }, 1000);
        }
    });

    ipcMain.on('resize-window', (event, width, height) => {
        mainWindow.setSize(width, height); // Resize the window
    });

    ipcMain.handle('theme-changed', (event, theme) => {
        config.theme = theme;

        return saveConfig();
    });
});

app.on('window-all-closed', () => {
    app.quit();
});

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
}

function getCursorPosition() {
    const cursorPoint = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(cursorPoint);

    // Calculate window position near the cursor (e.g., 50px offset)
    const windowX = cursorPoint.x; // Offset for better visibility
    const windowY = cursorPoint.y;

    // Ensure the window stays within the screen bounds
    const { width, height, x, y } = display.bounds;
    const winWidth = 400, winHeight = 300; // Example window size

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
            // skipTaskbar: true, // Hide from taskbar
            frame: false, // Remove window frame
            resizable: true, // Prevent manual resizing
            transparent: true, // Enable transparency
            vibrancy: 'acrylic', // Apply acrylic effect on macOS
            backgroundMaterial: 'acrylic', // Apply acrylic effect on Windows
            x: cusrsorPosition.x, // Offset from the mouse position
            y: cusrsorPosition.y, // Offset from the mouse position
            webPreferences: {
                nodeIntegration: true, // Important for renderer.js to work
                contextIsolation: false, // Allow ipcRenderer
            }
        });

        mainWindow.loadFile('index.html');
    }
}