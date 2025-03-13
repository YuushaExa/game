async function loadGameData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error("Failed to load JSON");

        const data = await response.json();

        // Store game data globally for easy access
        window.gameData = data;

        // Example: Update the text panel with initial text
        updateTextPanel("1");

    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

const jsonFile = document.getElementById('gameData').getAttribute('data-src');
loadGameData(jsonFile);

// Function to update the text panel with localized text
function updateTextPanel(textId) {
    const { localization, settings, variables } = window.gameData;

    // Get the selected language
    const selectedLanguage = settings.languages;

    // Get the localized text
    const localizedText = localization[selectedLanguage][textId];
    if (!localizedText) {
        console.warn(`No localization found for textId: ${textId}`);
        return;
    }

    // Replace placeholders with variable values
    let updatedText = localizedText.replace(/{(\w+)}/g, (match, key) => {
        return variables[key] !== undefined ? variables[key] : match;
    });

    // Update the text panel
    const textPanel = document.getElementById("text-panel");
    if (textPanel) {
        textPanel.textContent = updatedText;
    }
}
