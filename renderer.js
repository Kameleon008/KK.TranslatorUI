const { ipcRenderer } = require('electron');

// Debug log to confirm script is running
console.log("renderer.js is running...");

// Listen for arguments from main process
ipcRenderer.on('arguments', async (event, argObject) => {
    console.log('Received arguments in renderer:', argObject);

    // Ensure UI updates only when data is received

    const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        body: JSON.stringify({
            q: argObject.username,
            source: "auto",
            target: "pl",
            format: "text",
            alternatives: 1,
            api_key: ""
        }),
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json(); // Parse the response as JSON

    document.getElementById('username').innerText = `${data.translatedText || 'N/A'}`;

    // Measure the content size
    let content = document.getElementById('content');

    // Send the content size to the main process
    ipcRenderer.send('resize-window', content.clientWidth, content.clientHeight);
});

