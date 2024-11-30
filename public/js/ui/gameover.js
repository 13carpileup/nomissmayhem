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
    
    // Add retry button
    const retryButton = document.createElement('button');
    retryButton.textContent = 'TRY AGAIN';
    retryButton.style.fontFamily = "'Press Start 2P', monospace";
    retryButton.style.fontSize = '16px';
    retryButton.style.padding = '12px 24px';
    retryButton.style.backgroundColor = '#222';
    retryButton.style.color = '#fff';
    retryButton.style.border = '4px solid #444';
    retryButton.style.cursor = 'pointer';
    retryButton.style.transition = 'all 0.1s';
    
    // Button hover and active states
    retryButton.onmouseover = () => {
        retryButton.style.backgroundColor = '#333';
        retryButton.style.transform = 'scale(1.1)';
    };
    retryButton.onmouseout = () => {
        retryButton.style.backgroundColor = '#222';
        retryButton.style.transform = 'scale(1)';
    };
    retryButton.onmousedown = () => {
        retryButton.style.transform = 'scale(0.95)';
    };
    retryButton.onmouseup = () => {
        retryButton.style.transform = 'scale(1.1)';
    };
    
    retryButton.onclick = () => {
        document.getElementById("gameOver").remove();
        retry(level); // reinitialize game state
    };
    overlay.appendChild(retryButton);
    
    return overlay;
} 