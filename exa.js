// Load game data from JSON file
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
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
    }
}

// Change to a specific scene
function changeScene(sceneId) {
    const scene = window.gameData.scenes.find(s => s.id === sceneId);
    if (scene) {
        displayScene(scene);
    } else {
        console.error("Scene not found:", sceneId);
    }
}

// Display the scene content
function displayScene(scene) {
    const gameContainer = document.getElementById('game');
    gameContainer.innerHTML = '';

    // Background
    if (scene.background) {
        const backgroundImage = document.createElement('div');
        backgroundImage.style.backgroundImage = `url(${window.gameData.backgrounds[scene.background]})`;
        backgroundImage.style.width = '100%';
        backgroundImage.style.height = '100%';
        backgroundImage.style.position = 'absolute';
        backgroundImage.style.top = '0';
        backgroundImage.style.left = '0';
        backgroundImage.style.backgroundSize = 'cover';
        gameContainer.appendChild(backgroundImage);
    }

    // Text Panel
    const textPanel = document.getElementById('text-panel');
    if (scene.textId) {
        textPanel.textContent = window.gameData.localization[window.gameData.settings.languages][scene.textId];
        textPanel.style.display = 'flex';
    } else {
        textPanel.style.display = 'none';
    }

    // Choices
    if (scene.choices && scene.choices.length > 0) {
        const choicesContainer = document.createElement('div');
        choicesContainer.style.position = 'absolute';
        choicesContainer.style.bottom = '20px';
        choicesContainer.style.left = '50%';
        choicesContainer.style.transform = 'translateX(-50%)';
        choicesContainer.style.display = 'flex';
        choicesContainer.style.gap = '10px';

        scene.choices.forEach(choice => {
            const choiceButton = document.createElement('button');
            choiceButton.textContent = window.gameData.localization[window.gameData.settings.languages][choice.textId];
            choiceButton.classList.add('menu-button');
            choiceButton.addEventListener('click', () => {
                if (choice.action) {
                    changeScene(choice.action);
                }
            });
            choicesContainer.appendChild(choiceButton);
        });

        gameContainer.appendChild(choicesContainer);
    }
}

// Event delegation for buttons
document.getElementById('game').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('menu-button')) {
        const sceneId = target.getAttribute('data-next-scene');
        if (sceneId) {
            changeScene(sceneId);
        }
    }
});

// Load game data
const jsonFile = document.getElementById('gameData').getAttribute('data-src');
loadGameData(jsonFile);
