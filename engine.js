// engine.js
let currentSceneId = null;
let currentDialogueIndex = 0;
let currentLanguage = 'en';
let characters = {};
let variables = {};

function loadJsonFile(filename) {
    fetch(filename)
        .then(response => response.json())
        .then(data => {
            window.scenesData = data.scenes; // Store scenes data globally
            initializeEngine(data);
        })
        .catch(error => console.error('Error loading JSON file:', error));
}

function initializeEngine(data) {
    // Set up metadata and settings
    document.title = data.metadata.title || 'Visual Novel';
    currentLanguage = data.settings.default_language || 'en';
    characters = data.characters || {};
    variables = data.variables || {};
    
    // Set up initial scene
    const initialScene = data.settings.launch_story || Object.keys(data.scenes)[0];
    loadScene(initialScene);
}

function loadScene(sceneId) {
    const scene = window.scenesData[sceneId];
    if (!scene) {
        console.error(`Scene ${sceneId} not found!`);
        return;
    }
    
    currentSceneId = sceneId;
    currentDialogueIndex = 0;
    
    // Clear the main div and set up background
    const mainDiv = document.getElementById('main');
    mainDiv.innerHTML = '';
    
    // Set up background
    setBackground(scene.background, mainDiv);
    
    // If there's custom HTML, add it first
    if (scene.html) {
        mainDiv.innerHTML += scene.html;
    }
    
    // Create dialogue container HTML
    mainDiv.innerHTML += `
        <div id="dialogue-container" 
             style="position: fixed; 
                    bottom: 0; 
                    left: 0; 
                    right: 0; 
                    background-color: rgba(0, 0, 0, 0.7); 
                    color: white; 
                    padding: 20px; 
                    min-height: 100px;
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;">
        </div>
    `;
    
    const dialogueContainer = document.getElementById('dialogue-container');
    
    // Show the first dialogue
    showNextDialogue(scene, dialogueContainer);
    
    // Add click event to advance dialogue
    dialogueContainer.addEventListener('click', () => {
        showNextDialogue(scene, dialogueContainer);
    });
}

function setBackground(background, container) {
    if (!background) return;
    
    container.style.backgroundSize = 'cover';
    container.style.backgroundPosition = 'center';
    container.style.width = '100vw';
    container.style.height = '100vh';
    
    if (background.type === 'image') {
        container.style.backgroundImage = `url('${background.source}')`;
    } else if (background.type === 'color') {
        container.style.backgroundColor = background.source;
    }
}

function showNextDialogue(scene, container) {
    if (!scene.dialogues || currentDialogueIndex >= scene.dialogues.length) {
        // No more dialogues in this scene
        if (scene.dialogues && scene.dialogues[currentDialogueIndex - 1]?.next_scene) {
            // Load next scene if specified
            loadScene(scene.dialogues[currentDialogueIndex - 1].next_scene);
        }
        return;
    }
    
    const dialogue = scene.dialogues[currentDialogueIndex];
    let dialogueHTML = '';
    
    // Add character name if present
    if (dialogue.character) {
        const character = characters[dialogue.character];
        if (character) {
            const textColor = character.text_color || 'white';
            const characterName = character.name[currentLanguage] || dialogue.character;
            dialogueHTML += `<div style="font-weight: bold; color: ${textColor}">${characterName}</div>`;
        }
    }
    
    // Add dialogue text
    const dialogueText = dialogue.text[currentLanguage] || '';
    dialogueHTML += `<div style="margin-top: 10px">${dialogueText}</div>`;
    
    container.innerHTML = dialogueHTML;
    currentDialogueIndex++;
}

// Make loadJsonFile available globally
window.loadJsonFile = loadJsonFile;
