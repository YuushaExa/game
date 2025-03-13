async function loadGameData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error("Failed to load JSON");

        const data = await response.json();

        // Store game data globally for easy access
        window.gameData = data;

        if (data.html) {
            // Start from scene1 by default
            const initialScene = data.scenes.find(scene => scene.id === "scene1");
            if (!initialScene) {
                console.error("Scene1 not found in the game data.");
                return;
            }

            // Clear the existing game content
            const gameElement = document.getElementById("game");
            gameElement.innerHTML = "";

            // Build HTML with the initial scene data
            buildHTML(data.html, gameElement, initialScene);
        } else {
            console.warn("No 'html' section found in JSON.");
        }
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

const jsonFile = document.getElementById('gameData').getAttribute('data-src');
loadGameData(jsonFile);

function buildHTML(htmlData, parentElement = document.getElementById("game"), sceneData = null) {
    Object.keys(htmlData).forEach(key => {
        const elementData = htmlData[key];

        // Check if the element is bound to a scene property
        if (elementData.bind) {
            // If the bound property does not exist in the current scene, skip this element
            if (!sceneData || !sceneData[elementData.bind]) {
                return; // Skip this element
            }
        }

        // Create element based on type
        const element = document.createElement(elementData.type || "div");

        // Set attributes
        if (elementData.attributes) {
            Object.keys(elementData.attributes).forEach(attr => {
                element.setAttribute(attr, elementData.attributes[attr]);
            });
        }

        // Apply styles
        if (elementData.styles) {
            Object.assign(element.style, elementData.styles);
        }

        // Set text content
        if (elementData.content) {
            element.textContent = elementData.content;
        }

        // Handle binding to scene data
        if (elementData.bind && sceneData) {
            const boundData = sceneData[elementData.bind];
            if (boundData) {
                // Update element content based on bound data
                if (Array.isArray(boundData)) {
                    // If bound data is an array (e.g., dialogue), join it into a string
                    element.textContent = boundData.map(item => item.text || item).join(" ");
                } else {
                    element.textContent = boundData;
                }
            }
        }

        // Add event listeners
        if (elementData.events) {
            Object.keys(elementData.events).forEach(eventType => {
                element.addEventListener(eventType, window[elementData.events[eventType]]);
            });
        }

        // Recursively build and append children
        if (elementData.children) {
            buildHTML(elementData.children, element, sceneData);
        }

        // Append the element to the parent
        parentElement.appendChild(element);
    });
}

function transitionToScene(sceneId) {
    const scene = window.gameData.scenes.find(s => s.id === sceneId);
    if (scene) {
        // Clear the existing game content
        const gameElement = document.getElementById("game");
        gameElement.innerHTML = "";

        // Rebuild HTML with the new scene data
        buildHTML(window.gameData.html, gameElement, scene);
    }
}
