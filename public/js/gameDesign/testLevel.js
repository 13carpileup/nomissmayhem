import { Room, createTravel } from '../structs/Rooms.js';
import { EnemyFactory } from '../structs/Enemy.js';


const emptyRoom = new Room(
    "/rooms/dungeon/d11.png", 
    createTravel(['wall', 0], ['door', 0], ['door', 5], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('attacker', 150, 100, 'keyer'),
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

export const indexTest = [6, 2];

export const roomsTest = [
    [defaultRoom07, keyRoom, nullTile],
    [defaultRoom06, nullTile, nullTile],
    [defaultRoom05, storeRoom15, nullTile],
    [defaultRoom04, defaultRoom14, nullTile],
    [tutorialRoom3, shopRoom, emptyRoom],
    [winningRoom, nullTile, tutorialRoom2],
    [nullTile, nullTile, tutorialRoom]
];