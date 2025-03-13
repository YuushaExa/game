// Load game data from JSON file
async function loadGameData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error("Failed to load JSON");

        const data = await response.json();

        // Store game data globally for easy access
        window.gameData = data;

        // Build HTML elements if defined in JSON
        if (data.html) {
            buildHTML(data.html);
        } else {
            console.warn("No 'html' section found in JSON.");
        }

        // Start the game from scene1
        startGameFromScene('scene1');

    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

// Build HTML elements based on the JSON data
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

        gameContainer.appendChild(element);
    });
}

// Start the game from a specific scene
function startGameFromScene(sceneId) {
    const scene = window.gameData.scenes.find(s => s.id === sceneId);
    if (!scene) {
        console.error(`Scene with ID ${sceneId} not found.`);
        return;
    }

    renderScene(scene);
}

// Render a scene
function renderScene(scene) {
    const gameContainer = document.getElementById("game");

    // Clear the game container
    gameContainer.innerHTML = '';

    // Set the background
    const backgroundUrl = window.gameData.backgrounds[scene.background];
    gameContainer.style.backgroundImage = `url(${backgroundUrl})`;
    gameContainer.style.backgroundSize = 'cover';
    gameContainer.style.backgroundPosition = 'center';

    // Render the text panel
    if (scene.textId) {
        updateTextPanel(scene.textId);
    }

    // Render choices if available
    if (scene.choices) {
        renderChoices(scene.choices);
    }

    // Render dialogue if available
    if (scene.dialogue) {
        renderDialogue(scene.dialogue);
    }
}

// Update the text panel with localized text
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

// Render choices for the player
function renderChoices(choices) {
    const choicesContainer = document.createElement("div");
    choicesContainer.id = "choices-container";
    choicesContainer.style.position = "absolute";
    choicesContainer.style.bottom = "10%";
    choicesContainer.style.left = "50%";
    choicesContainer.style.transform = "translateX(-50%)";
    choicesContainer.style.display = "flex";
    choicesContainer.style.flexDirection = "column";
    choicesContainer.style.alignItems = "center";

    choices.forEach(choice => {
        const choiceButton = document.createElement("button");
        choiceButton.textContent = window.gameData.localization[window.gameData.settings.languages][choice.textId];
        choiceButton.addEventListener("click", () => {
            // Update variables if defined
            if (choice.variables) {
                choice.variables.forEach(([variable, operation, value]) => {
                    if (operation === "add") {
                        window.gameData.variables[variable] += value;
                    }
                });
            }

            // Move to the next scene or action
            if (choice.action) {
                startGameFromScene(choice.action);
            }
        });
        choicesContainer.appendChild(choiceButton);
    });

    document.getElementById("game").appendChild(choicesContainer);
}

// Render dialogue for the scene
function renderDialogue(dialogue) {
    const dialogueContainer = document.createElement("div");
    dialogueContainer.id = "dialogue-container";
    dialogueContainer.style.position = "absolute";
    dialogueContainer.style.bottom = "20%";
    dialogueContainer.style.left = "50%";
    dialogueContainer.style.transform = "translateX(-50%)";
    dialogueContainer.style.textAlign = "center";

    dialogue.forEach(line => {
        if (line.name) {
            const character = window.gameData.characters[line.name];
            const dialogueLine = document.createElement("div");
            dialogueLine.textContent = `${character.name}: ${window.gameData.localization[window.gameData.settings.languages][line.textId]}`;
            dialogueContainer.appendChild(dialogueLine);
        } else if (line.choices) {
            renderChoices(line.choices);
        }
    });

    document.getElementById("game").appendChild(dialogueContainer);
}

// Start the game by loading the JSON file
const jsonFile = document.getElementById('gameData').getAttribute('data-src');
loadGameData(jsonFile);
