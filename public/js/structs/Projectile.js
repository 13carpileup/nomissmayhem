// Projectile.js
import { CANVAS, PROJECTILE } from '../constants.js';

export class Projectile {
  constructor(x, y, angle, playerRadius, radius) {  // Add playerRadius parameter
    this.x = x + playerRadius * Math.cos(angle);
    this.y = y + playerRadius * Math.sin(angle);

    this.dx = PROJECTILE.SPEED * Math.cos(angle);
    this.dy = PROJECTILE.SPEED * Math.sin(angle);
    this.radius = radius;
    this.bounces = 0;
    this.canHurt = false;
    this.createdAt = Date.now();
  }

  update() {
    if (!this.canHurt && Date.now() - this.createdAt > 100) {
      this.canHurt = true;
    }

    this.x += this.dx;
    this.y += this.dy;

    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.dx = Math.abs(this.dx);
      this.bounces++;
    }
    if (this.x + this.radius > CANVAS.WIDTH) {
      this.x = CANVAS.WIDTH - this.radius;
      this.dx = -Math.abs(this.dx);
      this.bounces++;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.dy = Math.abs(this.dy);
      this.bounces++;
    }
    if (this.y + this.radius > CANVAS.HEIGHT) {
      this.y = CANVAS.HEIGHT - this.radius;
      this.dy = -Math.abs(this.dy);
      this.bounces++;
    }

    return this.bounces >= PROJECTILE.MAX_BOUNCES;
  }
}
