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

// Load game data
const jsonFile = document.getElementById('gameData').getAttribute('data-src');
loadGameData(jsonFile);

  function displayScene(episode, sceneId) {
            const episodeContent = document.getElementById('episodeContent');
            const scene = episode.scenes.find(s => s.id === sceneId);

            if (scene) {
                let content = `<div class="scene-wrapper">`;

                // Background
                if (scene.background) {
                    content += `<div class="background-image" style="background-image: url(${scene.background});"></div>`;
                }

                content += `<div class="scene-content">`;

                // Title (only if present in the scene)
                if (scene.title) {
                    content += `<div class="scene-title">${scene.title}</div>`;
                }

                // Text
                content += `<div class="scene-text">${scene.text}</div>`;

                // Choices
                if (scene.choices && scene.choices.length > 0) {
                    content += scene.choices.map(choice =>
                        `<button class="choice-button" data-next-scene="${choice.nextScene}">${choice.text}</button>`
                    ).join('');
                } else if (scene.nextScene) {
                    content += `<button class="next-button" data-next-scene="${scene.nextScene}">Next</button>`;
                }

                // Next Episode Button
                if (scene.nextEpisode) {
                    content += `<button class="next-episode-button" data-next-episode="${scene.nextEpisode}">Next Episode</button>`;
                }

                content += `</div></div>`; // Close scene-content and scene-wrapper

                episodeContent.innerHTML = content;
            }
        }

                        // Event delegation for buttons, keeo it global
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

       function loadScene(sceneId) {
    const scene = currentEpisode.scenes.find(s => s.id === sceneId); 
    if (scene) {
        displayScene(currentEpisode, sceneId); 
    } else {
        console.error('Scene not found:', sceneId);
    }
}
