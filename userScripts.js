function turnTextRed() {
            document.body.style.color = 'red'; // Change the text color of the body
        }

        // Call the function when the page loads
        window.onload = turnTextRed;

const playerName = localStorage.getItem('PlayerName') || 'Traveler';
            currentEpisode.scenes.forEach(scene => {
                scene.text = scene.text.replace(/{playerName}/g, playerName);
            });
