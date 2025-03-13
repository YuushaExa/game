async function loadGameData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error("Failed to load JSON");

        const data = await response.json();

        if (data.html) {
            // Find the current scene based on the chapter
            const currentChapter = data.chapter;
            const currentScene = data.scenes.find(scene => scene.id === `scene${currentChapter}`);

            // Clear the existing game content
            const gameElement = document.getElementById("game");
            gameElement.innerHTML = "";

            // Build HTML with the current scene data
            buildHTML(data.html, gameElement, currentScene);
        } else {
            console.warn("No 'html' section found in JSON.");
        }

        // Store game data globally for easy access
        window.gameData = data;
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
