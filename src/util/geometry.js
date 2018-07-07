// @flow
export type Point = {
  x: number,
  y: number,
};

export type Line = {
  p1: Point,
  p2: Point,
};

export function getLineAngle(line: Line): number {
  const a = line.p1.x - line.p2.x;
  const b = line.p1.y - line.p2.y;
  return Math.atan2(a, b);
}

export function getLineCenter(line: Line): Point {
  return {
    x: (line.p1.x + line.p2.x) / 2,
    y: (line.p1.y + line.p2.y) / 2,
  };
}

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
    x: point.x + amount * c,
    y: point.y + amount * s,
  };
}
