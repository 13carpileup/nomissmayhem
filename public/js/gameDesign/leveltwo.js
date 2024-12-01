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
    "/rooms/dungeon/d10.png", 
    createTravel(['wall', 3], ['key', 0], ['wall', 5], ['door', 5]), 
    [  
        EnemyFactory.createEnemy('laser', 250, 300, 'key1', true, true, 40, 250),
        EnemyFactory.createEnemy('laser', 200, 500, 'health', false, true),
        EnemyFactory.createEnemy('regular', 100, 300, 'health', false, true),
    ],
    "regular",
);

const d01 = new Room(
    "/rooms/dungeon/win.png", 
    createTravel(['door', 3], ['door', 0], ['wall', 5], ['wall', 5]), 
    [  

    ],
    "regular",
);

const d10 = new Room(
    "/rooms/dungeon/d23.png", 
    createTravel(['wall', 3], ['wall', 0], ['door', 5], ['door', 5]), 
    [  
        EnemyFactory.createEnemy('regular', 100, 500, 'health', false, true),
        EnemyFactory.createEnemy('shielded', 200, 300, 'health'),
    ],
    "regular",
);

const d11 = new Room(
    "/rooms/dungeon/d11.png", 
    createTravel(['wall', 3], ['wall', 6], ['wall', 5], ['door', 3]), 
    [  
    ],
    "regular",
);

const d20 = new Room(
    "/rooms/dungeon/d25.png", 
    createTravel(['wall', 3], ['wall', 0], ['door', 5], ['door', 5]), 
    [  
        EnemyFactory.createEnemy('regular', 200, 350, 'health'),
        EnemyFactory.createEnemy('regular', 250, 300, 'health'),
        EnemyFactory.createEnemy('attacker', 400, 150, 'health'),
    ],
    "regular",
);

const d21 = new Room(
    "/rooms/dungeon/d10.png", 
    createTravel(['wall', 3], ['wall', 6], ['door', 5], ['door', 5]), 
    [  
        EnemyFactory.createEnemy('laser', 250, 100, 'health', false, true),
    ],
    "regular",
);

const s30 = new Room(
    "/rooms/store/store.png", 
    createTravel(['wall', 0], ['wall', 0], ['door', 0], ['door', 0]), 
    [  
    ],
    "shop",
    [['double', 13, 'Double Barrel', 'Gives you a second gun!'], ['super', 15, 'Super Shot', 'Removes all shooting cooldown!']]
);

const s31 = new Room(
    "/rooms/store/store.png", 
    createTravel(['wall', 0], ['wall', 0], ['door', 0], ['door', 1]), 
    [  
    ],
    "shop",
    [['health', 5, 'Extra Health', 'Increases your maximum health!'], ['spread', 5, 'Spread Shot', 'Gives you a triple gun!!!!']]
);


const d40 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['wall', 3], ['door', 6], ['door', 5], ['wall', 5]), 
    [  
        EnemyFactory.createEnemy('laser', 100, 350, 'health', false, true),
        EnemyFactory.createEnemy('laser', 210, 500, 'health', false),
    ],
    "regular",
);

const d41 = new Room(
    "/rooms/dungeon/d15.png", 
    createTravel(['key', 3], ['door', 6], ['door', 5], ['door', 5]), 
    [  
        EnemyFactory.createEnemy('laser', 200, 100, 'health'),
        EnemyFactory.createEnemy('regular', 250, 300, 'health'),
        EnemyFactory.createEnemy('regular', 500, 100, 'health', false, true),
    ],
    "regular",
);

const d42 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['door', 3], ['wall', 6], ['door', 5], ['door', 5]), 
    [  
        EnemyFactory.createEnemy('shielded', 500, 300, 'health'),
        EnemyFactory.createEnemy('regular', 300, 300, 'health'),
        EnemyFactory.createEnemy('regular', 100, 300, 'health', false, true),
    ],
    "regular",
);

