export function checkCardCollision(room, proj) {
    if (room.type!="shop") {
        return '';
    }
    //this.ctx.fillRect(350, 35, 140, 200);
    //this.ctx.fillRect(150, 35, 140, 200);

    let x = proj.x;
    let y = proj.y;
    console.log(x, y)
    if (x > 348 && x < 492 && y > 33 && y < 237) {
        return [1, room.powerUps[1]];
    }

    if (x > 148 && x < 222 && y > 33 && y < 237) {
        return [0, room.powerUps[0]];
    }
}