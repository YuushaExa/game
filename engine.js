class VisualNovelEngine {
    constructor() {
        this.currentScene = null;
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
                    this.renderScene(targetScene);
                });
            });

            // Auto-advance if specified
            if (scene.next_scene && nextSceneElements.length === 0) {
                setTimeout(() => {
                    this.renderScene(scene.next_scene);
                }, 3000);
            }
        }, 100);

        this.triggerEvent('sceneChanged', { sceneId });
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
