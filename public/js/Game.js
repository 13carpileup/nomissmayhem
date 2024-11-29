import { Player } from './player/Player.js';
import { Projectile } from './structs/Projectile.js';
import { Renderer } from './rendering/Renderer.js';
import { checkCollision, Clone } from './util/utils.js';
import { checkDoorCollision, preloadRooms } from './structs/Rooms.js';
import { Rooms, startIndex } from './gameDesign/testLevel.js'
import { Music } from './util/Music.js';
import { Key } from './structs/Key.js';
import { CANVAS, BULLETS_LIMITER, PLAYER } from './constants.js';
import { Coin } from './structs/Coin.js';
import { checkCardCollision } from './structs/Store.js';
import { createMinimap, updateMinimap } from './ui/minimap.js';
import { Health } from './structs/Health.js';
import { Enemy, EnemyFactory } from './structs/Enemy.js';
  
export class Game {
  constructor() {
    this.init();
  }

  init() {
    console.log("Initializing...")
    const gameOver = document.getElementById("gameOver");
    console.log("TRYING TO REMOVE: " + gameOver);
    if (gameOver) {
      gameOver.remove();  
    }

    this.canvas = document.getElementById('gameCanvas');
    this.blurCanvas = document.getElementById('blurCanvas');
    this.moneyElement = document.getElementById('money')
    this.dashElement = document.getElementById('dash');
    this.ui = document.getElementById('noselect');
    this.lastBulletTime = Date.now();
    this.music = new Music();
    this.lastUpdate = Date.now();
    this.moneyElement = document.getElementById('money');
    this.moneyElement.textContent = `COINS: 0`;

    this.player = new Player(CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    this.renderer = new Renderer(this.canvas, this.blurCanvas);
    this.roomPosition = [...startIndex]
    this.Rooms = Rooms.map(row => 
      row.map(room => ({
          ...room,                              
          enemies: room.beginEnemies.map(enemy => 
              EnemyFactory.createEnemy(
                  enemy.type,
                  enemy.x,
                  enemy.y,
                  enemy.id,
                  enemy.hasKey,
                  enemy.healing,
                  enemy.radius,
                  enemy.health
              )
          ),
          travel: {                             
              ...room.travel,
              up: { ...room.travel.up, open: 0, shotcount: 0 },
              down: { ...room.travel.down, open: 0, shotcount: 0 },
              left: { ...room.travel.left, open: 0, shotcount: 0 },
              right: { ...room.travel.right, open: 0, shotcount: 0 }
          },
          projectiles: [],                      
          coins: [],
          keys: [],
          health: [],
          bought: [0,0],
          visited: 0
      }))
    );
    this.Rooms[this.roomPosition[0]][this.roomPosition[1]].visited = 1; 
    //console.log("TEST ROOM: ", this.Rooms[5][2])
  
    
  

    //console.log("reinit log: ", this.roomPosition, startIndex);

    this.hitCount = 0;
    this.isMouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.keys = {
      w: false,
      a: false,
      s: false, 
      d: false,
      shift: false,
    };


    this.isGameRunning = true;

    this.fixedTimeStep = 1000/60; // 60 fps physics update rate
    this.lastTime = 0;
    this.accumulator = 0;
    this.isGameStarted = false;
    
    this.ui.style.opacity = 1;
    preloadRooms(Rooms);
    this.createStartScreen(); 
  }

  startGame() {
    this.isGameStarted = true;
    this.timerElement = document.getElementById('timer');
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.startScreen.remove();
    this.setup();
  }

  createStartScreen() {
    this.startScreen = document.createElement('div');
    this.startScreen.style.cssText = `
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
    subtitle.textContent = 'YOU ARE YOUR OWN ENEMY!';
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

    const startButton = document.createElement('button');
    startButton.textContent = 'START GAME';
    startButton.style.cssText = `
        padding: 16px 32px;
        font-size: 20px;
        font-family: 'Press Start 2P', monospace;
        background-color: #222;
        color: #fff;
        border: 4px solid #444;
        cursor: pointer;
        transition: all 0.1s;
        position: relative;
        text-shadow: 2px 2px #000;
    `;

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

    // Add button interactions
    startButton.onmouseover = () => {
        startButton.style.backgroundColor = '#333';
        startButton.style.transform = 'scale(1.1)';
    };
    startButton.onmouseout = () => {
        startButton.style.backgroundColor = '#222';
        startButton.style.transform = 'scale(1)';
    };
    startButton.onmousedown = () => {
        startButton.style.transform = 'scale(0.95)';
    };
    startButton.onmouseup = () => {
        startButton.style.transform = 'scale(1.1)';
    };
    startButton.onclick = () => {
        startButton.style.transform = 'scale(0.95)';
        setTimeout(() => this.startGame(), 100);
    };

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
    menuContainer.appendChild(startButton);
    this.startScreen.appendChild(scanlines);
    this.startScreen.appendChild(titleContainer);
    this.startScreen.appendChild(menuContainer);
    corners.forEach(corner => this.startScreen.appendChild(corner));
    this.startScreen.appendChild(topBorder);
    this.startScreen.appendChild(bottomBorder);
    document.body.appendChild(this.startScreen);

    // Add fade-in animation
    this.startScreen.style.opacity = '0';
    requestAnimationFrame(() => {
        this.startScreen.style.transition = 'opacity 1s';
        this.startScreen.style.opacity = '1';
    });
}

  setup() {
    this.resizeCanvas();
    this.setupEventListeners();

    this.music.init();
    this.setupMusicControls();
    
    
    if (!this.isGameStarted) return;

    this.gameLoop();
    createMinimap(this.Rooms, this.roomPosition);
  }

  setupMusicControls() {
    // Optional: Add music controls with 'M' key to mute/unmute
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'm') {
        if (this.music.currentAudio.paused) {
          this.music.play();
        } else {
          this.music.stop();
        }
      }
    });

    // Start playing music on first click (many browsers require user interaction)
    window.addEventListener(
      'click',
      () => {
        this.music.play();
      },
      { once: true }
    );
  }

  resizeCanvas() {
    this.canvas.width = CANVAS.WIDTH;
    this.canvas.height = CANVAS.HEIGHT;
    this.blurCanvas.width = CANVAS.WIDTH;
    this.blurCanvas.height = CANVAS.HEIGHT;

    [this.canvas, this.blurCanvas].forEach((canvas) => {
      canvas.style.position = 'absolute';
      canvas.style.left = '50%';
      canvas.style.top = '50%';
      canvas.style.transform = 'translate(-50%, -50%)';
      //canvas.style.backgroundImage = "url('/assets/rooms/room1.png')";
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resizeCanvas());

    window.addEventListener('keydown', (e) => {
      if (!this.isGameStarted) return;
      if (e.key.toLowerCase() in this.keys) {
        this.keys[e.key.toLowerCase()] = true;
        //console.log(e);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (!this.isGameStarted) return;
      if (e.key.toLowerCase() in this.keys) {
        this.keys[e.key.toLowerCase()] = false;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isGameStarted) return;
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      //console.log(this.mouseX, this.mouseY);
    });

    window.addEventListener('mousedown', () => {
      if (!this.isGameStarted) return;
      this.isMouseDown = true;
    });
  
    window.addEventListener('mouseup', () => {
      if (!this.isGameStarted) return;
      this.isMouseDown = false;
    });
  
    window.addEventListener('mouseleave', () => {
      if (!this.isGameStarted) return;
      this.isMouseDown = false;
    });
  

    window.addEventListener('click', (e) => {
      if (!this.isGameStarted) return;
      const currentTime = Date.now();
      //console.log(currentTime);
      if ((currentTime - this.lastBulletTime) >= this.player.shootCooldown) {
        // Check if enough time has passed since the last bullet was fired
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;

        const angle = Math.atan2(canvasY - this.player.y, canvasX - this.player.x);
        this.getCurrentRoom().projectiles.push(new Projectile(this.player.x, this.player.y, angle, 35, 5));

        this.lastBulletTime = currentTime; // Update the last bullet firing time
      }
    });
  }

  handleCollision() {
    if (!this.player.isInvulnerable) {
      this.player.health -= PLAYER.DAMAGE_PER_HIT;
      this.player.healthBar.update(this.player.health);

      // Check if player has died
      if (this.player.health <= 0) {
        this.gameOver();
        return;
      }

      this.player.isInvulnerable = true;
      setTimeout(() => {
        this.player.isInvulnerable = false;
      }, this.player.invulnerableTime);
    }
  }

  checkDoor(door) {
    if ((door.type=='door') && door.open==1) {
      return true;
    }
    //console.log(this.player.keys)

    if ((door.type=='key') && this.player.keys.includes("key1")) {
      return true;
    }

    if (door.type=='door' && door.shotcount >= door.openreq) {
      //console.log('UNLOCK')

      return true;
    }

    return false;
  }

  checkRooms() {
    //console.log(this.player.x, this.player.y);
    const midpoint = [this.canvas.width/2, this.canvas.height/2];
    //up
    if (this.player.y < 25 && this.player.x < 350 && this.player.x > 250 ) {
      //console.log(this.roomPosition[0]);
      let status = this.getCurrentRoom().travel.up
      let bool = this.checkDoor(status);

      status.open = bool;
      
      if (bool) {
        this.roomPosition[0] -= 1;
        this.player.y = 560
        this.player.x = 300
        this.getCurrentRoom().visited = 1;
        createMinimap(this.Rooms, this.roomPosition);
      }
    }
    //down
    if (this.player.y > 575 && this.player.x < 350 && this.player.x > 250 ) {
      //console.log(this.roomPosition[0]);
      let status = this.getCurrentRoom().travel.down
      let bool = this.checkDoor(status);

      status.open = bool;
      
      if (bool) {
        this.roomPosition[0] += 1;
        this.player.y = 40
        this.player.x = 300
        this.getCurrentRoom().visited = 1;
        createMinimap(this.Rooms, this.roomPosition);
      }
    }
    //right
    if (this.player.x > 575 && this.player.y < 350 && this.player.y > 250 ) {
      //console.log(this.roomPosition[0]);
      let status = this.getCurrentRoom().travel.right
      let bool = this.checkDoor(status);
      //console.log(status)
      status.open = bool;
      
      if (bool) {
        this.roomPosition[1] += 1;
        this.player.x = 40
        this.player.y = 300
        this.getCurrentRoom().visited = 1;
        createMinimap(this.Rooms, this.roomPosition);
      }
    }
    //left
    if (this.player.x < 25 && this.player.y < 350 && this.player.y > 250 ) {
      //console.log(this.roomPosition[0]);
      let status = this.getCurrentRoom().travel.left
      let bool = this.checkDoor(status);

      status.open = bool;
      
      if (bool) {
        this.roomPosition[1] -= 1;
        this.player.x = 560
        this.player.y = 300
        this.getCurrentRoom().visited = 1;
        createMinimap(this.Rooms, this.roomPosition);
      }
    }
    
    this.canvas.width
    
    if (this.getCurrentRoom().type === "win") {
        this.gameWin();
        return;
    }
  }

  updateTimer() {
    if (this.isGameRunning) {
      this.elapsedTime = Date.now() - this.startTime;
      const seconds = Math.floor(this.elapsedTime / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      this.timerElement.textContent = `TIME: ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }

  update() {
    this.player.update(this.keys, this.mouseX, this.mouseY, this.dashElement);

    // mouse hold down
    if (this.isMouseDown) {
      const currentTime = Date.now();
      if ((currentTime - this.lastBulletTime) >= this.player.shootCooldown) {
        const rect = this.canvas.getBoundingClientRect();
        const angle = Math.atan2(
          this.mouseY - this.player.y,
          this.mouseX - this.player.x
        );
        
        this.getCurrentRoom().projectiles.push(
          new Projectile(this.player.x, this.player.y, angle, 35, 5)
        );
  
        this.lastBulletTime = currentTime;
      }
    }

    // Update enemies
    // console.log(this.getCurrentRoom().beginEnemies)

    this.getCurrentRoom().enemies.forEach((enemy, index) => {
      if (enemy.isActive) {
        // console.log(enemy)
        // console.log(enemy.x)
        const enemyProjectile = enemy.update(this.player, Date.now());
        // console.log(enemyProjectile)

        // If enemy fired a projectile, add it to projectiles array
        if (enemyProjectile) {
          this.getCurrentRoom().projectiles.push(enemyProjectile);
        }

        // Check collision with player
        if (enemy.checkCollision(this.player)) {
          this.handleCollision();
        }

        // Check collision with player's projectiles
        this.getCurrentRoom().projectiles.forEach((proj, projIndex) => {
          if (!proj.isEnemyProjectile && checkCollision(enemy, proj)) {
            enemy.takeDamage(20);
            this.getCurrentRoom().projectiles.splice(projIndex, 1);
            
            // Drop coin when enemy dies
            if (!enemy.isActive) {
              console.log("enemy", enemy);
              const coin = new Coin(enemy.x, enemy.y, enemy.coinDrop.value, enemy.coinDrop.type);
              this.getCurrentRoom().coins.push(coin);
              if (enemy.hasKey) {
                console.log("dropping key");
                const key = new Key(enemy.id, enemy.x, enemy.y);
                this.getCurrentRoom().keys.push(key);
              }
              if (enemy.healing) {
                console.log("dropping health");
                const healing = new Health(enemy.id, enemy.x, enemy.y);
                this.getCurrentRoom().health.push(healing)
              }
              console.log('Created coin:', coin);
              console.log('Current room coins:', this.getCurrentRoom().coins);
            }
          }
        });
      } else {
        this.getCurrentRoom().enemies.splice(index, 1);
      }
    });

    // Update projectiles
    for (let i = this.getCurrentRoom().projectiles.length - 1; i >= 0; i--) {
      const proj = this.getCurrentRoom().projectiles[i];
      const shouldRemove = proj.update();

      if (shouldRemove) {
        this.getCurrentRoom().projectiles.splice(i, 1);
        continue;
      }

      if (checkCollision(this.player, proj)) {
        this.handleCollision();
        this.getCurrentRoom().projectiles.splice(i, 1);
      }

      let res = checkDoorCollision(proj);

      let copy = this.Rooms[this.roomPosition[0]][this.roomPosition[1]].travel

      switch (res) {
        case 'up':
          if (copy.up.open==0&&copy.up.type=='door'){
            this.getCurrentRoom().projectiles.splice(i, 1);
            this.Rooms[this.roomPosition[0]][this.roomPosition[1]].travel.up.shotcount += 1;
          }
          break;
        case 'down':
          if (copy.down.open==0&&copy.down.type=='door'){
            this.getCurrentRoom().projectiles.splice(i, 1);
            this.Rooms[this.roomPosition[0]][this.roomPosition[1]].travel.down.shotcount += 1;
          }
          break;
        case 'left':
          if (copy.left.open==0&&copy.left.type=='door'){
            this.getCurrentRoom().projectiles.splice(i, 1);
            this.Rooms[this.roomPosition[0]][this.roomPosition[1]].travel.left.shotcount += 1;
          }
          break;
        case 'right':
          if (copy.right.open==0&&copy.right.type=='door'){
            this.getCurrentRoom().projectiles.splice(i, 1);
            this.Rooms[this.roomPosition[0]][this.roomPosition[1]].travel.right.shotcount += 1;
          }
          break;
      }
      //console.log('checking')
      res = checkCardCollision(this.getCurrentRoom(), proj);

      if (res) {
        if (res[1][1] <= this.player.getMoney()) {
          this.player.addPowerup(res[1][0]);
          this.player.addMoney(-1*res[1][1]);

          this.Rooms[this.roomPosition[0]][this.roomPosition[1]].bought[res[0]] = 1;
          this.getCurrentRoom().projectiles.splice(i, 1);
        }

        
      }
    }

    // Check coin collection
    this.getCurrentRoom().coins = this.getCurrentRoom().coins.filter(coin => {
      const distance = Math.sqrt(
        Math.pow(this.player.x - coin.x, 2) + 
        Math.pow(this.player.y - coin.y, 2)
      );
      
      if (distance < this.player.radius + coin.radius) {
        this.player.addMoney(coin.value);
        return false;
      }
      return true;
    });

    // Check key collection
    this.getCurrentRoom().keys = this.getCurrentRoom().keys.filter(key => {
      const distance = Math.sqrt(
        Math.pow(this.player.x - key.x, 2) + 
        Math.pow(this.player.y - key.y, 2)
      );
      
      if (distance < this.player.radius + key.radius) {
        this.player.addKey(key.id);
        return false;
      }
      return true;
    });

    this.getCurrentRoom().health = this.getCurrentRoom().health.filter(healing => {
      const distance = Math.sqrt(
        Math.pow(this.player.x - healing.x, 2) + 
        Math.pow(this.player.y - healing.y, 2)
      );
      
      if (distance < this.player.radius + healing.radius) {
        //console.log('pickup')
        this.player.health = PLAYER.MAX_HEALTH;
        this.player.healthBar.update(this.player.health);
        return false;
      }
      return true;
    });

    this.checkRooms();
    this.updateTimer();
  } 

  gameLoop(currentTime = 0) {
    if (!this.isGameRunning) return;
  
    // Convert time to seconds
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Accumulate time since last frame
    this.accumulator += deltaTime;
    
    // Update physics in fixed time steps
    while (this.accumulator >= this.fixedTimeStep) {
      this.update(this.fixedTimeStep);
      this.accumulator -= this.fixedTimeStep;
    }
    
    // Render at screen refresh rate
    this.renderer.render(
      this.player,
      this.getCurrentRoom(),
      this.mouseX,
      this.mouseY
    );

    //console.log(currentTime);
    
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  getCurrentRoom() {
    return this.Rooms[this.roomPosition[0]][this.roomPosition[1]];
  }

  pauseTimer() {
    this.isGameRunning = false;
  }

  resumeTimer() {
    this.isGameRunning = true;
    this.startTime = Date.now() - this.elapsedTime;
  }

  resetTimer() {
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.isGameRunning = true;
  }

  gameOver() {
    this.isGameRunning = false;
    
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
        this.init(); // reinitialize game state
    };
    overlay.appendChild(retryButton);
    
    // Add @font-face rule for Press Start 2P font if not already in your CSS
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    document.body.appendChild(overlay);
} 

gameWin() {
  this.isGameRunning = false;
  
  // Create win overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #111;
      border: 4px solid #444;
      padding: 32px;
      text-align: center;
      z-index: 1000;
      min-width: 320px;
      box-shadow: 0 0 0 4px #111, 0 0 0 8px #444;
      image-rendering: pixelated;
  `;

  // Add CRT scanline effect
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
  overlay.appendChild(scanlines);
  
  // Add victory text
  const winText = document.createElement('div');
  winText.textContent = 'VICTORY!';
  winText.style.cssText = `
      color: #44ff44;
      font-family: 'Press Start 2P', monospace;
      font-size: 32px;
      margin-bottom: 24px;
      text-shadow: 4px 4px #006600;
      animation: pulse 2s ease-in-out infinite;
  `;
  
  // Add stats
  const statsText = document.createElement('div');
  statsText.style.cssText = `
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      color: #fff;
      margin-bottom: 24px;
      line-height: 2;
  `;
  statsText.innerHTML = `
      TIME: ${this.timerElement.textContent}<br>
      COINS: ${this.player.getMoney()}
  `;
  
  // Add name input
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'ENTER NAME';
  nameInput.style.cssText = `
      background: #222;
      border: 4px solid #444;
      color: #fff;
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      margin: 16px 0;
      padding: 8px;
      text-align: center;
      width: 80%;
  `;
  
  // Add submit button
  const submitButton = document.createElement('button');
  submitButton.textContent = 'SUBMIT SCORE';
  submitButton.style.cssText = `
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      padding: 12px 24px;
      margin: 8px;
      background-color: #222;
      color: #fff;
      border: 4px solid #444;
      cursor: pointer;
      transition: all 0.1s;
  `;

  let time = this.elapsedTime;
  submitButton.onclick = async () => {
      if (nameInput.value.trim()) {
          try {
              const response = await fetch('https://nomissmayhem.shuttleapp.rs/score', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      name: nameInput.value.trim(),
                      time: time,
                  })
              });
              
              if (response.ok) {
                  submitButton.textContent = 'SCORE SAVED!';
                  submitButton.disabled = true;
                  nameInput.disabled = true;
                  
                  // Show leaderboard
                  const leaderboardData = await fetch('https://nomissmayhem.shuttleapp.rs/leaderboard').then(res => res.json());
                  leaderboardData.splice(12);
                  const leaderboardDiv = document.createElement('div');
                  leaderboardDiv.style.cssText = `
                      margin-top: 24px;
                      font-family: 'Press Start 2P', monospace;
                      font-size: 12px;
                      color: #fff;
                  `;
                  leaderboardDiv.innerHTML = `
                      <div style="color: #44ff44; margin-bottom: 16px;">TOP SCORES</div>
                      ${leaderboardData.map((entry, index) => `
                          <div style="margin: 8px 0; ${entry.name === nameInput.value.trim() ? 'color: #44ff44;' : ''}">
                              ${(index + 1).toString().padStart(2, '0')}. ${entry.name} - ${(entry.time/1000).toFixed(2)}s
                          </div>
                      `).join('')}
                  `;
                  overlay.appendChild(leaderboardDiv);
              }
          } catch (error) {
              console.error('Error submitting score:', error);
              submitButton.textContent = 'ERROR!';
          }
      } else {
          nameInput.style.border = '4px solid #ff4444';
      }
  };
  
  // Add play again button
  const playAgainButton = document.createElement('button');
  playAgainButton.textContent = 'PLAY AGAIN';
  playAgainButton.style.cssText = `
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      padding: 12px 24px;
      margin: 8px;
      background-color: #222;
      color: #fff;
      border: 4px solid #444;
      cursor: pointer;
      transition: all 0.1s;
  `;

  // Add button hover effects
  [submitButton, playAgainButton].forEach(button => {
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
  });

  playAgainButton.onclick = () => {
      location.reload();
  };
  
  // Add animations
  const style = document.createElement('style');
  style.textContent = `
      @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
      }
  `;
  document.head.appendChild(style);

  // Add font
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);
  
  // Assemble overlay
  overlay.appendChild(winText);
  overlay.appendChild(statsText);
  overlay.appendChild(nameInput);
  overlay.appendChild(submitButton);
  overlay.appendChild(playAgainButton);
  
  // Add fade-in animation
  overlay.style.opacity = '0';
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 0.5s';
      overlay.style.opacity = '1';
  });
}   
}
