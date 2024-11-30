// Player.js
import { CANVAS, PLAYER } from '../constants.js';
import { PixelHealthBar } from '../util/updateHealth.js';


export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = PLAYER.RADIUS;
    this.speed = PLAYER.SPEED;
    this.maxSpeed = PLAYER.MAX_SPEED;
    this.friction = PLAYER.FRICTION;
    this.dx = 0;
    this.dy = 0;
    this.double = 0;
    this.isInvulnerable = false;
    this.invulnerableTime = PLAYER.INVULNERABLE_TIME;
    this.canDash = true;
    this.isDashing = false;
    this.shootCooldown = PLAYER.SHOOT_COOLDOWN;
    this.dashCooldown = PLAYER.DASH_COOLDOWN;
    this.dashDistance = PLAYER.DASH_DISTANCE;
    this.dashDuration = PLAYER.DASH_DURATION;
    this.trailPositions = [];
    this.money = 0;
    this.keys = [];
    this.health = PLAYER.MAX_HEALTH;
    this.double = 0;
    this.spread = 0;

    this.healthBar = new PixelHealthBar(PLAYER.MAX_HEALTH, {
      // Optional custom settings
      width: 200,
      height: 20,
      x: 20,
      y: 20,
      healthyColor: '#33ff33',
      warningColor: '#ffff33',
      dangerColor: '#ff3333'
    });
  }

  handleDash(mouseX, mouseY, dashElement) {
    if (this.canDash) {
      const angle = Math.atan2(mouseY - this.y, mouseX - this.x);
      const newX = this.x + Math.cos(angle) * this.dashDistance;
      const newY = this.y + Math.sin(angle) * this.dashDistance;

      // this.x = Math.max(this.radius, Math.min(CANVAS.WIDTH - this.radius, newX));
      //this.y = Math.max(this.radius, Math.min(CANVAS.HEIGHT - this.radius, newY));

      this.canDash = false;
      this.isDashing = true;
      dashElement.textContent = "DASN COOLING...";

      setTimeout(() => {
        this.isDashing = false;
      }, this.dashDuration);

      setTimeout(() => {
        this.canDash = true;
        dashElement.textContent = "DASH READY!";
      }, this.dashCooldown);
    }
  }

  update(keys, mouseX, mouseY, dashElement) {
    this.trailPositions.unshift({ x: this.x, y: this.y });
    if (this.trailPositions.length > 5) {
      this.trailPositions.pop();
    }

    let moveX = 0;
    let moveY = 0;

    if (keys.w || keys.up) moveY -= 1;
    if (keys.s || keys.down) moveY += 1;
    if (keys.a || keys.left) moveX -= 1;
    if (keys.d || keys.right) moveX += 1;
    if (moveX !== 0 && moveY !== 0) {
      const length = Math.sqrt(moveX * moveX + moveY * moveY);
      moveX /= length;
      moveY /= length;
    }

    this.dx += moveX * this.speed;
    this.dy += moveY * this.speed;

    if (keys.shift) {
      this.handleDash(mouseX, mouseY, dashElement);
    }

    const currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    if (currentSpeed > this.maxSpeed && !this.isDashing) {
      const ratio = this.maxSpeed / currentSpeed;
      this.dx *= ratio;
      this.dy *= ratio;
    }

    this.dx *= this.friction;
    this.dy *= this.friction;

    this.x += this.dx;
    this.y += this.dy;

    this.x = Math.max(this.radius, Math.min(CANVAS.WIDTH - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(CANVAS.HEIGHT - this.radius, this.y));

    if (Math.abs(this.dx) < 0.01) this.dx = 0;
    if (Math.abs(this.dy) < 0.01) this.dy = 0;
  }

  addMoney(amount) {
    this.money += amount;
    this.moneyElement = document.getElementById('money');
    this.moneyElement.textContent = `COINS: ${this.money}`;
  }

  getMoney() {
    return this.money;
  }

  addKey(keyid){
    this.keys.push(keyid);
  }

  addPowerup(power) {
    switch (power) {
      case "extraballs":
        this.shootCooldown = 150;
        break;
      
      case "extrahealth":
        PLAYER.MAX_HEALTH += 10;
        console.log("UPDATE ", PLAYER.MAX_HEALTH);
        this.health = PLAYER.MAX_HEALTH;
        this.healthBar.setMaxHealth(PLAYER.MAX_HEALTH);
        this.healthBar.update(PLAYER.MAX_HEALTH); 
        break;

      case "super":
        this.shootCooldown = 0;
        break;

      case "double":
        this.double = 1;
        break;

      case "spread":
        this.spread = 1;
        break;

    }
    console.log(power);
  }
}
