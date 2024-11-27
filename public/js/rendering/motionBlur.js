export function drawMotionBlur(
    blurCtx,
    blurCanvas,
    player
    // player: {
    //   isDashing,
    //   trailPositions,
    //   x,
    //   y,
    //   dx,
    //   dy,
    //   size
    // }
  ) {
    blurCtx.clearRect(0, 0, blurCanvas.width, blurCanvas.height);
  
    const pixelSize = player.size / 14; // Match the pixel size of the player
  
    if (player.isDashing) {
      const startPos = player.trailPositions[player.trailPositions.length - 1] || { x: player.x, y: player.y };
      
      player.trailPositions.forEach((pos, index) => {
        const alpha = (1 - index / player.trailPositions.length) * 0.6;
        drawPixelatedBlur(blurCtx, pos.x, pos.y, player.size, `rgba(68, 136, 255, ${alpha})`, pixelSize);
      });
  
      // Draw a line connecting the blur particles
      blurCtx.beginPath();
      blurCtx.moveTo(startPos.x, startPos.y);
      player.trailPositions.forEach(pos => {
        blurCtx.lineTo(pos.x, pos.y);
      });
      blurCtx.lineTo(player.x, player.y);
      blurCtx.strokeStyle = 'rgba(68, 136, 255, 0.3)';
      blurCtx.lineWidth = pixelSize * 2;
      blurCtx.stroke();
  
    } else if (Math.abs(player.dx) > 3 || Math.abs(player.dy) > 3) {
      player.trailPositions.forEach((pos, index) => {
        const alpha = (1 - index / player.trailPositions.length) * 0.2;
        drawPixelatedBlur(blurCtx, pos.x, pos.y, player.size, `rgba(68, 136, 255, ${alpha})`, pixelSize);
      });
    }
  }
  
  function drawPixelatedBlur(
    ctx,
    x,
    y,
    size,
    color,
    pixelSize
  ) {
    const blurShape = [
      [0,0,0,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,0,0,0]
    ];
  
    ctx.fillStyle = '#000';
    
    const offsetX = x - (size / 2);
    const offsetY = y - (size / 2);
    
    for (let i = 0; i < blurShape.length; i++) {
      for (let j = 0; j < blurShape[i].length; j++) {
        if (blurShape[i][j]) {
          // console.log('drawing..')
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
  
  