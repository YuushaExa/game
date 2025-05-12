class VisualNovelEngine {
    constructor() {
        this.currentScene = null;
        this.scenesData = {};
        this.handlers = {};
        this.mainDiv = document.getElementById('main');
        this.sceneTimeout = null;
        this.currentDialogIndex = 0;
        this.currentDialogs = [];
        
        this.setupEventDelegation();
    }

    init(gameData) {
        this.scenesData = gameData.scenes;
        this.uiTemplates = gameData.ui || {}; // Store UI templates
        this.triggerEvent('dataLoaded');
        this.startVisualNovel();
    }

    setupEventDelegation() {
        this.mainDiv.addEventListener('click', (e) => {
            const elementWithNextScene = e.target.closest('[next_scene]');
            if (elementWithNextScene) {
                const targetScene = elementWithNextScene.getAttribute('next_scene');
                this.renderScene(targetScene);
                return;
            }

            // Check for dialog advancement
            const dialogAdvancer = e.target.closest('[advance_dialog]');
            if (dialogAdvancer && this.currentDialogs.length > 0) {
                this.advanceDialog();
            }
        });
    }

    startVisualNovel() {
        if (this.scenesData['start_screen']) {
            this.renderScene('start_screen');
        } else if (this.scenesData['block_1']) {
            this.renderScene('block_1');
        } else {
            console.error('No starting scene found');
        }
    }

    renderScene(sceneId) {
        // Clear existing state
        if (this.sceneTimeout) {
            clearTimeout(this.sceneTimeout);
            this.sceneTimeout = null;
        }
        this.currentDialogIndex = 0;
        this.currentDialogs = [];

        const scene = this.scenesData[sceneId];
        if (!scene) {
            console.error(`Scene ${sceneId} not found`);
            return;
        }

        this.currentScene = sceneId;
        
        // Set background if specified
        if (scene.background) {
            this.setBackground(scene.background);
        }

        // Check for dialog data
        if (scene.dialog) {
            this.currentDialogs = scene.dialog;
            this.renderDialog();
        } else {
            // Regular scene rendering
            this.mainDiv.innerHTML = scene.html || '';
            
            if (scene.onRender) {
                scene.onRender();
            }

            // Set up automatic transition if specified
            if (scene.scene && scene.scene.time) {
                const time = parseInt(scene.scene.time) * 1000;
                const nextScene = scene.scene.next_scene;
                
                if (nextScene) {
                    this.sceneTimeout = setTimeout(() => {
                        this.renderScene(nextScene);
                    }, time);
                }
            }
        }

        this.triggerEvent('sceneChanged', { sceneId });
    }

    renderDialog() {
        if (this.currentDialogIndex >= this.currentDialogs.length) {
            // No more dialogs, check for auto scene transition
            const scene = this.scenesData[this.currentScene];
            if (scene.scene && scene.scene.next_scene) {
                this.renderScene(scene.scene.next_scene);
            }
            return;
        }

        const dialog = this.currentDialogs[this.currentDialogIndex];
        let dialogHTML = this.uiTemplates.dialog || `
            <div class="dialog">
                <div class="name" id="nameDisplay">${dialog.name || ''}</div>
                <div class="image" id="imageDisplay">
                    ${dialog.image ? `<img src="${dialog.image}">` : ''}
                </div>
                <div class="text" id="textDisplay">${dialog.text || ''}</div>
                <button advance_dialog>Next</button>
            </div>
        `;

        // Replace placeholders with actual dialog data
        dialogHTML = dialogHTML
            .replace('${name}', dialog.name || '')
            .replace('${image}', dialog.image ? `<img src="${dialog.image}">` : '')
            .replace('${text}', dialog.text || '');

        this.mainDiv.innerHTML = dialogHTML;
    }

    advanceDialog() {
        this.currentDialogIndex++;
        this.renderDialog();
    }

    setBackground(background) {
        if (background.type === "image") {
            document.body.style.backgroundImage = `url('${background.source}')`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
        } else if (background.type === "color") {
            document.body.style.background = background.source;
            document.body.style.backgroundImage = "none";
        }
    }

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
}

document.addEventListener('DOMContentLoaded', () => {
    window.vnEngine = new VisualNovelEngine();
    
    if (typeof gameData !== 'undefined') {
        vnEngine.init(gameData);
    } else {
        console.error('gameData is not defined. Make sure game.js is loaded.');
    }
});
