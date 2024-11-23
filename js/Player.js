// Player.js
import { CANVAS, PLAYER } from './constants.js';

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
    this.isInvulnerable = false;
    this.invulnerableTime = PLAYER.INVULNERABLE_TIME;
    this.canDash = true;
    this.isDashing = false;
    this.dashCooldown = PLAYER.DASH_COOLDOWN;
    this.dashDistance = PLAYER.DASH_DISTANCE;
    this.dashDuration = PLAYER.DASH_DURATION;
    this.trailPositions = [];
    this.money = 0;
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
      dashElement.textContent = "Dash Cooling...";

      setTimeout(() => {
        this.isDashing = false;
      }, this.dashDuration);

      setTimeout(() => {
        this.canDash = true;
        dashElement.textContent = "Dash Ready!";
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

    if (keys.w) moveY -= 1;
    if (keys.s) moveY += 1;
    if (keys.a) moveX -= 1;
    if (keys.d) moveX += 1;

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
    console.log(this.money)
    this.moneyElement.textContent = `Money: ${this.money}`;
  }
}
