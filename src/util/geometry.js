// @flow
export type Point = {|
  x: number;
  y: number;
|}

export function rotatePoint(point: Point, center: Point, angle: number): Point {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  const translatedPoint = {
    x: point.x - center.x,
    y: point.y - center.y,
  };

  const newPoint = {
    x: translatedPoint.x * c - translatedPoint.y * s,
    y: translatedPoint.x * s + translatedPoint.y * c,
  };

  return {
    x: newPoint.x + center.x,
    y: newPoint.y + center.y,
  };
}

export function movePoint(point: Point, amount: number, angle: number): Point {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return {
    x: point.x - amount * s,
    y: point.y + amount * c,
  };
}
