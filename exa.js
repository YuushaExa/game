async function loadGameData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error("Failed to load JSON");

        const data = await response.json();
        window.gameData = data;

        // Initialize the first scene
        changeScene("scene1");

    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

function changeScene(sceneId) {
    const scene = window.gameData.scenes.find(s => s.id === sceneId);
    if (!scene) {
        console.warn(`Scene ${sceneId} not found.`);
        return;
    }

    // Hide all elements
    document.querySelectorAll(".screen, .panel").forEach(element => {
        element.style.display = "none";
    });

    // Show elements for the current scene
    scene.visibleElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = "block";
        } else {
            console.warn(`Element with ID ${elementId} not found.`);
        }
    });

    // Update the background (optional)
    if (scene.background) {
        document.body.style.backgroundImage = `url(${scene.background})`;
    }

    // Update dialogue or other scene-specific content
    if (scene.dialogue) {
        updateDialogue(scene.dialogue);
    }
}

function updateDialogue(dialogue) {
    const textPanel = document.getElementById("text-panel");
    if (textPanel) {
        textPanel.textContent = dialogue.map(line => line.textId).join("\n");
    }
}

// Load game data
const jsonFile = document.getElementById('gameData').getAttribute('data-src');
loadGameData(jsonFile);

// Example: Add event listeners for scene transitions
document.getElementById("start-button").addEventListener("click", () => {
    changeScene("scene2");
});
