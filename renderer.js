const { ipcRenderer } = require('electron');

// HTML Elements
const contentContainer = document.getElementById('content')
const waitingBar = document.getElementById('progressBarContainer')
const translationContainer = document.getElementById('translationContainer')
const translationResult = document.getElementById('translation')

// Listen for arguments from main process
ipcRenderer.on('arguments', async (event, argObject) => {

    await wait(1000);
    contentContainer.classList.remove('acrylic-background__init');

    const response = await getTranslationResult(argObject);
    translationResult.innerText = `${response.translatedText || 'N/A'}`;

    translationContainer.classList.remove('translation-container__init');
    waitingBar.classList.add(`progress-bar-container__hidden`);

    ipcRenderer.send('resize-window', contentContainer.clientWidth + 100, contentContainer.clientHeight + 100);
});

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTranslationResult(argObject) {


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

    if (response.ok === false) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    return await response.json();;
}