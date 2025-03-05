async function execute(arguments) {
    console.log("strategies/libra-translate/libra-translate.js: execute", arguments);
    
    const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        body: JSON.stringify({
            q: arguments,
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

    return await response.json();
}

module.exports = {
    execute
};