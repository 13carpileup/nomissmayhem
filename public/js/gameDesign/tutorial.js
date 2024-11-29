import { Room, createTravel } from '../structs/Rooms.js';
import { EnemyFactory } from '../structs/Enemy.js';




const nullTile = new Room(
    "/rooms/store/storetutorial.png", 
    createTravel(['wall', 0], ['wall', 0], ['wall', 0], ['wall', 0]), 
    [  
    ],
    "nullTile",
);

const t40 = new Room(
    "/rooms/tutorial/ft1.png", 
    createTravel(['wall', 0], ['door', 0], ['wall', 0], ['wall', 0]), 
    [  
    ],
    "regular",
);

const t41 = new Room(
    "/rooms/tutorial/ft2.png", 
    createTravel(['door', 0], ['door', 3], ['wall', 0], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('regular', 150, 100),
    ],
    "regular",
);

const t42 = new Room(
    "/rooms/dungeon/d23.png", 
    createTravel(['door', 0], ['wall', 0], ['door', 4], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('attacker', 400, 400),
    ],
    "regular",
);

const s32 = new Room(
    "/rooms/tutorial/fst.png", 
    createTravel(['wall', 0], ['wall', 0], ['door', 0], ['door', 0]), 
    [  
    ],
    "shop",
    [['extraballs', 2, 'Extra Balls', 'Increases the speed at which you can fire!'], ['extrahealth', 1, 'Extra Health', 'Increases your maximum health!']]
);

const t22 = new Room(
    "/rooms/tutorial/ft3.png", 
    createTravel(['key', 0], ['wall', 0], ['door', 4], ['door', 0]), 
    [  
        EnemyFactory.createEnemy('regular', 150, 100),
        EnemyFactory.createEnemy('regular', 400, 400),
    ],
    "regular",
);

const b21 = new Room(
    "/rooms/dungeon/d10.png", 
    createTravel(['wall', 0], ['door', 0], ['wall', 4], ['key', 0]), 
    [  
        EnemyFactory.createEnemy('regular', 300, 300,'key1',  true, false, 50, 60),
        EnemyFactory.createEnemy('attacker', 250, 500),
        EnemyFactory.createEnemy('attacker', 400, 400)
    ],
    "regular",
);

const t12 = new Room(
    "/rooms/dungeon/d15.png", 
    createTravel(['wall', 0], ['door', 6], ['door', 4], ['door', 0]), 
    [  
        EnemyFactory.createEnemy('regular', 300, 300),
        EnemyFactory.createEnemy('attacker', 250, 500, 'f', false, true),
        EnemyFactory.createEnemy('attacker', 400, 400)
    ],
    "regular",
);

const t02 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['wall', 0], ['door', 6], ['wall', 0], ['door', 4]), 
    [  
        EnemyFactory.createEnemy('regular', 300, 300),
        EnemyFactory.createEnemy('attacker', 250, 500, 'f', false, true),
        EnemyFactory.createEnemy('attacker', 400, 400)
    ],
    "regular",
);

const t03 = new Room(
    "/rooms/dungeon/d21.png", 
    createTravel(['door', 5], ['wall', 0], ['wall', 0], ['door', 4]), 
    [  
        EnemyFactory.createEnemy('regular', 300, 300),
        EnemyFactory.createEnemy('regular', 400, 400),
        EnemyFactory.createEnemy('regular', 300, 400),
        EnemyFactory.createEnemy('regular', 500, 200),
        EnemyFactory.createEnemy('regular', 400, 100,'key1',  true, true),
    ],
    "regular",
);

const t13 = new Room(
    "/rooms/dungeon/d14.png", 
    createTravel(['door', 5], ['wall', 0], ['door', 5], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('regular', 300, 300),
        EnemyFactory.createEnemy('attacker', 400, 400),
        EnemyFactory.createEnemy('attacker', 200, 100),
    ],
    "regular",
);






const keyRoom = new Room(
    "/rooms/dungeon/d10.png", 
    createTravel(['wall', 0], ['wall', 0], ['door', 0], ['wall', 0]), 
    [  
        EnemyFactory.createEnemy('attacker', 150, 100), 
        EnemyFactory.createEnemy('regular', 400, 100,'key1',  true, true, 40, 200),
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

export const startIndex = [0, 4];

export const Rooms = [
    [nullTile, nullTile, nullTile, nullTile, t40],
    [nullTile, nullTile, b21, winningRoom, t41],
    [t02, t12, t22, s32, t42],
    [t03, t13, nullTile, nullTile, nullTile]
];