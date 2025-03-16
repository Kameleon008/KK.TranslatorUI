const { loadAppsettings } = require('../../shared/appsettings');

async function execute(arguments) {
    
    let config = loadAppsettings();
    console.log("strategies/ollama-translate/ollama-translate.js: execute", arguments);

    var targetLanguage = config.translationStrategyOptions.targetLanguage;
    var apiUrl = config.translationStrategyOptions.ollamaTranslate.apiUrl;
    var model = config.translationStrategyOptions.ollamaTranslate.model;

    console.log("strategies/ollama-translate/ollama-translate.js: execute", targetLanguage, apiUrl, model);

    const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({
            "model": model,
            "prompt": `Translate text below to ${targetLanguage}. In response i want to get just translated text.: \n\n "${arguments}"`,
            "stream": false
        }), headers: { "Content-Type": "application/json" }
    });

    if (response.ok === false) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    let translation = await response.json();

    console.log("strategies/ollama-translate/ollama-translate.js: execute", translation);
    return { translatedText: translation.response };
}

module.exports = {
    execute
};

