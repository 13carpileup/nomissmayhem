export function createMinimap(rooms, currentPosition) {
    const minimapContainer = document.getElementById('map');
    const mapHeight = 300; // Total minimap size
    const mapWidth = 200; // Total minimap size
    const roomHeight = mapHeight / rooms.length; // Size of each room cell
    const roomWidth = mapWidth / rooms.length; // Size of each room cell
    console.log(rooms);
    const html = `
        <style>
            .minimap {
                width: ${mapWidth}px;
                height: ${mapHeight}px;
                background: #111;
                padding: 4px;
                display: grid;
                grid-template-columns: repeat(${rooms[0].length}, 1fr);
                grid-template-rows: repeat(${rooms.length}, 1fr);
                gap: 2px;
                border: 4px solid #444;
                image-rendering: pixelated;
            }
            .room {
                background: #333;
                position: relative;
                box-shadow: inset 1px 1px 0 #555, inset -1px -1px 0 #222;
            }
            .room.visited {
                background: #555;
                box-shadow: inset 1px 1px 0 #777, inset -1px -1px 0 #444;
            }
            .room.current {
                background: #4a4;
                box-shadow: inset 1px 1px 0 #6c6, inset -1px -1px 0 #282;
            }
            .shop {
                background: #48a;
                box-shadow: inset 1px 1px 0 #6ac, inset -1px -1px 0 #268;
            }
            .room.null {
                background: #111;
                box-shadow: none;
            }
            .door {
                position: absolute;
                background: #ca4;
            }
            .notVisited {
                background: #111;
                box-shadow: none;
            }
            .notVisitedDoor {
                display: none;
            }
            .door.up { top: 0; left: 50%; width: 6px; height: 2px; transform: translateX(-50%); }
            .door.down { bottom: 0; left: 50%; width: 6px; height: 2px; transform: translateX(-50%); }
            .door.left { left: 0; top: 50%; width: 2px; height: 6px; transform: translateY(-50%); }
            .door.right { right: 0; top: 50%; width: 2px; height: 6px; transform: translateY(-50%); }
        </style>
        <div class="minimap">
            ${rooms.map((row, i) => 
                row.map((room, j) => {
                    if (room.type === "nullTile") {
                        return `<div class="room null"></div>`;
                    }
                    
                    const isCurrentRoom = i === currentPosition[0] && j === currentPosition[1];
                    const roomClass = `room ${isCurrentRoom ? 'current' : ''} ${room.type === 'shop' ? 'shop' : ''} ${room.visited ? 'visited' : 'notVisited'}`;
                    
                    const doors = ['up', 'down', 'left', 'right']
                        .filter(direction => room.travel[direction].type === 'door')
                        .map(direction => `<div class="door ${direction} ${room.visited ? 'visitedDoor' : 'notVisitedDoor'}"></div>`)
                        .join('');
                    
                    return `<div class="${roomClass}">${doors}</div>`;
                }).join('')
            ).join('')}
        </div>
    `;

    minimapContainer.innerHTML = html;
}

// Keep track of current position

// Initial render

// Update minimap when moving between rooms
// Add this to wherever you handle room transitions
export function updateMinimap(newRow, newCol) {
    currentPosition = [newRow, newCol];
    createMinimap(Rooms, currentPosition);
}

