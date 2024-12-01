function replacePlayerName(scene) {
    const playerName = localStorage.getItem('PlayerName') || 'Traveler';
    scene.text = scene.text.replace(/{playerName}/g, playerName);
}
