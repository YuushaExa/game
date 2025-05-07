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
    
    // Clear previous content
    mainDiv.innerHTML = '';

    // Set background styles
    let backgroundStyle = '';
    if (currentScene.background) {
        if (currentScene.background.type === 'image') {
            backgroundStyle = `background-image: url('${currentScene.background.source}'); background-size: cover; background-position: center;`;
        } else if (currentScene.background.type === 'color') {
            backgroundStyle = `background-color: ${currentScene.background.source};`;
        }
    }

    // Create main container with background
    mainDiv.innerHTML = `
        <div style="${backgroundStyle} width: 100%; height: 100vh; position: relative;">
            ${currentScene.html || ''}
            <div style="position: fixed; bottom: 0; left: 0; right: 0; background-color: rgba(0, 0, 0, 0.7); color: white; padding: 20px; min-height: 100px;">
                <div id="character-name" style="font-weight: bold; margin-bottom: 10px;"></div>
                <div id="dialogue-text" style="margin-bottom: 10px;"></div>
                <button id="next-button" style="padding: 5px 10px;">Next</button>
            </div>
        </div>
    `;

    // Add event listener to the button
    document.getElementById('next-button').addEventListener('click', nextDialogue);

    // Show first dialogue
    showDialogue(currentDialogueIndex);
}

function showDialogue(index) {
    if (!currentScene || !currentScene.dialogues || index >= currentScene.dialogues.length) {
        // Check for next scene
        if (currentScene.dialogues[index - 1]?.next_scene) {
            loadScene(currentScene.dialogues[index - 1].next_scene);
        }
        return;
    }

    const dialogue = currentScene.dialogues[index];
    const characterNameDiv = document.getElementById('character-name');
    const textDiv = document.getElementById('dialogue-text');

    // Set character name and color
    if (dialogue.character) {
        const character = gameData.characters[dialogue.character];
        characterNameDiv.innerHTML = character.name[currentLanguage] || dialogue.character;
        characterNameDiv.style.color = character.text_color || 'white';
        characterNameDiv.style.display = 'block';
    } else {
        characterNameDiv.style.display = 'none';
    }

    // Set text
    textDiv.innerHTML = dialogue.text[currentLanguage] || dialogue.text.en || '';
}

function nextDialogue() {
    currentDialogueIndex++;
    showDialogue(currentDialogueIndex);
}

// Global functions
window.load_story = function(type, source) {
    if (type === 'file') {
        loadJsonFile(source);
    }
};
