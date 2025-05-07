// engine.js
class VisualNovelEngine {
    constructor() {
        this.currentSceneId = null;
        this.currentDialogueIndex = 0;
        this.currentLanguage = 'en';
        this.characters = {};
        this.variables = {};
    }

    async loadJsonFile(filename) {
        try {
            const response = await fetch(filename);
            const data = await response.json();
            window.scenesData = data.scenes;
            this.initializeEngine(data);
        } catch (error) {
            console.error('Error loading JSON file:', error);
        }
    }

    initializeEngine(data) {
        document.title = data.metadata.title || 'Visual Novel';
        this.currentLanguage = data.settings.default_language || 'en';
        this.characters = data.characters || {};
        this.variables = data.variables || {};
        
        const initialScene = data.settings.launch_story || Object.keys(data.scenes)[0];
        this.loadScene(initialScene);
    }

    loadScene(sceneId) {
        const scene = window.scenesData[sceneId];
        if (!scene) {
            console.error(`Scene ${sceneId} not found!`);
            return;
        }
        
        this.currentSceneId = sceneId;
        this.currentDialogueIndex = 0;
        
        const mainDiv = document.getElementById('main');
        mainDiv.innerHTML = '';
        
        this.setBackground(scene.background, mainDiv);
        
        if (scene.html) {
            mainDiv.innerHTML += scene.html;
        }
        
        mainDiv.innerHTML += `
            <div id="dialogue-container" class="dialogue-container">
                <div id="dialogue-content" class="dialogue-content"></div>
                <button id="next-button" class="next-button">></button>
            </div>
        `;
        
        this.showNextDialogue(scene);
        
        document.getElementById('next-button').addEventListener('click', () => {
            this.showNextDialogue(scene);
        });
    }

    setBackground(background, container) {
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

    showNextDialogue(scene) {
        const container = document.getElementById('dialogue-content');
        const nextButton = document.getElementById('next-button');
        
        if (!scene.dialogues || this.currentDialogueIndex >= scene.dialogues.length) {
            if (scene.dialogues && scene.dialogues[this.currentDialogueIndex - 1]?.next_scene) {
                this.loadScene(scene.dialogues[this.currentDialogueIndex - 1].next_scene);
            }
            return;
        }
        
        const dialogue = scene.dialogues[this.currentDialogueIndex];
        let dialogueHTML = '';
        
        if (dialogue.character) {
            const character = this.characters[dialogue.character];
            if (character) {
                const textColor = character.text_color || 'white';
                const characterName = character.name[this.currentLanguage] || dialogue.character;
                dialogueHTML += `<div class="character-name" style="color: ${textColor}">${characterName}</div>`;
            }
        }
        
        const dialogueText = dialogue.text[this.currentLanguage] || '';
        dialogueHTML += `<div class="dialogue-text">${dialogueText}</div>`;
        
        container.innerHTML = dialogueHTML;
        this.currentDialogueIndex++;
        
        // Hide next button if it's the last dialogue without a next scene
        if (this.currentDialogueIndex >= scene.dialogues.length && 
            !(scene.dialogues[this.currentDialogueIndex - 1]?.next_scene)) {
            nextButton.style.visibility = 'hidden';
        } else {
            nextButton.style.visibility = 'visible';
        }
    }
}

// Initialize the engine when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const engine = new VisualNovelEngine();
    window.vnEngine = engine; // Make engine available globally
    
    // If the body has an onload event, it will call loadJsonFile
    // Otherwise we could start it here
});
