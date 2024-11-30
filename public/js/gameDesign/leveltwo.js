import { Room, createTravel } from '../structs/Rooms.js';
import { EnemyFactory } from '../structs/Enemy.js';




const nullTile = new Room(
    "/rooms/store/storetutorial.png", 
    createTravel(['wall', 0], ['wall', 0], ['wall', 0], ['wall', 0]), 
    [  
    ],
    "nullTile",
);

const d00 = new Room(
    "/rooms/dungeon/d23.png", 
    createTravel(['wall', 0], ['door', 6], ['wall', 0], ['door', 7]), 
    [  
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('attacker', 400, 400),
        EnemyFactory.createEnemy('shielded', 150, 500, 'key1', true, true),
    ],
    "regular",
);

const d01 = new Room(
    "/rooms/dungeon/d14.png", 
    createTravel(['door', 6], ['door', 6], ['wall', 0], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('attacker', 100, 400, 'health', false, true),
        EnemyFactory.createEnemy('attacker', 300, 500, 'health', false, true),
    ],
    "regular",
);

const d02 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['door', 6], ['door', 6], ['wall', 0], ['door', 7]), 
    [  
        EnemyFactory.createEnemy('shielded', 150, 140),
        EnemyFactory.createEnemy('shielded', 200, 400),
        EnemyFactory.createEnemy('attacker', 100, 500),
    ],
    "regular",
);

const d03 = new Room(
    "/rooms/dungeon/d10.png", 
    createTravel(['door', 6], ['wall', 0], ['wall', 0], ['door', 7]), 
    [  
        EnemyFactory.createEnemy('shielded', 100, 400),
        EnemyFactory.createEnemy('regular', 300, 500),
        EnemyFactory.createEnemy('regular', 300, 500, 'health', false, true),
    ],
    "regular",
);

const d10 = new Room(
    "/rooms/dungeon/d20.png", 
    createTravel(['wall', 0], ['door', 5], ['door', 6], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('shielded', 150, 400),
        EnemyFactory.createEnemy('regular', 100, 300),
        EnemyFactory.createEnemy('regular', 200, 500, 'health', false, true),
    ],
    "regular",
);


const d11 = new Room(
    "/rooms/dungeon/d22.png", 
    createTravel(['door', 6], ['wall', 0], ['wall', 0], ['door', 6]), 
    [  
        EnemyFactory.createEnemy('shielded', 150, 400),
        EnemyFactory.createEnemy('attacker', 100, 500),
        EnemyFactory.createEnemy('attacker', 140, 100),
        EnemyFactory.createEnemy('attacker', 250, 500),
    ],
    "regular",
);

const s12 = new Room(
    "/rooms/store/store.png", 
    createTravel(['wall', 0], ['wall', 0], ['door', 0], ['door', 0]), 
    [  
    ],
    "shop",
    [['super', 2, 'Super Shot', 'Removes all shooting cooldown!'], ['extrahealth', 1, 'Extra Health', 'Increases your maximum health!']]
);

const d13 = new Room(
    "/rooms/dungeon/d13.png", 
    createTravel(['wall', 0], ['wall', 0], ['door', 4], ['door', 6]), 
    [  
        EnemyFactory.createEnemy('shielded', 150, 240),
        EnemyFactory.createEnemy('regular', 200, 500),
        EnemyFactory.createEnemy('regular', 150, 550),
    ],
    "regular",
);

const d21 = new Room(
    "/rooms/dungeon/d23.png", 
    createTravel(['wall', 0], ['door', 6], ['door', 4], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('shielded', 150, 240),
        EnemyFactory.createEnemy('attacker', 200, 500, 'health', false, true),
        EnemyFactory.createEnemy('attacker', 150, 550),
    ],
    "regular",
);

const d22 = new Room(
    "/rooms/dungeon/d14.png", 
    createTravel(['door', 5], ['door', 6], ['door', 4], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('attacker', 200, 300, 'health', false, true),
        EnemyFactory.createEnemy('attacker', 250, 550),
        EnemyFactory.createEnemy('attacker', 130, 550),
    ],
    "regular",
);

const d23 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['door', 5], ['door', 6], ['door', 5], ['door', 0]), 
    [  
        EnemyFactory.createEnemy('shielded', 200, 300, 'health', false, true),
    ],
    "regular",
);

const d24 = new Room(
    "/rooms/dungeon/d10.png", 
    createTravel(['door', 3], ['wall', 6], ['wall', 5], ['wall', 0]), 
    [  
    ],
    "regular",
);

const s33 = new Room(
    "/rooms/store/store.png", 
    createTravel(['wall', 0], ['wall', 0], ['door', 0], ['door', 0]), 
    [  
    ],
    "shop",
    [['double', 0, 'Double Shot', 'Gives you a second gun!'], ['spread', 0, 'Spread Shot', 'Gives you a triple gun!!!!']]
);

const d43 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['door', 6], ['wall', 6], ['door', 5], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('shielded', 200, 300, 'health', false, true),
    ],
    "regular",
);

const b42 = new Room(
    "/rooms/dungeon/d10.png", 
    createTravel(['key', 0], ['door', 0], ['wall', 4], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('shielded', 300, 300,'key1',  true, false, 40, 250),
        EnemyFactory.createEnemy('regular', 250, 500, 'health', false, true),
        EnemyFactory.createEnemy('regular', 400, 400, 'health', false, true),
        EnemyFactory.createEnemy('regular', 400, 400)
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

export const indexLevel2 = [4, 2];

export const roomsLevel2 = [
    [d00, d10, nullTile, nullTile, nullTile],
    [d01, d11, d21, nullTile, winningRoom],
    [d02, s12, d22, nullTile, b42],
    [d03, d13, d23, s33, d43],
    [nullTile, nullTile, d24, nullTile, nullTile]
];