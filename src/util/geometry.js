// @flow
export type Point = {|
  x: number;
  y: number;
|}

export type Point3D = {|
  x: number;
  y: number;
  z: number;
|};

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

export function project3DPoint(point: Point3D, camera: Point3D, angle: number): Point {
  const cx = Math.cos(angle);
  const sx = Math.sin(angle);

  const cy = Math.cos(0);
  const sy = Math.cos(0);

  const cz = Math.cos(0);
  const sz = Math.cos(0);

  const dx = cy * (sz * point.y) - sy * point.z;
  const dy = sx * (cy * point.z + sy * (sz * point.y + cz * point.x)) + cx * (cz * point.y - sz * point.x);
  const dz = cx * (cy * point.z + sy * (sz * point.y + cz * point.x)) - sx * (cz * point.y - sz * point.x);

  const ex = 150;
  const ey = 150;
  const ez = 150;

  return {
    x: (ez / dz) * dx + ex,
    y: (ez / dz) * dy + ey,
  };
}
