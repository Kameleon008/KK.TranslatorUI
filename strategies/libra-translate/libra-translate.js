const { loadAppsettings } = require('../../shared/appsettings');

async function execute(arguments) {
    
    let config = loadAppsettings();
    console.log("strategies/ollama-translate/ollama-translate.js: execute", arguments);

    var targetLanguage = config.translationStrategyOptions.targetLanguage;
    var apiUrl = config.translationStrategyOptions.libraTranslate.apiUrl;
    
    const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({
            q: arguments,
            source: "auto",
            target: targetLanguage.toLowerCase(),
            format: "text",
            alternatives: 1,
            api_key: ""
        }),
        headers: { "Content-Type": "application/json" }
    });

    if (response.ok === false) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    return await response.json();
}

module.exports = {
    execute
};