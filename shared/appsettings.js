const fs = require("fs");
const path = require("path");

function saveAppsettings(config) {
    try {
        const configPath = path.resolve(__dirname, "..", "appsettings.json");
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    }
    catch (error) {
        console.error("Failed to save config:", error);
    }
}

function loadAppsettings() {
    try {
        const configPath = path.resolve(__dirname, "..", "appsettings.json");
        const data = fs.readFileSync(configPath, "utf-8");
        return JSON.parse(data);
    }
    catch (error) {
        console.error("Failed to load config:", error);
    }
}

module.exports = {
    saveAppsettings,
    loadAppsettings
};