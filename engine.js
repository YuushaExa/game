// engine.js
let currentScene = null;
let currentDialogueIndex = 0;
let gameData = null;
let currentLanguage = 'en';

function loadJsonFile(filename) {
    fetch(filename)
        .then(response => response.json())
        .then(data => {
            gameData = data;
            currentLanguage = gameData.settings.default_language || 'en';
            loadScene(gameData.settings.launch_story || 'block_1');
        })
        .catch(error => console.error('Error loading JSON file:', error));
}

function loadScene(sceneId) {
    if (!gameData || !gameData.scenes[sceneId]) {
        console.error(`Scene ${sceneId} not found`);
        return;
    }

    currentScene = gameData.scenes[sceneId];
    currentDialogueIndex = 0;
    renderScene();
}

function renderScene() {
    const mainDiv = document.getElementById('main');
    mainDiv.innerHTML = '';

    // Set background
    if (currentScene.background) {
        if (currentScene.background.type === 'image') {
            mainDiv.style.backgroundImage = `url(${currentScene.background.source})`;
            mainDiv.style.backgroundSize = 'cover';
            mainDiv.style.backgroundPosition = 'center';
        } else if (currentScene.background.type === 'color') {
            mainDiv.style.backgroundColor = currentScene.background.source;
            mainDiv.style.backgroundImage = 'none';
        }
    }

    // Render HTML content if present
    if (currentScene.html) {
        const htmlContainer = document.createElement('div');
        htmlContainer.innerHTML = currentScene.html;
        mainDiv.appendChild(htmlContainer);
    }

    // Render dialogue interface
    const dialogueContainer = document.createElement('div');
    dialogueContainer.style.position = 'fixed';
    dialogueContainer.style.bottom = '0';
    dialogueContainer.style.left = '0';
    dialogueContainer.style.right = '0';
    dialogueContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    dialogueContainer.style.color = 'white';
    dialogueContainer.style.padding = '20px';
    dialogueContainer.style.minHeight = '100px';

    const characterNameDiv = document.createElement('div');
    characterNameDiv.style.fontWeight = 'bold';
    characterNameDiv.style.marginBottom = '10px';

    const textDiv = document.createElement('div');
    textDiv.style.marginBottom = '10px';

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.style.padding = '5px 10px';
    nextButton.onclick = nextDialogue;

    dialogueContainer.appendChild(characterNameDiv);
    dialogueContainer.appendChild(textDiv);
    dialogueContainer.appendChild(nextButton);

    mainDiv.appendChild(dialogueContainer);

    // Show first dialogue
    showDialogue(currentDialogueIndex);
}

function showDialogue(index) {
    if (!currentScene || !currentScene.dialogues || index >= currentScene.dialogues.length) {
        // No more dialogues, check for next scene
        if (currentScene.dialogues[index - 1]?.next_scene) {
            loadScene(currentScene.dialogues[index - 1].next_scene);
        }
        return;
    }

    const dialogue = currentScene.dialogues[index];
    const dialogueContainer = document.querySelector('#main > div:last-child');
    const characterNameDiv = dialogueContainer.querySelector('div:first-child');
    const textDiv = dialogueContainer.querySelector('div:nth-child(2)');

    // Set character name and color
    if (dialogue.character) {
        const character = gameData.characters[dialogue.character];
        characterNameDiv.textContent = character.name[currentLanguage] || dialogue.character;
        characterNameDiv.style.color = character.text_color || 'white';
        characterNameDiv.style.display = 'block';
    } else {
        characterNameDiv.style.display = 'none';
    }

    // Set text
    textDiv.textContent = dialogue.text[currentLanguage] || dialogue.text.en || '';
}

function nextDialogue() {
    currentDialogueIndex++;
    showDialogue(currentDialogueIndex);
}

// Expose functions to global scope for HTML event handlers
window.load_story = function(type, source) {
    if (type === 'file') {
        loadJsonFile(source);
    }
    // Add other types if needed
};
