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
