// @flow
import type { Wall } from '../game/core/types';

export type Point = {
  x: number,
  y: number,
};

export type Point3D = {
  x: number,
  y: number,
  z: number,
};

export type Line = {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
};

export function projectPerspective(point: Point, angle: number): Point {
  return {
    x: point.x * Math.sin(angle) - point.y * Math.cos(angle),
    y: point.x * Math.cos(angle) + point.y * Math.sin(angle),
  };
}

export function getWallAngle(wall: Wall): number {
  const a = wall.p1.x - wall.p2.x;
  const b = wall.p1.y - wall.p2.y;
  return Math.atan(a / b);
}

export function getWallCenter(wall: Wall): Point {
  return {
    x: (wall.p1.x + wall.p2.x) / 2,
    y: (wall.p1.y + wall.p2.y) / 2,
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
    x: point.x - amount * c,
    y: point.y - amount * s,
  };
}

export function project3DPoint(point: Point3D, camera: Point3D, angle: number): Point {
  const cx = Math.cos(0);
  const sx = Math.sin(0);

  const cy = Math.cos(angle);
  const sy = Math.sin(angle);

  const cz = Math.cos(0);
  const sz = Math.sin(0);

  const dp = {
    x: point.x - camera.x,
    y: point.y - camera.y,
    z: point.z - camera.z,
  };

  const dx = cy * (sz * dp.y + cz * dp.x) - sy * dp.z;
  const dy = sx * (cy * dp.z + sy * (sz * dp.y + cz * dp.x)) + sz * (cz * dp.y - sz * dp.x);
  const dz = cx * (cy * dp.z + sy * (sz * dp.y + cz * dp.x)) - sx * (cz * dp.y - sz * dp.x);

  const ex = 150;
  const ey = 150;
  const ez = 150;

  return {
    x: (dx - ex) * (ez / dz),
    y: (dy - ey) * (ez + dz),
  };
}

export function getDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function getShortDistanceToLine(line: Line, point: Point): number {
  const center = {
    x: (line.x1 + line.x2) / 2,
    y: (line.y1 + line.y2) / 2,
  };
  return getDistance(center, point);
}
