export function drawPixelPlayer(
    ctx,
    x,
    y,
    size,
    color
  ) {
    // Player body shape (14x14 grid)
    const playerShape = [
        [0,0,0,0,0,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,0,0,0,1,1,1,1,0,0,0,0,0]
    ];
    
    const pixelSize = (size / playerShape.length);
    
    
  
    ctx.fillStyle = color;
    
    // Calculate the offset to center the player
    const offsetX = x - (size / 2);
    const offsetY = y - (size / 2);

    //ctx.fillRect(offsetX, offsetY, size, size);

    //ctx.fillStyle = '#000';
    
    for (let i = 0; i < playerShape.length; i++) {
      for (let j = 0; j < playerShape[i].length; j++) {
        if (playerShape[i][j]) {
          ctx.fillRect(
            offsetX + j * pixelSize,
            offsetY + i * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }
  }
  
  