import { scale, unscale } from './numbers';
import { rotatePoint } from '../../util/geometry';
import { ICamera, IRay, IWall } from '@/game/map-types';
import { IPoint } from '@/game/geometry-types';

export function isWallInFrontIfCamera(wall: IWall, camera: ICamera | IRay) {
  return wall.p1.y <= camera.y && camera.y <= wall.p2.y;
}

export interface IRayCross {
  distance: number;
  offset: number;
}

export function crossTheWall(ray: IRay, wall: IWall): IRayCross | null {
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

export function centerRay(ray: IRay) {
  return { ...ray, angle: 0 };
}

export function isRayCentered(ray: IRay) {
  return ray.angle === 0;
}

export function rotateWall({ p1, p2, ...other }: IWall, center: IPoint, angle: number) {
  return {
    ...other,
    p1: rotatePoint(p1, center, angle),
    p2: rotatePoint(p2, center, angle),
  };
}
