export function gameOver(level, retry, levelSelect) {    
    // Create game over overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.backgroundColor = '#111';
    overlay.style.border = '4px solid #444';
    overlay.style.padding = '32px';
    overlay.style.imageRendering = 'pixelated';
    overlay.style.textAlign = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.minWidth = '280px';
    overlay.style.boxShadow = '0 0 0 4px #111, 0 0 0 8px #444';
        overlay.id = "gameOver";
    
    // Add game over text
    const gameOverText = document.createElement('div');
    gameOverText.textContent = 'GAME OVER';
    gameOverText.style.color = '#ff4444';
    gameOverText.style.fontFamily = "'Press Start 2P', monospace";
    gameOverText.style.fontSize = '32px';
    gameOverText.style.textShadow = '4px 4px #660000';
    gameOverText.style.marginBottom = '24px';
    overlay.appendChild(gameOverText);

    // Add score display (if you have scoring)
    const scoreText = document.createElement('div');
    scoreText.style.color = '#fff';
    scoreText.style.fontFamily = "'Press Start 2P', monospace";
    scoreText.style.fontSize = '16px';
    scoreText.style.marginBottom = '32px';
    overlay.appendChild(scoreText);
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '16px';
    
    // Add retry button
    const retryButton = createButton('TRY AGAIN');
    retryButton.onclick = () => {
        document.getElementById("gameOver").remove();
        retry(level); // reinitialize game state
    };
    buttonContainer.appendChild(retryButton);
    
    // Add level select button
    const levelSelectButton = createButton('LEVEL SELECT');
    levelSelectButton.onclick = () => {
        document.getElementById("gameOver").remove();
        levelSelect(); // go back to level selection
    };
    buttonContainer.appendChild(levelSelectButton);
    
    overlay.appendChild(buttonContainer);
    
    return overlay;
}

// Helper function to create buttons with consistent styling
function createButton(text) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.fontFamily = "'Press Start 2P', monospace";
    button.style.fontSize = '16px';
    button.style.padding = '12px 24px';
    button.style.backgroundColor = '#222';
    button.style.color = '#fff';
    button.style.border = '4px solid #444';
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.1s';
    button.style.block = "block";
    
    // Button hover and active states
    button.onmouseover = () => {
        button.style.backgroundColor = '#333';
        button.style.transform = 'scale(1.1)';
    };
    button.onmouseout = () => {
        button.style.backgroundColor = '#222';
        button.style.transform = 'scale(1)';
    };
    button.onmousedown = () => {
        button.style.transform = 'scale(0.95)';
    };
    button.onmouseup = () => {
        button.style.transform = 'scale(1.1)';
    };
    
    return button;
}