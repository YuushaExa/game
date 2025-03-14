// Load game data from JSON file
async function loadGameData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error("Failed to load JSON");

        const data = await response.json();
        window.gameData = data;

        // Initialize the first scene
        changeScene("scene1");

    } catch (error) {
        console.error("Error loading JSON:", error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
    }
}

// Change to a specific scene
function changeScene(sceneId) {
    const scene = window.gameData.scenes.find(s => s.id === sceneId);
    if (scene) {
        displayScene(scene);
    } else {
        console.error("Scene not found:", sceneId);
    }
}

// Display the scene content
// Display the scene content, including dialogue
function displayScene(scene) {
    const gameContainer = document.getElementById('game');
    gameContainer.innerHTML = '';

    // Background
    if (scene.background) {
        const backgroundImage = document.createElement('div');
        backgroundImage.style.backgroundImage = `url(${window.gameData.backgrounds[scene.background]})`;
        backgroundImage.style.width = '100%';
        backgroundImage.style.height = '100%';
        backgroundImage.style.position = 'absolute';
        backgroundImage.style.top = '0';
        backgroundImage.style.left = '0';
        backgroundImage.style.backgroundSize = 'cover';
        gameContainer.appendChild(backgroundImage);
    }

    // Text Panel
    const textPanel = document.getElementById('text-panel');
    textPanel.innerHTML = ''; // Clear previous content

    // Display dialogue if it exists
    if (scene.dialogue && scene.dialogue.length > 0) {
        let currentDialogueIndex = 0;

        // Function to display the current dialogue
        const showDialogue = () => {
            const dialogueEntry = scene.dialogue[currentDialogueIndex];
            const character = window.gameData.characters[dialogueEntry.name];
            const text = window.gameData.localization[window.gameData.settings.languages][dialogueEntry.textId];

            // Clear the text panel
            textPanel.innerHTML = '';

            // Display character name and text
            const nameElement = document.createElement('div');
            nameElement.textContent = character.name;
            nameElement.style.color = character.color;
            nameElement.style.fontWeight = 'bold';
            textPanel.appendChild(nameElement);

            const textElement = document.createElement('div');
            textElement.textContent = text;
            textPanel.appendChild(textElement);

            // Show the text panel
            textPanel.style.display = 'flex';

            // Move to the next dialogue entry
            currentDialogueIndex++;

            // If there are more dialogues, set a timeout for the next one
            if (currentDialogueIndex < scene.dialogue.length) {
                setTimeout(showDialogue, 2000); // Adjust delay as needed
            } else {
                // If no more dialogues, show choices (if any)
                if (scene.choices && scene.choices.length > 0) {
                    displayChoices(scene.choices);
                }
            }
        };

        // Start displaying dialogue
        showDialogue();
    } else if (scene.textId) {
        // Fallback to displaying a single text entry if no dialogue exists
        textPanel.textContent = window.gameData.localization[window.gameData.settings.languages][scene.textId];
        textPanel.style.display = 'flex';
    } else {
        textPanel.style.display = 'none';
    }

    // Display choices (if no dialogue or after dialogue ends)
    if (scene.choices && scene.choices.length > 0 && (!scene.dialogue || scene.dialogue.length === 0)) {
        displayChoices(scene.choices);
    }
}

// Display choices
function displayChoices(choices) {
    const choicesContainer = document.createElement('div');
    choicesContainer.style.position = 'absolute';
    choicesContainer.style.bottom = '20px';
    choicesContainer.style.left = '50%';
    choicesContainer.style.transform = 'translateX(-50%)';
    choicesContainer.style.display = 'flex';
    choicesContainer.style.gap = '10px';

    choices.forEach(choice => {
        const choiceButton = document.createElement('button');
        choiceButton.textContent = window.gameData.localization[window.gameData.settings.languages][choice.textId];
        choiceButton.classList.add('menu-button');
        choiceButton.addEventListener('click', () => {
            if (choice.action) {
                changeScene(choice.action);
            }
        });
        choicesContainer.appendChild(choiceButton);
    });

    document.getElementById('game').appendChild(choicesContainer);
}
// Event delegation for buttons
document.getElementById('game').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('menu-button')) {
        const sceneId = target.getAttribute('data-next-scene');
        if (sceneId) {
            changeScene(sceneId);
        }
    }
});

// Load game data
const jsonFile = document.getElementById('gameData').getAttribute('data-src');
loadGameData(jsonFile);
