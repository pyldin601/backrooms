// @flow
import type { Point, Ray, RayCross, Sector, Wall, Camera } from './types';
import { isBetween } from './numbers';
import { rotatePoint } from '../../util/geometry';

export function crossTheWall(ray: Ray, wall: Wall): RayCross | null {
  if (isRayCentered(ray)) {
    if (Math.max(wall.p1.x, wall.p2.x) >= ray.x && isBetween(wall.p1.y, wall.p2.y, ray.y)) {
      const offset =
        (1 / Math.abs(wall.p1.y - wall.p2.y)) * Math.abs(ray.y - Math.min(wall.p1.y, wall.p2.y));
      const distance =
        Math.min(wall.p1.x, wall.p2.x) + Math.abs(wall.p1.x - wall.p2.x) * offset - ray.x;

      return { distance, offset };
    }
    return null;
  }

  return crossTheWall(centerRay(ray), rotateWall(wall, ray, ray.angle));
}

export function getLineWidth(p1: number, p2: number): number {
  return p1 < p2 ? p2 - p1 : p1 - p2;
}

export function rotateRay(ray: Ray, angle: number): Ray {
  return { ...ray, angle };
}

export function centerRay(ray: Ray): Ray {
  return { ...ray, angle: 0 };
}

export function isRayCentered(ray: Ray): boolean {
  return ray.angle === 0;
}

export function rotateWall(wall: Wall, center: Point, angle: number): Wall {
  return {
    p1: rotatePoint(wall.p1, center, -angle),
    p2: rotatePoint(wall.p2, center, -angle),
    color: wall.color,
  };
}