const d32 = new Room(
    "/rooms/dungeon/d15.png", 
    createTravel(['wall', 3], ['door', 6], ['wall', 5], ['door', 5]), 
    [  
        EnemyFactory.createEnemy('laser', 300, 300, 'health'),
        EnemyFactory.createEnemy('regular', 350, 100, 'health', false, true),
        EnemyFactory.createEnemy('attacker', 100, 300, 'health'),
    ],
    "regular",
);

const d33 = new Room(
    "/rooms/dungeon/d20.png", 
    createTravel(['door', 3], ['door', 6], ['wall', 5], ['door', 5]), 
    [  
        EnemyFactory.createEnemy('shielded', 100, 300, 'health'),
        EnemyFactory.createEnemy('regular', 350, 100, 'health'),
        EnemyFactory.createEnemy('regular', 100, 350, 'health'),
    ],
    "regular",
);

const d51 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['wall', 4], ['door', 6], ['door', 5], ['wall', 5]), 
    [  
        EnemyFactory.createEnemy('laser', 300, 500, 'health'),
        EnemyFactory.createEnemy('laser', 350, 300, 'health'),
        EnemyFactory.createEnemy('regular', 350, 100, 'health', false, true),
    ],
    "regular",
);

const d52 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['door', 4], ['door', 6], ['door', 5], ['wall', 5]), 
    [  
        EnemyFactory.createEnemy('laser', 300, 300, 'health'),
        EnemyFactory.createEnemy('regular', 350, 100, 'health'),
    ],
    "regular",
);

const d53 = new Room(
    "/rooms/dungeon/d13.png", 
    createTravel(['door', 5], ['door', 6], ['wall', 5], ['wall', 5]), 
    [  
        EnemyFactory.createEnemy('shielded', 100, 300, 'health'),
        EnemyFactory.createEnemy('regular', 350, 100, 'health'),
        EnemyFactory.createEnemy('regular', 100, 350, 'health', false, true),
    ],
    "regular",
);

const d34 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['door', 5], ['wall', 6], ['wall', 5], ['door', 5]), 
    [  
        EnemyFactory.createEnemy('shielded', 550, 100, 'health'),
        EnemyFactory.createEnemy('regular', 120, 350, 'health', false, true),
    ],
    "regular",
);

const d44 = new Room(
    "/rooms/dungeon/d10.png", 
    createTravel(['wall', 5], ['door', 6], ['door', 5], ['door', 5]), 
    [  
        EnemyFactory.createEnemy('laser', 550, 100, 'health'),
        EnemyFactory.createEnemy('laser', 120, 350, 'health'),
        EnemyFactory.createEnemy('laser', 420, 350, 'health'),
    ],
    "regular",
);

const d54 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['door', 5], ['wall', 6], ['door', 5], ['wall', 5]), 
    [  
        EnemyFactory.createEnemy('shielded', 450, 150, 'health'),
        EnemyFactory.createEnemy('attacker', 250, 400, 'health'),
    ],
    "regular",
);


const d45 = new Room(
    "/rooms/dungeon/d20.png", 
    createTravel(['door', 5], ['wall', 6], ['wall', 5], ['wall', 5]), 
    [  
        EnemyFactory.createEnemy('regular', 550, 100, 'health'),
        EnemyFactory.createEnemy('regular', 120, 350, 'health'),
        EnemyFactory.createEnemy('attacker', 120, 350, 'health'),
        EnemyFactory.createEnemy('laser', 420, 350, 'key1', true, true),
    ],
    "regular",
);

const winningRoom = new Room(
    "/rooms/dungeon/win.png", 
    createTravel(['wall', 0], ['wall', 0], ['wall', 0], ['wall', 0]), 
    [  

    ],  
    "win",
);

export const indexLevel2 = [1, 1];

export const roomsLevel2 = [
    [d00, d10, d20, s30, d40, nullTile],
    [d01, d11, d21, s31, d41, d51],
    [winningRoom, nullTile, nullTile, d32, d42, d52],
    [nullTile, nullTile, nullTile, d33, nullTile, d53],
    [nullTile, nullTile, nullTile, d34, d44, d54], 
    [nullTile, nullTile, nullTile, nullTile, d45, nullTile]
];