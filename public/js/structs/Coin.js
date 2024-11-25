import { COIN } from '../constants.js';

export class Coin {
    constructor(x, y, value, type) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.type = type;
        this.radius = COIN.RADIUS;
        this.color = COIN.COLORS[type] || COIN.COLORS.bronze;
    }
}