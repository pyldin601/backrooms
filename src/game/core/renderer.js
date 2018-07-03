// @flow
import type { Sector, Camera, Ray } from './types';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../consts';
import { crossTheWall } from './raycaster';
import { darken } from './colors';

export const FOCUS_LENGTH = .8;
export const HEIGHT_RATIO = 2.66;

export function renderColumn(
  context: CanvasRenderingContext2D,
  sector: Sector,
  ray: Ray,
  camera: Camera,
  screenOffset: number,
  screenWidth: number,
) {
  let nearestWall = Infinity;
  for (const wall of sector.walls) {
    const rayCross = crossTheWall(ray, wall);

    if (rayCross === null || rayCross.distance <= 0 || rayCross.distance >= nearestWall) {
      continue;
    }

    nearestWall = rayCross.distance;

    const lensDistance = rayCross.distance * Math.cos(camera.angle - ray.angle);
    const perspectiveHeight = (CANVAS_HEIGHT / lensDistance) * (sector.height / HEIGHT_RATIO);

    context.save();

    context.beginPath();
    context.fillStyle = darken(wall.color, rayCross.distance);
    context.fillRect(
      screenOffset,
      CANVAS_HEIGHT / 2 - perspectiveHeight,
      screenWidth,
      perspectiveHeight * 2,
    );
    context.closePath();
    context.fill();

    context.restore();
  }
}

export function renderSector(context: CanvasRenderingContext2D, sector: Sector, camera: Camera) {
  for (let i = 0; i < CANVAS_WIDTH; i += 1) {
    const biasedFraction = i / CANVAS_WIDTH - .5;
    const angle = Math.atan2(biasedFraction, FOCUS_LENGTH) + camera.angle;
    const ray = {
      ...camera,
      angle,
    };
    renderColumn(context, sector, ray, camera, i, 1);
  }
}
