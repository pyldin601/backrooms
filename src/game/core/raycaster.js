// @flow
import type { Point, Ray, RayCross, Wall } from './types';
import { scale, unscale } from './numbers';
import { rotatePoint } from '../../util/geometry';

export function crossTheWall(ray: Ray, wall: Wall): RayCross | null {
  if (isRayCentered(ray)) {
    if (wall.p1.y <= ray.y && ray.y <= wall.p2.y) {
      const offset = unscale(wall.p1.y, wall.p2.y, ray.y);
      const distance = scale(wall.p1.x, wall.p2.x, offset) - ray.x;

      if (distance < 0) {
        return null;
      }

      return { distance, offset };
    }
    return null;
  }

  return crossTheWall(centerRay(ray), rotateWall(wall, ray, ray.angle));
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

export function rotateWall({ p1, p2, color }: Wall, center: Point, angle: number): Wall {
  return {
    p1: rotatePoint(p1, center, -angle),
    p2: rotatePoint(p2, center, -angle),
    color,
  };
}
