
function area(a, b, c) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function _intersect(a, b, c, d) {
  const [x1, x2] = (a > b) ? [b, a] : [a, b];
  const [x3, x4] = (c > d) ? [d, c] : [c, d];

  return Math.max(x1, x3) <= Math.min(x2, x4);
}

function intersect(p1, p2, p3, p4) {
  return _intersect(p1.x, p2.x, p3.x, p4.x)
    && _intersect(p1.y, p2.y, p3.y, p4.y)
    && area(p1, p2, p3) * area(p1, p2, p4) <= 0
    && area(p3, p4, p1) * area(p3, p4, p2) <= 0;
}

export function willClipTheWall(startPoint, endPoint, wall) {
  return intersect(startPoint, endPoint, wall.p1, wall.p2);
}
