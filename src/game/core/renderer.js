// @flow
import type { Sector, Camera, Ray } from './types';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../consts';
import { crossTheWall } from './raycaster';
import { darken } from './colors';

export const FOV_IN_RADIANS = Math.PI / 2;

export function renderColumn(
  context: CanvasRenderingContext2D,
  sector: Sector,
  ray: Ray,
  camera: Camera,
  screenOffset: number,
) {
  let nearestWall = Infinity;
  for (const wall of sector.walls) {
    const rayCross = crossTheWall(ray, wall);

    if (rayCross === null || rayCross.distance >= nearestWall) {
      continue;
    }

    nearestWall = rayCross.distance;

    const lensDistance = rayCross.distance * Math.cos(camera.angle - ray.angle);
    const perspectiveHeight = (CANVAS_HEIGHT / lensDistance) * (wall.height / 4);

    context.save();

    context.beginPath();
    context.fillStyle = darken(wall.color, rayCross.distance);
    context.fillRect(screenOffset, CANVAS_HEIGHT / 2 - perspectiveHeight, 1, perspectiveHeight * 2);
    context.closePath();
    context.fill();

    context.restore();
  }
}

export function renderSector(context: CanvasRenderingContext2D, sector: Sector, camera: Camera) {
  const startAngle = camera.angle - FOV_IN_RADIANS / 2;

  for (let i = 0; i < CANVAS_WIDTH; i += 1) {
    const angle = startAngle + (FOV_IN_RADIANS / CANVAS_WIDTH) * i;
    const ray = {
      ...camera,
      angle,
    };
    renderColumn(context, sector, ray, camera, i);
  }
}
