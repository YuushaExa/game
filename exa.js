async function loadGameData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error("Failed to load JSON");

        const data = await response.json();

        if (data.html) {
            buildHTML(data.html);
        } else {
            console.warn("No 'html' section found in JSON.");
        }

        // Store game data globally for easy access
        window.gameData = data;
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

const jsonFile = document.getElementById('gameData').getAttribute('data-src');
loadGameData(jsonFile);

function buildHTML(htmlData) {
    const gameContainer = document.getElementById("game");

    Object.keys(htmlData).forEach(key => {
        const elementData = htmlData[key];

        // Create element based on type
        const element = document.createElement(elementData.type || "div");

        // Set attributes
        if (elementData.attributes) {
            Object.keys(elementData.attributes).forEach(attr => {
                element.setAttribute(attr, elementData.attributes[attr]);
            });
        }

        // Apply styles
        if (elementData.styles) {
            Object.assign(element.style, elementData.styles);
        }

        // Set text content
        if (elementData.content) {
            element.textContent = elementData.content;
        }

        // Add event listeners
        if (elementData.events) {
            Object.keys(elementData.events).forEach(eventType => {
                element.addEventListener(eventType, window[elementData.events[eventType]]);
            });
        }

        // Recursively build and append children
        if (elementData.children) {
            buildHTML(elementData.children, element);
        }

        gameContainer.appendChild(element);
    });
}


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
