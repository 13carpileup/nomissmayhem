import { Player } from './player/Player.js';
import { Projectile } from './structs/Projectile.js';
import { Renderer } from './rendering/Renderer.js';
import { checkCollision, Clone } from './util/utils.js';
import { checkDoorCollision, preloadRooms } from './structs/Rooms.js';
import { Music } from './util/Music.js';
import { Key } from './structs/Key.js';
import { CANVAS, BULLETS_LIMITER, PLAYER, PROJECTILE } from './constants.js';
import { Coin } from './structs/Coin.js';
import { checkCardCollision } from './structs/Store.js';
import { createMinimap, updateMinimap } from './ui/minimap.js';
import { Health } from './structs/Health.js';
import { Enemy, EnemyFactory } from './structs/Enemy.js';
import { allRooms } from './levels.js';
import { createStartScreen } from './ui/startscreen.js';
import { gameOver } from './ui/gameover.js';  
import { Leaderboard } from './ui/leaderboard.js';

export class Game {
  constructor() {
    this.currentLevel = 0;
    this.leaderboard = new Leaderboard(0);

    this.init();
  }

  init() {
    console.log("Initializing...")
    // Remove game over and win overlays
    if (this.gameOverOverlay) {
      this.gameOverOverlay.remove();  
    }
    if (this.winOverlay) {
      this.winOverlay.remove();
      this.winOverlay = null; // Prevent lingering references
    }

    this.canvas = document.getElementById('gameCanvas');
    this.blurCanvas = document.getElementById('blurCanvas');
    this.moneyElement = document.getElementById('money')
    this.dashElement = document.getElementById('dash');
    this.ui = document.getElementById('noselect');
    this.lastBulletTime = Date.now();
    this.music = new Music();
    this.lastUpdate = Date.now();


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

    allRooms.forEach((room) => {
      preloadRooms(room[0]);
    })
    
    this.createStartScreen(); 
  }

  startGame(level) {
    if (this.gameOverOverlay) {
      this.gameOverOverlay.remove();  
    }
    if (this.winOverlay) {
      this.winOverlay.remove();
    }

    this.leaderboard.updateLevel(level);
    this.moneyElement = document.getElementById('money');
    this.moneyElement.textContent = `COINS: 0`;
    this.lastTime = 0;
    this.isGameRunning = true;

    this.player = new Player(CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    this.renderer = new Renderer(this.canvas, this.blurCanvas);
    this.currentLevel = level;  
    this.roomPosition = [...allRooms[this.currentLevel][1]]
    this.Rooms = allRooms[this.currentLevel][0].map(row => 
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
    
    this.isGameStarted = true;
    this.timerElement = document.getElementById('timer');
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.startScreen.remove();
    this.setup();
  }

  createStartScreen() {
    const startScreen = createStartScreen(allRooms, this.startGame.bind(this));
    this.startScreen = startScreen;
    document.body.appendChild(startScreen);
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
        this.isGameRunning = false;
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
    if (door.open==1 && (door.type=='door' || door.type=='key')) {
      return true;
    }
    //console.log(this.player.keys)

    if ((door.type=='key') && this.player.keys.includes("key1")) {
      this.player.keys.pop();
      door.open = 1;
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

        this.getCurrentRoom().travel.down.open = 1;
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

        this.getCurrentRoom().travel.up.open = 1;
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

        this.getCurrentRoom().travel.left.open = 1;
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

        this.getCurrentRoom().travel.right.open = 1;
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
          if (!proj.isEnemyProjectile && enemy.type == 'shielded') {
            let res = enemy.checkBulletCollision(proj);
            
            enemy.radius += 5;
            // REFLECT OFF CIRCULAR ENEMY
            if (checkCollision(enemy, proj) && res) {
                // Calculate angle between projectile and enemy center
                const collisionAngle = Math.atan2(
                    proj.y - enemy.y,
                    proj.x - enemy.x
                );
                
                // Calculate reflection angle based on shield angle
                const reflectionAngle = 2 * enemy.shieldAngle - collisionAngle;
                
                // Update projectile velocity
                proj.dx = PROJECTILE.SPEED * Math.cos(reflectionAngle);
                proj.dy = PROJECTILE.SPEED * Math.sin(reflectionAngle);
                
                // Move projectile slightly away from enemy to prevent multiple collisions
                proj.x = enemy.x + (enemy.radius + proj.radius + 1) * Math.cos(collisionAngle);
                proj.y = enemy.y + (enemy.radius + proj.radius + 1) * Math.sin(collisionAngle);
                
                // Increment bounce counter
                proj.bounces++;
            }

            enemy.radius -= 5;

            //ENEMY TAKE DAMAGE
            if (checkCollision(enemy, proj)) {
                enemy.takeDamage(20);
                this.getCurrentRoom().projectiles.splice(projIndex, 1);
            }
        }

          else if (!proj.isEnemyProjectile && checkCollision(enemy, proj)) {
            enemy.takeDamage(20);
            this.getCurrentRoom().projectiles.splice(projIndex, 1);
          }

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
    this.gameOverOverlay = gameOver(this.currentLevel, this.startGame.bind(this), this.init.bind(this));
    document.body.appendChild(this.gameOverOverlay);
    // Create game over overlay
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
                      level: this.currentLevel.toString()
                  })
              });
              
              if (response.ok && !submitButton.disabled) {
                  submitButton.textContent = 'SCORE SAVED!';
                  submitButton.disabled = true;
                  nameInput.disabled = true;
                  
                  // Show leaderboard
                  let leaderboardData = await fetch('https://nomissmayhem.shuttleapp.rs/leaderboard').then(res => res.json());
                  leaderboardData = leaderboardData[this.currentLevel];
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

// Add play next button
const playNextButton = document.createElement('button');
playNextButton.textContent = 'PLAY NEXT';
playNextButton.style.cssText = `
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
  [submitButton, playAgainButton, playNextButton].forEach(button => {
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
    this.startGame(this.currentLevel)
  };

  playNextButton.onclick = () => {
    this.currentLevel += 1;
    this.startGame(this.currentLevel);
  }
  
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
  if (this.currentLevel != allRooms.length) {
    overlay.appendChild(playNextButton);
  }
  
  // Add fade-in animation
  overlay.style.opacity = '0';
  document.body.appendChild(overlay);

  this.winOverlay = overlay; 

  requestAnimationFrame(() => {
    overlay.style.transition = 'opacity 0.5s';
    overlay.style.opacity = '1';
  });
}   
}
