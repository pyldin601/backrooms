// @flow
import type { Sector, Camera, Ray } from './types';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../consts';
import { crossTheWall } from './raycaster';

export const FOV_IN_RADIANS = Math.PI / 2;
export const RAY_WIDTH = 1;

export function renderColumn(
  context: CanvasRenderingContext2D,
  sector: Sector,
  ray: Ray,
  screenOffset: number,
  rayWidth: number,
) {
  for (const wall of sector.walls) {
    const rayCross = crossTheWall(ray, wall);

    if (rayCross === null) {
      continue;
    }

    const wallViewHeight = CANVAS_HEIGHT / rayCross.distance;

    context.save();

    context.beginPath();
    context.fillStyle = wall.color;
    context.fillRect(screenOffset, CANVAS_HEIGHT / 2 - wallViewHeight, rayWidth, wallViewHeight * 2);
    context.closePath();
    context.fill();

    context.restore();
  }
}

export function renderSector(context: CanvasRenderingContext2D, sector: Sector, camera: Camera) {
  const startAngle = camera.angle - FOV_IN_RADIANS / 2;
  //
  // for (let i = 0; i < CANVAS_WIDTH; i += RAY_WIDTH) {
  //   const ray = { ...camera, angle: startAngle + (FOV_IN_RADIANS / CANVAS_WIDTH) * i };
  //   renderColumn(context, sector, ray, i * RAY_WIDTH, RAY_WIDTH);
  // }
  renderColumn(context, sector, camera, 0, CANVAS_WIDTH);
}
