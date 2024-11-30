export function createStartScreen(allRooms, onStartGame) {
    const startScreen = document.createElement('div');
    startScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #111;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      image-rendering: pixelated;
      overflow: hidden;
    `;
  
    // Create CRT scanline effect
    const scanlines = document.createElement('div');
    scanlines.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
          transparent 50%,
          rgba(0, 0, 0, 0.1) 50%
      );
      background-size: 100% 4px;
      pointer-events: none;
      z-index: 1001;
    `;
  
    // Create glowing title container
    const titleContainer = document.createElement('div');
    titleContainer.style.cssText = `
      position: relative;
      margin-bottom: 48px;
      animation: float 4s ease-in-out infinite;
    `;
  
    const title = document.createElement('h1');
    title.textContent = 'NO MISS MAYHEM';
    title.style.cssText = `
      color: #ff4444;
      font-family: 'Press Start 2P', monospace;
      font-size: 48px;
      text-align: center;
      text-shadow: 
          0 0 10px #ff0000,
          4px 4px 0 #660000;
      letter-spacing: 2px;
      animation: pulse 2s ease-in-out infinite;
    `;
  
    const subtitle = document.createElement('div');
    subtitle.textContent = 'YOU ARE YOUR OWN ENEMY';
    subtitle.style.cssText = `
      color: #aaa;
      font-family: 'Press Start 2P', monospace;
      font-size: 16px;
      text-align: center;
      margin-top: 16px;
      letter-spacing: 4px;
    `;
  
    // Create menu container
    const menuContainer = document.createElement('div');
    menuContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      background: #000;
      padding: 32px;
      border: 4px solid #444;
      box-shadow: 0 0 0 4px #111, 0 0 0 8px #444;
    `;
  
    // Create level selection buttons
    const levelButtonsContainer = document.createElement('div');
    levelButtonsContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;
  
    const createLevelButton = (text, value) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.value = value;
      button.style.cssText = `
          padding: 12px 24px;
          font-size: 16px;
          font-family: 'Press Start 2P', monospace;
          background-color: #222;
          color: #fff;
          border: 4px solid #444;
          cursor: pointer;
          transition: all 0.1s;
          text-shadow: 2px 2px #000;
          width: 100%;
      `;
      button.onmouseover = () => {
          button.style.backgroundColor = '#333';
          button.style.transform = 'scale(1.05)';
      };
      button.onmouseout = () => {
          button.style.backgroundColor = '#222';
          button.style.transform = 'scale(1)';
      };
      button.onmousedown = () => {
          button.style.transform = 'scale(0.95)';
      };
      button.onmouseup = () => {
          button.style.transform = 'scale(1.05)';
      };
      button.onclick = () => {
          onStartGame(value);
      };
      return button;
    };
  
    allRooms.forEach((room, index) => {
      const levelButton = createLevelButton(room[2], index);
      levelButtonsContainer.appendChild(levelButton);
    });
  
    // Create decorative pixel art borders
    const createPixelBorder = () => {
      const border = document.createElement('div');
      border.style.cssText = `
          position: absolute;
          width: 100%;
          height: 16px;
          background-color: #222;
          border-top: 4px solid #444;
          border-bottom: 4px solid #444;
      `;
      return border;
    };
  
    const topBorder = createPixelBorder();
    topBorder.style.top = '0';
    const bottomBorder = createPixelBorder();
    bottomBorder.style.bottom = '0';
  
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
      }
      @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
  
    // Add decorative pixel corners
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(position => {
      const corner = document.createElement('div');
      corner.style.cssText = `
          position: absolute;
          width: 32px;
          height: 32px;
          border: 4px solid #444;
          ${position.includes('top') ? 'top: 16px' : 'bottom: 16px'};
          ${position.includes('left') ? 'left: 16px' : 'right: 16px'};
      `;
      return corner;
    });
  
    // Add font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  
    // Assemble the screen
    titleContainer.appendChild(title);
    titleContainer.appendChild(subtitle);
    menuContainer.appendChild(levelButtonsContainer);
    startScreen.appendChild(scanlines);
    startScreen.appendChild(titleContainer);
    startScreen.appendChild(menuContainer);
    corners.forEach(corner => startScreen.appendChild(corner));
    startScreen.appendChild(topBorder);
    startScreen.appendChild(bottomBorder);
  
    // Add fade-in animation
    startScreen.style.opacity = '0';
    requestAnimationFrame(() => {
      startScreen.style.transition = 'opacity 1s';
      startScreen.style.opacity = '1';
    });
  
    return startScreen;
  }