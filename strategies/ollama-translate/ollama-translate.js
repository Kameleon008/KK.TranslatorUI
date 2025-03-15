async function execute(arguments) {
    console.log("strategies/ollama-translate/ollama-translate.js: execute", arguments);

    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
            "model": "gemma3:12b",
            "prompt": `Translate text below to Polish. In response i want to get just translated text.: \n\n "${arguments}"`,
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

