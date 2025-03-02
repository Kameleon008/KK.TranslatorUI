const { ipcRenderer } = require('electron');

// HTML Elements
const body = document.getElementById('body')
const contentContainer = document.getElementById('content')
const waitingBar = document.getElementById('progressBarContainer')
const translationContainer = document.getElementById('translationContainer')
const translationResult = document.getElementById('translation')

// Buttons
const buttonConstrast = document.getElementById('buttonContrast')
const buttonSettings = document.getElementById('buttonSettings')
const buttonPin = document.getElementById('buttonPin')

// Buttons Events
buttonConstrast.addEventListener('click', async () => {

    let result;

    switch (body.classList[0]) {

        case 'light-theme':
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            console.log('Dark Theme');
            result = await ipcRenderer.invoke('theme-changed', 'dark-theme');
            console.log(result);
            break;

        case 'dark-theme':
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            console.log('Light Theme');
            result = await ipcRenderer.invoke('theme-changed', 'light-theme');
            console.log(result);
            break;
    }
});

buttonSettings.addEventListener('click', () => {
    console.log('Settings');
});

buttonPin.addEventListener('click', () => {
    console.log('Pin');
});

// Listen for arguments from main process
ipcRenderer.on('arguments', async (event, arguments) => {

    console.log(arguments);
    contentContainer.classList.remove('acrylic-background__init');

    const response = await getTranslationResult(arguments['text']);
    translationResult.innerText = `${response.translatedText || 'N/A'}`;

    translationContainer.classList.remove('translation-container__init');
    waitingBar.classList.add(`progress-bar-container__hidden`);

    ipcRenderer.send('resize-window', contentContainer.clientWidth + 100, contentContainer.clientHeight + 100);
});

ipcRenderer.on('theme', async (event, theme) => {
    body.classList.add(theme);
});

ipcRenderer.on('close-window', () => {
    contentContainer.classList.add('acrylic-background__init');  // Apply the class to the content
});

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTranslationResult(textToTranslate) {


    const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        body: JSON.stringify({
            q: textToTranslate,
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