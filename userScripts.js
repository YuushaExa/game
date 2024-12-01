// userScripts.js

// Assuming this code is executed after the main script has loaded
document.getElementById('episodeContent').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('choice-button')) {
        loadScene(target.getAttribute('data-next-scene'));
    } else if (target.classList.contains('next-button')) {
        loadScene(target.getAttribute('data-next-scene'));
    } else if (target.classList.contains('next-episode-button')) {
        const nextEpisodeIndex = target.getAttribute('data-next-episode');
        loadEpisode(nextEpisodeIndex);
    }
});

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
