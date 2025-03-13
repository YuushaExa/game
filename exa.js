async function loadGameData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error("Failed to load JSON");
        
        const data = await response.json();
        
        if (data.html) {
            buildHTML(data.html);
        } else {
            console.warn("No 'html' section found in JSON.");
        }
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

function buildHTML(htmlData) {
    const gameContainer = document.getElementById("game");

    Object.keys(htmlData).forEach(key => {
        const elementData = htmlData[key];

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

        // Add event listeners
        if (elementData.events) {
            Object.keys(elementData.events).forEach(eventType => {
                element.addEventListener(eventType, window[elementData.events[eventType]]);
            });
        }

        gameContainer.appendChild(element);
    });
}
