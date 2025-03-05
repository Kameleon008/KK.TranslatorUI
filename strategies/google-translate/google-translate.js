function execute(arguments) {
    console.log("strategies/google-translate/google-translate.js: execute", arguments);
    
    return     {
        inputText: arguments,
        translatedText: "Text Translated with GoogleTranslate"
    }
}

module.exports = {
    execute
};