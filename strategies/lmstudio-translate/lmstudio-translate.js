const { loadAppsettings } = require('../../shared/appsettings');

async function execute(arguments) {

    let config = loadAppsettings();
    console.log("strategies/lmstudio-translate/lmstudio-translate.js: execute", arguments);

    var targetLanguage = config.translationStrategyOptions.targetLanguage;
    var apiUrl = config.translationStrategyOptions.lmstudioTranslate.apiUrl;
    var model = config.translationStrategyOptions.lmstudioTranslate.model;

    console.log("strategies/lmstudio-translate/lmstudio-translate.js: execute", targetLanguage, apiUrl, model);

    const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": `Translate text below to ${targetLanguage}. In response i want to get just translated text.: \n\n "${arguments}"`
                }
            ],
            "stream": false
        }), headers: { "Content-Type": "application/json" }
    });

    console.log(await response);

    if (response.ok === false) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    let responseJson = await response.json();
    console.log(responseJson);

    let translation = responseJson.choices[0].message.content;

    console.log(translation);

    console.log("strategies/lmstudio-translate/lmstudio-translate.js: execute", translation);
    return { translatedText: translation };
}

module.exports = {
    execute
};

