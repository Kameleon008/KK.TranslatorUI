async function getStrategyResult(input, selectedStrategy) {

    console.log("strategies/strategies.js: getStrategyResult", selectedStrategy, input);

    switch (selectedStrategy) {
        case "libraTranslate": result = await require('./libra-translate/libra-translate').execute(input); break;
        case "googleTranslate": result = await require('./google-translate/google-translate').execute(input); break;
        case "ollamaTranslate": result = await require('./ollama-translate/ollama-translate').execute(input); break;
        // default: return require('./libra-translate/libra-translate').execute(input);
    }

    console.log(result);
    return result;
}

module.exports = {
    getStrategyResult
};