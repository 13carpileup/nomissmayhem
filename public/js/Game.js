import { Player } from './player/Player.js';
import { Projectile } from './structs/Projectile.js';
import { Renderer } from './rendering/Renderer.js';
import { checkCollision, Clone } from './util/utils.js';
import { Rooms, startIndex, checkDoorCollision, preloadRooms } from './structs/Rooms.js';
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

    this.canvas = document.getElementById('gameCanvas');
    this.blurCanvas = document.getElementById('blurCanvas');
    this.moneyElement = document.getElementById('money')
    this.dashElement = document.getElementById('dash');
    this.lastBulletTime = Date.now();
    this.music = new Music();
    this.lastUpdate = Date.now();

    this.player = new Player(CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    this.renderer = new Renderer(this.canvas, this.blurCanvas);
    this.roomPosition = [...startIndex]
    this.Rooms = Rooms.map(row => 
      row.map(room => {
          // reset room properties
          console.log("old enemies:", room.beginEnemies.length);
          room.enemies = [...room.beginEnemies]
          room.travel.up.open = 0, room.travel.up.shotcount = 0;
          room.travel.down.open = 0, room.travel.down.shotcount = 0;
          room.travel.left.open = 0, room.travel.left.shotcount = 0;
          room.travel.right.open = 0, room.travel.right.shotcount = 0;
          room.projectiles = [], room.coins = [], room.health = [], room.keys = [], room.visited = 0
          return room;
      })
  );  

  this.Rooms[this.roomPosition[0]][this.roomPosition[1]].visited = 1; 
  
    
  

    console.log("reinit log: ", this.roomPosition, startIndex);

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

    this.timerElement = document.getElementById('timer');
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.isGameRunning = true;

    this.fixedTimeStep = 1000/60; // 60 fps physics update rate
    this.lastTime = 0;
    this.accumulator = 0;
    this.isGameStarted = false;
    

    preloadRooms(Rooms);
    this.createStartScreen(); 
  }

  createStartScreen() {
    this.startScreen = document.createElement('div');
    this.startScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.style.cssText = `
      padding: 20px 40px;
      font-size: 24px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
      margin: 20px;
    `;

    startButton.addEventListener('mouseover', () => {
      startButton.style.backgroundColor = '#45a049';
    });

    startButton.addEventListener('mouseout', () => {
      startButton.style.backgroundColor = '#4CAF50';
    });

    const title = document.createElement('h1');
    title.textContent = 'No Miss Mayhem';
    title.style.cssText = `
      color: white;
      font-size: 48px;
      margin-bottom: 20px;
    `;

    startButton.addEventListener('click', () => {
      this.startGame();
    });

    this.startScreen.appendChild(title);
    this.startScreen.appendChild(startButton);
    document.body.appendChild(this.startScreen);
}

  startGame() {
    this.isGameStarted = true;
    this.startScreen.remove();
    this.setup();
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
      if (e.key.toLowerCase() in this.keys) {
        this.keys[e.key.toLowerCase()] = true;
        //console.log(e);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key.toLowerCase() in this.keys) {
        this.keys[e.key.toLowerCase()] = false;
      }
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      //console.log(this.mouseX, this.mouseY);
    });

    window.addEventListener('mousedown', () => {
      this.isMouseDown = true;
    });
  
    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
  
    window.addEventListener('mouseleave', () => {
      this.isMouseDown = false;
    });
  

    window.addEventListener('click', (e) => {
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
      
      this.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
        console.log(enemy)
        console.log(enemy.x)
        const enemyProjectile = enemy.update(this.player, Date.now());
        console.log(enemyProjectile)

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
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.padding = '20px';
    overlay.style.borderRadius = '10px';
    overlay.style.textAlign = 'center';
    overlay.style.zIndex = '1000';
    overlay.id = "gameOver";
    
    // Add game over text
    const gameOverText = document.createElement('h1');
    gameOverText.textContent = 'Game Over';
    gameOverText.style.color = 'white';
    overlay.appendChild(gameOverText);
    
    // Add retry button
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Try Again';
    retryButton.style.padding = '10px 20px';
    retryButton.style.marginTop = '20px';
    retryButton.style.cursor = 'pointer';
    retryButton.onclick = () => {
      document.getElementById("gameOver").remove();
      this.init() // reinitalize game state
    };
    overlay.appendChild(retryButton);
    
    document.body.appendChild(overlay);
  }

  gameWin() {
    this.isGameRunning = false;
    
    // Create win overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.padding = '20px';
    overlay.style.borderRadius = '10px';
    overlay.style.textAlign = 'center';
    overlay.style.zIndex = '1000';
    
    // Add win text
    const winText = document.createElement('h1');
    winText.textContent = 'You Won!';
    winText.style.color = 'white';
    overlay.appendChild(winText);
    
    // Add final stats
    const statsText = document.createElement('div');
    statsText.innerHTML = `
        <p style="color: white">Final Time: ${this.timerElement.textContent}</p>
        <p style="color: white">Coins Collected: ${this.player.getMoney()}</p>
    `;
    overlay.appendChild(statsText);
    
    // Add name input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Enter your name';
    nameInput.style.margin = '10px';
    nameInput.style.padding = '5px';
    overlay.appendChild(nameInput);
    
    // Add submit score button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Score';
    submitButton.style.padding = '10px 20px';
    submitButton.style.margin = '10px';
    submitButton.style.cursor = 'pointer';
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
                    submitButton.textContent = 'Score Submitted!';
                    submitButton.disabled = true;
                    nameInput.disabled = true;
                    
                    // Show leaderboard
                    const leaderboardData = await fetch('https://nomissmayhem.shuttleapp.rs/leaderboard').then(res => res.json());
                    leaderboardData.splice(12);
                    const leaderboardDiv = document.createElement('div');
                    leaderboardDiv.innerHTML = `
                        <h2 style="color: white">Top Scores</h2>
                        ${leaderboardData.map((entry, index) => `
                            <p style="color: white">${index + 1}. ${entry.name} - ${entry.time/1000} seconds  </p>
                        `).join('')}
                    `;
                    overlay.appendChild(leaderboardDiv);
                }
            } catch (error) {
                console.error('Error submitting score:', error);
                submitButton.textContent = 'Error Submitting Score';
            }
        } else {
            nameInput.style.border = '2px solid red';
        }
    };
    overlay.appendChild(submitButton);
    
    // Add play again button
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.style.padding = '10px 20px';
    playAgainButton.style.margin = '10px';
    playAgainButton.style.cursor = 'pointer';
    playAgainButton.onclick = () => {
        location.reload();
    };
    overlay.appendChild(playAgainButton);
    
    document.body.appendChild(overlay);
  }
}
