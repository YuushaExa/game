class VisualNovelEngine {
    constructor() {
        this.currentScene = null;
        this.scenesData = {};
        this.handlers = {};
        this.sceneHistory = [];
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
    renderScene(sceneId, addToHistory = true) {
        const scene = this.scenesData[sceneId];
        if (!scene) {
            console.error(`Scene ${sceneId} not found`);
            return;
        }

        // Update scene history
        if (addToHistory && sceneId !== this.currentScene) {
            this.sceneHistory.push(sceneId);
            if (this.sceneHistory.length > 10) { // Limit history size
                this.sceneHistory.shift();
            }
        }

        this.currentScene = sceneId;
        
        const mainDiv = document.getElementById('main');
        mainDiv.innerHTML = scene.html || '';
 if (scene.onRender) {
        scene.onRender();
    }
        // Set up scene interactions
        setTimeout(() => {
            // Find all elements with next_scene attributes
            const nextSceneElements = mainDiv.querySelectorAll('[next_scene]');
            
            // Add click handlers to these elements
            nextSceneElements.forEach(element => {
                element.addEventListener('click', (e) => {
                    const targetScene = element.getAttribute('next_scene');
                    this.handleSceneTransition(targetScene);
                });
            });

            // Auto-advance if specified
            if (scene.next_scene && nextSceneElements.length === 0) {
                setTimeout(() => {
                    this.handleSceneTransition(scene.next_scene);
                }, 3000);
            }
        }, 100);

        this.triggerEvent('sceneChanged', { sceneId });
    }

    // Handle scene transitions
    handleSceneTransition(targetScene) {
        if (targetScene === "previous_scene") {
            this.goBack();
        } else {
            this.renderScene(targetScene);
        }
    }

    // Method to go back to previous scene
    goBack() {
        if (this.sceneHistory.length > 1) {
            // Remove current scene from history
            this.sceneHistory.pop();
            // Get previous scene
            const previousScene = this.sceneHistory[this.sceneHistory.length - 1];
            // Render it (without adding to history again)
            this.renderScene(previousScene, false);
        } else {
            // Fallback if no history
            this.renderScene("start_screen");
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
