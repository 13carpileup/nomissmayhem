// Room.js

import { EnemyFactory } from './Enemy.js'
import { preloadImage } from '../util/utils.js';


export class Room {
    constructor(background, travel, beginEnemies, type, powerUps = []) {
        this.background = background;
        this.travel = travel;
        this.beginEnemies = beginEnemies;
        this.projectiles = [];
        this.coins = [];
        this.keys = [];
        this.health = [];
        this.lasers = [];
        this.type = type;
        this.visited = 0;
        this.imageRef = new Image();
        this.powerUps = powerUps;
        this.bought = [0, 0];
    }
}

export function createTravel(up, down, left, right) {
    let travel = {
        up: {type: up[0], open: (up[1] == 0 && up[0] != 'key' ? 1 : 0), openreq: up[1], shoutcount: 0},
        down: {type: down[0], open: (down[1] == 0 && down[0] != 'key' ? 1 : 0), openreq: down[1], shoutcount: 0},
        left: {type: left[0], open: (left[1] == 0 && left[0] != 'key' ? 1 : 0), openreq: left[1], shoutcount: 0},
        right: {type: right[0], open: (right[1] == 0 && right[0] != 'key' ? 1 : 0), openreq: right[1], shoutcount: 0},
    }

    return travel;
}




// preloading room imgs
export function preloadRooms(rms) {
    rms.forEach((row)=> {
        row.forEach((room) => {
            
            const link = "assets"+room.background;
            room.imageRef.src=link;
            console.log(link)
            
        })
    });

    // preloadImage(urls);
}



console.log("DONE PRELOADING")

export function checkDoorCollision(proj) {
    let x = proj.x;
    let y = proj.y;
    //260 -> 340, 20 tall
    

    if (x > 258 && x < 342) {
        if (y < 22) {
            return 'up'
        }
        if (y > 578) {
            return 'down'
        }
    }

    if (y > 258 && y < 342) {
        if (x < 22) {
            return 'left'
        }
        if (x > 578) {
            return 'right'
        }
    }
}
