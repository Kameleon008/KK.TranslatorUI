const { app, BrowserWindow, ipcMain, screen } = require('electron');

let mainWindow;

app.whenReady().then(() => {

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

    mainWindow = new BrowserWindow({
        // skipTaskbar: true, // Hide from taskbar
        frame: false, // Remove window frame
        resizable: true, // Prevent manual resizing
        transparent: true, // Enable transparency
        vibrancy: 'acrylic', // Apply acrylic effect on macOS
        backgroundMaterial: 'acrylic', // Apply acrylic effect on Windows
        x: finalX, // Offset from the mouse position
        y: finalY, // Offset from the mouse position
        webPreferences: {
            nodeIntegration: true, // Important for renderer.js to work
            contextIsolation: false, // Allow ipcRenderer
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.webContents.send('arguments', argObject);
    });

    mainWindow.on('blur', () => {
        // mainWindow.webContents.send('close-window');
        // setTimeout(async () => {
        //     app.quit();
        // }, 1000);
    });

    ipcMain.on('resize-window', (event, width, height) => {
        console.log('Resizing window');
        mainWindow.setSize(width, height); // Resize the window
    });

});

app.on('window-all-closed', () => {
    app.quit();
});

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}