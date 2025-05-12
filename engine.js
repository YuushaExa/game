class VisualNovelEngine {
    constructor() {
        this.currentScene = null;
        this.scenesData = {};
        this.handlers = {};
        this.mainDiv = document.getElementById('main');
        this.sceneTimeout = null;
        this.currentDialogIndex = 0;
        this.dialogTimeout = null;
        
        this.setupEventDelegation();
    }

    init(gameData) {
        this.scenesData = gameData.scenes;
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

            // Handle dialog progression on click
            if (this.currentSceneData?.dialog && this.currentDialogIndex < this.currentSceneData.dialog.length) {
                e.preventDefault();
                this.progressDialog();
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
        // Clear any existing timeouts
        if (this.sceneTimeout) {
            clearTimeout(this.sceneTimeout);
            this.sceneTimeout = null;
        }
        if (this.dialogTimeout) {
            clearTimeout(this.dialogTimeout);
            this.dialogTimeout = null;
        }

        const scene = this.scenesData[sceneId];
        if (!scene) {
            console.error(`Scene ${sceneId} not found`);
            return;
        }

        this.currentScene = sceneId;
        this.currentSceneData = scene;
        this.currentDialogIndex = 0;

        // Set background if specified
        if (scene.background) {
            this.setBackground(scene.background);
        }

        // If scene has dialog, render dialog system
        if (scene.dialog && scene.dialog.length > 0) {
            this.renderDialogSystem();
            this.showCurrentDialog();
        } else {
            // Regular scene rendering
            this.mainDiv.innerHTML = scene.html || '';
        }

        if (scene.onRender) {
            scene.onRender();
        }

        // Set up automatic transition if specified (only if no dialog or after last dialog)
        if (scene.scene && scene.scene.time && (!scene.dialog || this.currentDialogIndex >= scene.dialog.length)) {
            const time = parseInt(scene.scene.time) * 1000;
            const nextScene = scene.scene.next_scene;
            
            if (nextScene) {
                this.sceneTimeout = setTimeout(() => {
                    this.renderScene(nextScene);
                }, time);
            }
        }

        this.triggerEvent('sceneChanged', { sceneId });
    }

    renderDialogSystem() {
        this.mainDiv.innerHTML = `
            <div class="dialog-container">
                <div class="dialog">
                    <div class="name" id="nameDisplay"></div>
                    <div class="image-container">
                        <img class="image" id="imageDisplay" src="" alt="Character image">
                    </div>
                    <div class="text" id="textDisplay"></div>
                </div>
            </div>
            <style>
                .dialog-container {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                }
                .dialog {
                    max-width: 800px;
                    width: 100%;
                }
                .name {
                    font-weight: bold;
                    font-size: 1.2em;
                    margin-bottom: 10px;
                }
                .image-container {
                    float: left;
                    margin-right: 20px;
                    margin-bottom: 10px;
                }
                .image {
                    max-height: 150px;
                    max-width: 150px;
                    border-radius: 5px;
                }
                .text {
                    line-height: 1.5;
                }
            </style>
        `;
    }

    showCurrentDialog() {
        if (!this.currentSceneData.dialog || this.currentDialogIndex >= this.currentSceneData.dialog.length) {
            // Dialog finished, check for scene timeout
            if (this.currentSceneData.scene && this.currentSceneData.scene.time) {
                const time = parseInt(this.currentSceneData.scene.time) * 1000;
                const nextScene = this.currentSceneData.scene.next_scene;
                
                if (nextScene) {
                    this.sceneTimeout = setTimeout(() => {
                        this.renderScene(nextScene);
                    }, time);
                }
            }
            return;
        }

        const currentDialog = this.currentSceneData.dialog[this.currentDialogIndex];
        document.getElementById('nameDisplay').textContent = currentDialog.name;
        document.getElementById('imageDisplay').src = currentDialog.image;
        document.getElementById('textDisplay').textContent = currentDialog.text;
    }

    progressDialog() {
        this.currentDialogIndex++;
        this.showCurrentDialog();
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
