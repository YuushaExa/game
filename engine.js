class VisualNovelEngine {
    constructor() {
        this.currentScene = null;
        this.currentDialogueIndex = 0;
        this.language = 'en';
        this.scenesData = {};
        this.handlers = {};
    }

    // Initialize the engine with game data
    init(gameData) {
        this.scenesData = gameData.scenes;
        this.triggerEvent('dataLoaded');
        this.startVisualNovel();
    }

    // Start the visual novel
    startVisualNovel() {
        if (this.scenesData['start_screen']) {
            this.renderScene('start_screen');
        } else if (this.scenesData['block_1']) {
            this.renderScene('block_1');
        } else {
            console.error('No starting scene found');
        }
    }

    // Render a scene
    renderScene(sceneId) {
        const scene = this.scenesData[sceneId];
        if (!scene) {
            console.error(`Scene ${sceneId} not found`);
            return;
        }

        this.currentScene = sceneId;
        this.currentDialogueIndex = 0;
        
        const mainDiv = document.getElementById('main');
        mainDiv.innerHTML = '';

        if (scene.html) {
            this.renderHtmlScene(scene);
        } else {
            this.renderRegularScene(scene);
        }

        this.triggerEvent('sceneChanged', { sceneId });
    }

    // Render an HTML scene
    renderHtmlScene(scene) {
        const mainDiv = document.getElementById('main');
        mainDiv.innerHTML = scene.html;
    // Set up language switcher for this scene
    this.setupLanguageSwitcher();
        
            if (scene.next_scene) {
            setTimeout(() => {
                // Find all elements with next_scene attributes
                const nextSceneElements = mainDiv.querySelectorAll('[next_scene]');
                
                // Add click handlers to these elements
                nextSceneElements.forEach(element => {
                    const targetScene = element.getAttribute('next_scene');
                    element.addEventListener('click', () => {
                        this.renderScene(targetScene);
                    });
                });

                // Auto-advance if no elements found
                if (nextSceneElements.length === 0) {
                    setTimeout(() => {
                        this.renderScene(scene.next_scene);
                    }, 3000);
                }
            }, 100);
        }
    }

    // Render a regular dialogue scene
    renderRegularScene(scene) {
        const mainDiv = document.getElementById('main');
        
        // Create scene container
        const sceneContainer = document.createElement('div');
        sceneContainer.className = 'vn-scene';
        
        // Set background
        this.setSceneBackground(scene, sceneContainer);

        // Create dialogue box
        const dialogueBox = this.createDialogueBox();
        sceneContainer.appendChild(dialogueBox);

        // Append to main div
        mainDiv.appendChild(sceneContainer);

        // Show first dialogue
        this.showDialogue(this.currentDialogueIndex);
    }


    // Set scene background
    setSceneBackground(scene, container) {
        if (!scene.background) {
            container.style.backgroundColor = '#000';
            return;
        }

        const bg = scene.background;
        if (bg.type === 'image') {
            container.style.backgroundImage = `url(${bg.source})`;
            container.style.backgroundSize = bg.size || 'cover';
            container.style.backgroundPosition = bg.position || 'center';
            container.style.backgroundRepeat = 'no-repeat';
        } else if (bg.type === 'color') {
            container.style.backgroundColor = bg.source;
        } else if (bg.type === 'gradient') {
            container.style.background = bg.source;
        }
    }

    // Create dialogue box
    createDialogueBox() {
        const dialogueBox = document.createElement('div');
        dialogueBox.className = 'vn-dialogue-box';
        
        // Character name element
        const characterName = document.createElement('div');
        characterName.className = 'vn-character-name';
        
        // Dialogue text element
        const dialogueText = document.createElement('div');
        dialogueText.className = 'vn-dialogue-text';
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'vn-next-button';
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => this.showNextDialogue());

        dialogueBox.appendChild(characterName);
        dialogueBox.appendChild(dialogueText);
        dialogueBox.appendChild(nextButton);

        return dialogueBox;
    }

    // Show dialogue at specific index
    showDialogue(index) {
        const scene = this.scenesData[this.currentScene];
        if (!scene || !scene.dialogues || index >= scene.dialogues.length) {
            console.error('Dialogue not found or index out of bounds');
            return;
        }

        const dialogue = scene.dialogues[index];
        const characterName = document.querySelector('.vn-character-name');
        const dialogueText = document.querySelector('.vn-dialogue-text');

        // Set character name if present
        if (dialogue.character) {
            characterName.textContent = dialogue.character;
            characterName.style.display = 'block';
        } else {
            characterName.style.display = 'none';
        }

        // Set dialogue text
        if (dialogue.text && dialogue.text[this.language]) {
            dialogueText.textContent = dialogue.text[this.language];
        } else {
            dialogueText.textContent = '[Text not available]';
        }

        this.triggerEvent('dialogueChanged', { 
            sceneId: this.currentScene, 
            dialogueIndex: index,
            dialogue
        });
    }

    // Show next dialogue or next scene
    showNextDialogue() {
        const scene = this.scenesData[this.currentScene];
        this.currentDialogueIndex++;

        if (this.currentDialogueIndex < scene.dialogues.length) {
            this.showDialogue(this.currentDialogueIndex);
        } else {
            // Check for next scene in last dialogue or scene
            const nextScene = this.getNextScene(scene);
            if (nextScene) {
                this.renderScene(nextScene);
            } else {
                this.showEnding();
            }
        }
    }

    // Determine next scene
    getNextScene(scene) {
        // Check last dialogue for next_scene
        const lastDialogue = scene.dialogues[scene.dialogues.length - 1];
        if (lastDialogue.next_scene && this.scenesData[lastDialogue.next_scene]) {
            return lastDialogue.next_scene;
        }
        // Check scene for next_scene
        if (scene.next_scene && this.scenesData[scene.next_scene]) {
            return scene.next_scene;
        }
        return null;
    }

    // Show ending
    showEnding() {
        const dialogueBox = document.querySelector('.vn-dialogue-box');
        if (dialogueBox) {
            dialogueBox.innerHTML = '<div class="vn-ending">The End</div>';
            this.triggerEvent('gameEnded');
        }
    }

    // Switch language
    switchLanguage(lang) {
        this.language = lang;
        if (this.currentScene) {
            this.showDialogue(this.currentDialogueIndex);
        }
        this.triggerEvent('languageChanged', { language: lang });
    }

    // Event handling system
    on(event, handler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
    }

    triggerEvent(event, data = {}) {
        if (this.handlers[event]) {
            this.handlers[event].forEach(handler => handler(data));
        }
    }

    // Setup language switcher
    setupLanguageSwitcher() {
        const switcher = document.getElementById('language-switcher');
        if (switcher) {
            switcher.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const lang = e.target.dataset.lang;
                    if (lang) this.switchLanguage(lang);
                });
            });
        }
    }
}

// Initialize the engine when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.vnEngine = new VisualNovelEngine();
    
    // Check if gameData is available
    if (typeof gameData !== 'undefined') {
        vnEngine.init(gameData);
    } else {
        console.error('gameData is not defined. Make sure game.js is loaded.');
    }
});
