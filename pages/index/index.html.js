const { ipcRenderer } = require('electron');
const { selectStrategy, getStrategyResult} = require('../../strategies/strategies')

// HTML Elements
const body = document.getElementById('body')
const contentContainer = document.getElementById('content')
const waitingBar = document.getElementById('progressBarContainer')
const translationContainer = document.getElementById('translationContainer')
const translationResult = document.getElementById('translation')

const translationContent = document.getElementById('translationContent')
const settingsContent = document.getElementById('settingsContent')

// Buttons
const buttonConstrast = document.getElementById('buttonContrast')
const buttonSettings = document.getElementById('buttonSettings')
const buttonPin = document.getElementById('buttonPin')

// Buttons Events
buttonConstrast.addEventListener('click', () => {

    switch (body.classList[0]) {

        case 'light-theme':
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            ipcRenderer.send('theme-changed', 'dark-theme');
            break;

        case 'dark-theme':
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            ipcRenderer.send('theme-changed', 'light-theme');
            break;
    }
});

buttonSettings.addEventListener('click', async () => {

    buttonSettings.classList.toggle('active');

    if (buttonSettings.classList.contains('active')) {
        ipcRenderer.send('resize-window', contentContainer.clientWidth + 60, 1000); await wait(200);
        translationContent.classList.toggle('collapse'); await wait(600);
        settingsContent.classList.toggle('collapse'); await wait(600);
        ipcRenderer.send('resize-window', contentContainer.clientWidth + 60, settingsContent.clientHeight + 120);
    }
    else {
        ipcRenderer.send('resize-window', contentContainer.clientWidth + 60, 1000); await wait(200);
        settingsContent.classList.toggle('collapse'); await wait(600);
        translationContent.classList.toggle('collapse'); await wait(600);
        ipcRenderer.send('resize-window', contentContainer.clientWidth + 60, translationContent.clientHeight + 120);
    }
});

buttonPin.addEventListener('click', () => {
    buttonPin.classList.toggle('active');
    ipcRenderer.send('close-on-blur-changed');
});


// Inter Process Comunication Events
ipcRenderer.on('config', async (event, config) => {
    if (!config.closeOnBlur) {
        buttonPin.classList.add('active');
    }
});

ipcRenderer.on('translate', async (event, textToTranslate) => {

    contentContainer.classList.remove('acrylic-background__init');
    const response = await getTranslationResult(textToTranslate);
    translationResult.innerText = `${response.translatedText || 'N/A'}`;
    translationContainer.classList.remove('translation-container__init');
    waitingBar.classList.add(`progress-bar-container__hidden`);

    ipcRenderer.send('resize-window', contentContainer.clientWidth + 60, contentContainer.clientHeight + 120);
});

ipcRenderer.on('theme', async (event, theme) => {
    console.log("theme:", theme);
    body.classList.add(theme);
});

ipcRenderer.on('close-window', () => {
    contentContainer.classList.add('acrylic-background__init');  // Apply the class to the content
});

async function getTranslationResult(textToTranslate) {

    console.log(textToTranslate);

    return await getStrategyResult("googleTranslate", textToTranslate);
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}