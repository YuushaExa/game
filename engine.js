class VisualNovelEngine {
    constructor() {
        this.currentScene = null;
        this.scenesData = {};
        this.handlers = {};
        this.mainDiv = document.getElementById('main');
        this.sceneTimeout = null; // To store the timeout reference
        
        // Set up event delegation once during initialization
        this.setupEventDelegation();
    }

    // Initialize the engine with game data
    init(gameData) {
        this.scenesData = gameData.scenes;
        this.triggerEvent('dataLoaded');
        this.startVisualNovel();
    }

    // Set up event delegation for scene transitions
    setupEventDelegation() {
        this.mainDiv.addEventListener('click', (e) => {
            // Check if the clicked element or its parent has a next_scene attribute
            const elementWithNextScene = e.target.closest('[next_scene]');
            if (elementWithNextScene) {
                const targetScene = elementWithNextScene.getAttribute('next_scene');
                this.renderScene(targetScene);
            }
        });
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
        // Clear any existing timeout
        if (this.sceneTimeout) {
            clearTimeout(this.sceneTimeout);
            this.sceneTimeout = null;
        }

        const scene = this.scenesData[sceneId];
        if (!scene) {
            console.error(`Scene ${sceneId} not found`);
            return;
        }

        this.currentScene = sceneId;
        this.mainDiv.innerHTML = scene.html || '';
        
        // Set background if specified
        if (scene.background) {
            this.setBackground(scene.background);
        }
        
        if (scene.onRender) {
            scene.onRender();
        }

        // Set up automatic transition if specified
        if (scene.scene && scene.scene.time) {
            const time = parseInt(scene.scene.time) * 1000; // Convert to milliseconds
            const nextScene = scene.scene.next_scene;
            
            if (nextScene) {
                this.sceneTimeout = setTimeout(() => {
                    this.renderScene(nextScene);
                }, time);
            }
        }

        this.triggerEvent('sceneChanged', { sceneId });
    }

    // Helper method to set background
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
