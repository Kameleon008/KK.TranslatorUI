const fs = require("fs");

function parseArguments(argv) {

    let args = argv.slice(2);
    let parsedArgs = {};

    args.forEach((arg, index) => {
        if (arg.startsWith('--')) {
            const key = arg.replace(/^--/, "");
            const value = args[index + 1]?.startsWith('--') || args[index + 1] === undefined ? true : args[index + 1];
            parsedArgs[key] = value;
        }
    });

    return parsedArgs;
}

function processArguments(parsedArgs) {
    let result = {};

    if (parsedArgs.file) {
        result.text = processFileArgument(parsedArgs.file);
    }

    return result;
}

function processFileArgument(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data;
    } catch (err) {
        console.error("Error reading file:", err);
        return null;
    }
}

module.exports = {
    parseArguments,
    processArguments
};