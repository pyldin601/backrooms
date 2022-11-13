import { scale, unscale } from './numbers';
import { rotatePoint } from '../../util/geometry';

export function isWallInFrontIfCamera(wall, camera) {
  return wall.p1.y <= camera.y && camera.y <= wall.p2.y;
}

export function crossTheWall(ray, wall) {
  if (!isRayCentered(ray)) {
    return crossTheWall(centerRay(ray), rotateWall(wall, ray, -ray.angle));
  }

  if (!isWallInFrontIfCamera(wall, ray)) {
    return null;
  }

  const offset = unscale(wall.p1.y, wall.p2.y, ray.y);
  const distance = scale(wall.p1.x, wall.p2.x, offset) - ray.x;

  if (distance < 0) {
    return null;
  }

  return { distance, offset };
}

export function centerRay(ray) {
  return { ...ray, angle: 0 };
}

export function isRayCentered(ray) {
  return ray.angle === 0;
}

export function rotateWall({ p1, p2, color, portal }, center, angle) {
  return {
    p1: rotatePoint(p1, center, angle),
    p2: rotatePoint(p2, center, angle),
    color,
    portal,
  };
}
