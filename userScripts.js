const playerName = localStorage.getItem('PlayerName') || 'Traveler';
            currentEpisode.scenes.forEach(scene => {
                scene.text = scene.text.replace(/{playerName}/g, playerName);
            });
