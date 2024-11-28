// Room.js

import { EnemyFactory } from './Enemy.js'
import { preloadImage } from '../util/utils.js';


const startRoom = {
    background: "/rooms/room1.png",
    travel: {
        up: { type: "door", open: 1, openreq: 0, shotcount: 0 },
        down: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
    },
    beginEnemies: [
    ],
    projectiles: [],
    coins: [],
    keys: [],
    type: "regular",
    visited: 0
};

const emptyRoom = {
    background: "/rooms/room2.png",
    travel: {
        up: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        down: { type: "door", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "door", open: 0, openreq: 6, shotcount: 0 },
        right: { type: "wall", open: 0, openreq: 10, shotcount: 0 },
    },
    beginEnemies: [  
        EnemyFactory.createEnemy('attacker', 150, 100, 'keyer', true),
        EnemyFactory.createEnemy('attacker', 250, 200, 'keyless'),
    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "regular",
    visited: 0,

};

    const testRoom = {
        background: "/rooms/room3.png",
        travel: {
            up: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
            down: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
            left: { type: "door", open: 1, openreq: 0, shotcount: 0 },
            right: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        },
        beginEnemies: [
            EnemyFactory.createEnemy('regular', 150, 100),
        ],
        projectiles: [],
        coins: [],
        keys: [],
        type: "regular",
        visited: 0
    };

    const shopRoom = {
        background: "/rooms/storetutorial.jpg",
        travel: {
            up: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
            down: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
            left: { type: "door", open: 1, openreq: 0, shotcount: 0 },
            right: { type: "door", open: 1, openreq: 0, shotcount: 0 },
        },
        beginEnemies: [
            
        ],
        projectiles: [],
        coins: [],
        type: "shop",
        keys: [],
        health:[],
        powerUps: [['extraballs', 2, 'Extra Balls', 'Increases the speed at which you can fire!'], ['extrahealth', 1, 'Extra Health', 'Increases your maximum health!']],
        bought: [0, 0],
        visited: 0
    };

const nullTile = {
    background: "/rooms/store.png",
    travel: {
        up: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        down: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
    },
    beginEnemies: [
        
    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "nullTile",
};

const tutorialRoom = {
    background: "/rooms/tutorial1.jpg",
    travel: {
        up: { type: "door", open: 0, openreq: 3, shotcount: 0 },
        down: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
    },
    beginEnemies: [
        
    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "regular",
    visited: 1
};

const tutorialRoom2 = {
    background: "/rooms/tutorial2.jpg",
    travel: {
        up: { type: "door", open: 0, openreq: 3, shotcount: 0 },
        down: { type: "door", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
    },
    enemies: [EnemyFactory.createEnemy('regular', 150, 100, 'bruh', false, true)],
    beginEnemies: [
        EnemyFactory.createEnemy('regular', 150, 100, 'bruh', false, true)
    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "regular",
    visited: 0
};

const tutorialRoom3 = {
    background: "/rooms/tutorial3.png",
    travel: {
        up: { type: "door", open: 0, openreq: 4, shotcount: 0 },
        down: { type: "key", open: 0, openreq: 0, shotcount: 0 },
        left: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "door", open: 1, openreq: 0, shotcount: 0 },
    },
    beginEnemies: [
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('regular', 400, 100),
        EnemyFactory.createEnemy('attacker', 400, 100)
    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "regular",
    visited: 0
};

const defaultRoom04 = {
    background: "/rooms/room2.png",
    travel: {
        up: { type: "door", open: 0, openreq: 4, shotcount: 0 },
        down: { type: "door", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "door", open: 0, openreq: 7, shotcount: 0 },
    },
    beginEnemies: [
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('regular', 400, 100),
        EnemyFactory.createEnemy('regular', 250, 500),
        EnemyFactory.createEnemy('regular', 300, 200)
    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "regular",
    visited: 0
};

const defaultRoom14 = {
    background: "/rooms/room3.png",
    travel: {
        up: { type: "door", open: 0, openreq: 4, shotcount: 0 },
        down: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "door", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "wall", open: 1, openreq: 7, shotcount: 0 },
    },
    beginEnemies: [
        EnemyFactory.createEnemy('attacker', 150, 100),
        EnemyFactory.createEnemy('attacker', 200, 400,'', false, true),
        EnemyFactory.createEnemy('regular', 300, 100),
    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "regular",
    visited: 0
};

const defaultRoom05 = {
    background: "/rooms/room2.png",
    travel: {
        up: { type: "door", open: 0, openreq: 4, shotcount: 0 },
        down: { type: "door", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "wall", open: 0, openreq: 7, shotcount: 0 },
    },
    beginEnemies: [
        EnemyFactory.createEnemy('regular', 400, 200),
        EnemyFactory.createEnemy('attacker', 250, 500),
        EnemyFactory.createEnemy('regular', 200, 200)
    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "regular",
    visited: 0
};

const storeRoom15 = {
    background: "/rooms/store.png",
    travel: {
        up: { type: "wall", open: 0, openreq: 4, shotcount: 0 },
        down: { type: "door", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
    },
    beginEnemies: [

    ],
    projectiles: [],
    coins: [],
    keys: [],
    type: "shop",
    powerUps: [['super', 8, 'Super Shot', 'Removes all shooting cooldown!'], ['extrahealth', 5, 'Extra Health', 'Increases your maximum health!']],
    bought: [0,0],
    health:[],
    visited: 0
};

const defaultRoom06 = {
    background: "/rooms/room2.png",
    travel: {
        up: { type: "door", open: 0, openreq: 8, shotcount: 0 },
        down: { type: "door", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "wall", open: 0, openreq: 7, shotcount: 0 },
    },
    beginEnemies: [
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('regular', 300, 200)
    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "regular",
    visited: 0
};

const defaultRoom07 = {
    background: "/rooms/room2.png",
    travel: {
        up: { type: "wall", open: 0, openreq: 8, shotcount: 0 },
        down: { type: "door", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "door", open: 0, openreq: 7, shotcount: 0 },
    },
    beginEnemies: [
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('regular', 400, 100, '', false, true),
        EnemyFactory.createEnemy('regular', 250, 500),
        EnemyFactory.createEnemy('regular', 300, 200)
    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "regular",
    visited: 0
};

const keyRoom = {
    background: "/rooms/room3.png",
    travel: {
        up: { type: "wall", open: 1,         openreq: 8, shotcount: 0 },
        down: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        left: { type: "door", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "wall", open: 0, openreq: 7, shotcount: 0 },
    },
    beginEnemies: [
        EnemyFactory.createEnemy('attacker', 150, 100), 
        EnemyFactory.createEnemy('regular', 400, 100,'key1',  true, true, 50, 500),
        EnemyFactory.createEnemy('attacker', 250, 500),
        EnemyFactory.createEnemy('attacker', 300, 200)
    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "regular",
    visited: 0
};


const winningRoom = {
    background: "/rooms/room1.png",
    travel: {
        up: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        down: { type: "wall", open: 0, openreq: 0, shotcount: 0 },
        left: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
        right: { type: "wall", open: 1, openreq: 0, shotcount: 0 },
    },
    beginEnemies: [

    ],
    projectiles: [],
    coins: [],
    keys: [],
    health:[],
    type: "win",
    visited: 0
};


export const startIndex = [6, 2];

export const Rooms = [
    [defaultRoom07, keyRoom, nullTile],
    [defaultRoom06, nullTile, nullTile],
    [defaultRoom05, storeRoom15, nullTile],
    [defaultRoom04, defaultRoom14, nullTile],
    [tutorialRoom3, shopRoom, emptyRoom],
    [winningRoom, nullTile, tutorialRoom2],
    [nullTile, nullTile, tutorialRoom]
];

// preloading room imgs
export function preloadRooms(rms) {
    let urls = new Set();

    rms.forEach((row)=> {
        row.forEach((room) => {
            urls.add("assets"+room.background);
        })
    });

    preloadImage(urls);
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
