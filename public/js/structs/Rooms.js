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
        this.type = type;
        this.visited = 0;
        this.imageRef = new Image();
        this.powerUps = powerUps;
        this.bought = [0, 0];
    }
}

function createTravel(up, down, left, right) {
    let travel = {
        up: {type: up[0], open: (up[1] == 0 && up[0] != 'key' ? 1 : 0), openreq: up[1], shoutcount: 0},
        down: {type: down[0], open: (down[1] == 0 && down[0] != 'key' ? 1 : 0), openreq: down[1], shoutcount: 0},
        left: {type: left[0], open: (left[1] == 0 && left[0] != 'key' ? 1 : 0), openreq: left[1], shoutcount: 0},
        right: {type: right[0], open: (right[1] == 0 && right[0] != 'key' ? 1 : 0), openreq: right[1], shoutcount: 0},
    }

    return travel;
}


const emptyRoom = new Room(
    "/rooms/dungeon/d11.png", 
    createTravel(['wall', 0], ['door', 0], ['door', 5], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('attacker', 150, 100, 'keyer', true),
        EnemyFactory.createEnemy('attacker', 250, 200, 'keyless'),
    ],
    "regular"
);

const shopRoom = new Room(
    "/rooms/store/storetutorial.png", 
    createTravel(['wall', 0], ['wall', 0], ['door', 0], ['door', 0]), 
    [  
    ],
    "shop",
    [['extraballs', 2, 'Extra Balls', 'Increases the speed at which you can fire!'], ['extrahealth', 1, 'Extra Health', 'Increases your maximum health!']]
);

const nullTile = new Room(
    "/rooms/store/storetutorial.png", 
    createTravel(['wall', 0], ['wall', 0], ['wall', 0], ['wall', 0]), 
    [  
    ],
    "nullTile",
);

const tutorialRoom = new Room(
    "/rooms/tutorial/t1.png", 
    createTravel(['door', 3], ['wall', 0], ['wall', 0], ['wall', 0]), 
    [  
    ],
    "regular",
);

const tutorialRoom2 = new Room(
    "/rooms/tutorial/t2.png", 
    createTravel(['door', 3], ['door', 0], ['wall', 0], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('regular', 150, 100, 'bruh', false, true, 20)
    ],
    "regular",
);

const tutorialRoom3 = new Room(
    "/rooms/tutorial/t3.png", 
    createTravel(['door', 4], ['key', 0], ['wall', 0], ['door', 0]), 
    [  
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('regular', 400, 100),
        EnemyFactory.createEnemy('attacker', 400, 100)
    ],
    "regular",
);

const defaultRoom04 = new Room(
    "/rooms/dungeon/d15.png", 
    createTravel(['door', 4], ['door', 0], ['wall', 0], ['door', 7]), 
    [  
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('regular', 400, 100),
        EnemyFactory.createEnemy('regular', 250, 500),
        EnemyFactory.createEnemy('regular', 300, 200)
    ],
    "regular",
);

const defaultRoom14 = new Room(
    "/rooms/dungeon/d11.png", 
    createTravel(['door', 4], ['wall', 0], ['door', 0], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('attacker', 150, 100),
        EnemyFactory.createEnemy('attacker', 200, 400,'', false, true),
        EnemyFactory.createEnemy('regular', 300, 100),
    ],
    "regular",
);

const defaultRoom05 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['door', 4], ['door', 0], ['wall', 0], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('regular', 400, 200),
        EnemyFactory.createEnemy('attacker', 250, 500),
        EnemyFactory.createEnemy('regular', 200, 200)
    ],
    "regular",
);

const storeRoom15 = new Room(
    "/rooms/store/store.png", 
    createTravel(['wall', 0], ['door', 0], ['wall', 0], ['wall', 0]), 
    [  

    ],
    "shop",
    [['super', 8, 'Super Shot', 'Removes all shooting cooldown!'], ['extrahealth', 5, 'Extra Health', 'Increases your maximum health!']]
);

const defaultRoom06 = new Room(
    "/rooms/dungeon/d14.png", 
    createTravel(['door', 7], ['door', 0], ['wall', 0], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('regular', 300, 200)
    ],
    "regular",
);

const defaultRoom07 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['wall', 0], ['door', 0], ['wall', 0], ['door', 7]), 
    [  
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('regular', 400, 100, '', false, true),
        EnemyFactory.createEnemy('regular', 250, 500),
        EnemyFactory.createEnemy('regular', 300, 200)
    ],
    "regular",
);

const keyRoom = new Room(
    "/rooms/dungeon/d10.png", 
    createTravel(['wall', 0], ['wall', 0], ['door', 0], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('attacker', 150, 100), 
        EnemyFactory.createEnemy('regular', 400, 100,'key1',  true, true, 50, 80),
        EnemyFactory.createEnemy('attacker', 250, 500),
        EnemyFactory.createEnemy('attacker', 300, 200)
    ],
    "regular",
);

const winningRoom = new Room(
    "/rooms/dungeon/d10.png", 
    createTravel(['wall', 0], ['wall', 0], ['wall', 0], ['wall', 0]), 
    [  

    ],
    "win",
);

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
