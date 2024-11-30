// utils.js
export function checkCollision(circle1, circle2) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle1.radius + circle2.radius;
}

export function preloadImage(url)
{
  url.forEach((link) => {
    var img=new Image();
    img.src=link;
  }) 
}
  
export function Clone(x) {
  for(p in x)
  this[p] = (typeof(x[p]) == 'object')? new Clone(x[p]) : x[p];
}


export function checkLaserCollision(player, laser) {
  const laserOrigin = { x: laser.x, y: laser.y };
  const laserDirection = {
      x: Math.cos(laser.angle),
      y: Math.sin(laser.angle)
  };

  // Distance from player to laser origin
  const playerToLaser = {
      x: player.x - laserOrigin.x,
      y: player.y - laserOrigin.y
  };

  // Calculate projection of playerToLaser onto laserDirection
  const projectionLength = (playerToLaser.x * laserDirection.x + playerToLaser.y * laserDirection.y);
  
  if (projectionLength < 0) {
    return false; // Player is behind the laser
}
  // Find the closest point on the laser line to the player
  const closestPoint = {
      x: laserOrigin.x + projectionLength * laserDirection.x,
      y: laserOrigin.y + projectionLength * laserDirection.y
  };

  // Calculate distance from player to closest point on the line
  const distanceToClosestPoint = Math.sqrt(
      Math.pow(closestPoint.x - player.x, 2) +
      Math.pow(closestPoint.y - player.y, 2)
  );


  return distanceToClosestPoint < 4;
}