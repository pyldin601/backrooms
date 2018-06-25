// @flow
export type Point = {|
  x: number,
  y: number,
|};

export type Point3D = {|
  x: number,
  y: number,
  z: number,
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
  const cx = Math.cos(0);
  const sx = Math.sin(0);

  const cy = Math.cos(angle);
  const sy = Math.sin(angle);

  const cz = Math.cos(0);
  const sz = Math.sin(0);

  const deltaPoint = {
    x: point.x - camera.x,
    y: point.y - camera.y,
    z: point.z - camera.z,
  };

  const dx = cy * (sz * deltaPoint.y + cz * deltaPoint.x) - sy * deltaPoint.z;
  const dy = sx * (cy * deltaPoint.z + sy * (sz * deltaPoint.y) + cz * deltaPoint.x) + sz * (cz * deltaPoint.y - sz * deltaPoint.x);
  const dz = cx * (cy * deltaPoint.z + sy * (sz * deltaPoint.y) + cz * deltaPoint.x) - sx * (cz * deltaPoint.y - sz * deltaPoint.x);

  const ex = 150;
  const ey = 150;
  const ez = 150;

  return {
    x: (dx - ex) * (ez / dz),
    y: (dy - ey) * (ez + dz),
  };
}
