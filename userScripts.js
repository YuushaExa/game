// Function to replace player name in the scene text
function replacePlayerName(scene) {
    const playerName = localStorage.getItem('PlayerName') || 'Traveler';
    scene.text = scene.text.replace(/{playerName}/g, playerName);
}

// Modify the loadScene function to include player name replacement
function loadScene(sceneId) {
    const scene = currentEpisode.scenes.find(s => s.id === sceneId);
    if (scene) {
        replacePlayerName(scene); // Replace player name before displaying
        displayScene(currentEpisode, sceneId);
    }
}
