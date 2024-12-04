// userScripts.js

// Function to replace player name and handle color formatting in all scenes of the episode
function replacePlayerNamesInEpisode(episode) {
    const playerName = localStorage.getItem('PlayerName') || 'Traveler';
    episode.scenes.forEach(scene => {
        // Replace player name
        scene.text = scene.text.replace(/{playerName}/g, playerName);      
    });
}

function redEpisode(episode) {
episode.scenes.forEach(scene => {
    scene.text = scene.text.replace(/{red}(.*?)\{\/red}/g, '<span style="color: red;">$1</span>');
    });
}
    
// Pre-Render all JS
function loadEpisode(file) {
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            currentEpisode = data; 
            replacePlayerNamesInEpisode(currentEpisode); // Replace player names and handle color formatting
            redEpisode(currentEpisode); // Pass currentEpisode instead of episode
            currentSceneId = currentEpisode.scenes[0].id; 
            displayScene(currentEpisode, currentSceneId); 
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById('episodeContent').innerText = 'Failed to load episode. Please try again later.';
        });
}


// Load JS each scene
function loadScene(sceneId) {
    const scene = currentEpisode.scenes.find(s => s.id === sceneId);
    if (scene) {
        displayScene(currentEpisode, sceneId);
    }
}
