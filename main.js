const { app, BrowserWindow, ipcMain, screen } = require('electron');

let mainWindow;

app.whenReady().then(() => {

    const cursorPosition = screen.getCursorScreenPoint();

    const xOffset = 5000;
    const yOffset = 1000;

    const xPosition = cursorPosition.x + xOffset;
    const yPosition = cursorPosition.y + yOffset;

    mainWindow = new BrowserWindow({
        skipTaskbar: true, // Hide from taskbar
        frame: false, // Remove window frame
        resizable: true, // Prevent manual resizing
        transparent: true, // Enable transparency
        vibrancy: 'acrylic', // Apply acrylic effect on macOS
        backgroundMaterial: 'acrylic', // Apply acrylic effect on Windows
        x: xPosition, // Offset from the mouse position
        y: yPosition, // Offset from the mouse position
        webPreferences: {
            nodeIntegration: true, // Important for renderer.js to work
            contextIsolation: false, // Allow ipcRenderer
        }
    });

    mainWindow.loadFile('index.html');

    // Extract command-line arguments
    const args = process.argv.slice(2);
    let argObject = {};
    args.forEach((arg, index) => {
        if (arg.startsWith('--')) {
            const key = arg.slice(2);  // Remove '--'
            const value = args[index + 1];  // Get the next value
            argObject[key] = value;
        }
    });

    console.log("Parsed Arguments:", argObject);

    // Send arguments AFTER the window loads
    mainWindow.webContents.once('did-finish-load', () => {
        console.log("Sending arguments to renderer...");
        mainWindow.webContents.send('arguments', argObject);
    });

    ipcMain.on('resize-window', (event, width, height) => {
        mainWindow.setSize(width, height); // Resize the window
        mainWindow.center(); // Optional: Center the window on the screen
    });

    // Close AFTER UI updates (small delay)
    mainWindow.on('blur', () => {
        setTimeout(() => {
            console.log("Window lost focus, closing...");
            app.quit();
        }, 500); // 500ms delay to allow UI update
    });
});

app.on('window-all-closed', () => {
    app.quit();
});
