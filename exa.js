document.addEventListener('DOMContentLoaded', () => {
  const gameDataElement = document.getElementById('gameData');
  const gameData = JSON.parse(gameDataElement.textContent);

  const gameContainer = document.getElementById('game');
  const textPanel = document.getElementById('text-panel');
  const startScreen = document.getElementById('start-screen');
  const startButton = document.getElementById('start-button');
  const loadButton = document.getElementById('load-button');
  const settingsButton = document.getElementById('settings-button');

  let currentScene = null;
  let currentLanguage = 'en'; // Default language

  // Start game when the start button is clicked
  startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    loadScene('scene1'); // Start with the first scene
  });

  // Load a specific scene
  function loadScene(sceneId) {
    const scene = gameData.scenes.find(s => s.id === sceneId);
    if (!scene) {
      console.error(`Scene ${sceneId} not found!`);
      return;
    }
    currentScene = scene;
    renderScene(scene);
  }

  // Render a scene
  function renderScene(scene) {
    // Clear previous scene
    textPanel.innerHTML = '';

    // Set background
    const backgroundUrl = gameData.backgrounds[scene.background];
    gameContainer.style.backgroundImage = `url(${backgroundUrl})`;

    // Render title if it exists
    if (scene.title) {
      const titleElement = document.createElement('h1');
      titleElement.textContent = scene.title;
      textPanel.appendChild(titleElement);
    }

    // Render dialogue
    if (scene.dialogue) {
      scene.dialogue.forEach(dialogue => {
        if (dialogue.name) {
          const character = gameData.characters[dialogue.name];
          const dialogueElement = document.createElement('div');
          dialogueElement.textContent = `${character.name}: ${getLocalizedText(dialogue.textId)}`;
          dialogueElement.style.color = character.color;
          textPanel.appendChild(dialogueElement);
        } else if (dialogue.choices) {
          renderChoices(dialogue.choices);
        }
      });
    }

    // Render choices
    if (scene.choices) {
      renderChoices(scene.choices);
    }

    // Play music if it exists
    if (scene.music) {
      const music = gameData.music[scene.music];
      console.log(`Playing music: ${music}`); // Replace with actual audio playback logic
    }
  }

  // Render choices
  function renderChoices(choices) {
    choices.forEach(choice => {
      const choiceButton = document.createElement('button');
      choiceButton.textContent = getLocalizedText(choice.textId);
      choiceButton.addEventListener('click', () => {
        handleChoice(choice);
      });
      textPanel.appendChild(choiceButton);
    });
  }

  // Handle user choice
  function handleChoice(choice) {
    console.log(`Choice selected: ${getLocalizedText(choice.textId)}`);

    // Update variables if any
    if (choice.variables) {
      choice.variables.forEach(([variable, operation, value]) => {
        if (operation === 'add') {
          gameData.variables[variable] += value;
        } else if (operation === 'set') {
          gameData.variables[variable] = value;
        }
      });
    }

    // Handle action
    if (choice.action) {
      if (choice.action.startsWith('scene')) {
        loadScene(choice.action); // Transition to another scene
      } else if (choice.action === 'return') {
        // Handle return action (e.g., go back to the previous scene)
      }
    }
  }

  // Get localized text
  function getLocalizedText(textId) {
    const localizedText = gameData.localization[currentLanguage][textId];
    if (!localizedText) {
      console.error(`Text ID ${textId} not found for language ${currentLanguage}`);
      return `[MISSING TEXT: ${textId}]`;
    }
    return localizedText.replace(/{playerName}/g, gameData.variables.playerName);
  }

  // Initialize game
  function initializeGame() {
    // Set default variables
    gameData.variables.playerName = prompt('Enter your name:') || 'Traveler';
    startScreen.style.display = 'block'; // Show the start screen
  }

  initializeGame();
});
