// @flow
import type { Sector, Camera, Ray } from './types';
import { PERSPECTIVE_WIDTH, PERSPECTIVE_HEIGHT } from '../../consts';
import { crossTheWall, moveAndRotateCamera } from './raycaster';
import { darken } from './colors';
import { getWallAngle } from '../../util/geometry';

export const FOCUS_LENGTH = 0.8;
export const HEIGHT_RATIO = 1.3;

export const RENDER_ALL_WALLS = true;

export function renderColumn(
  context: CanvasRenderingContext2D,
  sector: number,
  sectors: Sector[],
  ray: Ray,
  camera: Camera,
  screenOffset: number,
  screenWidth: number,
) {
  let nearestWall = Infinity;
  for (const wall of sectors[sector].walls) {
    const rayCross = crossTheWall(ray, wall);

    if (rayCross === null || (!RENDER_ALL_WALLS && rayCross.distance >= nearestWall)) {
      continue;
    }

    nearestWall = rayCross.distance;

    // If wall has portal render column of neighbor sector
    if (wall.portal !== undefined && wall.portal !== null) {
      const thatWall = sectors[wall.portal.sector].walls[wall.portal.wall];

      const thisWallAngle = getWallAngle(wall);
      const thatWallAngle = getWallAngle(thatWall);

      const moveAngle = thisWallAngle - thatWallAngle;
      const moveX = thatWall.p1.x - wall.p2.x;
      const moveY = thatWall.p1.y - wall.p2.y;

      renderColumn(
        context,
        wall.portal.sector,
        sectors,
        moveAndRotateCamera(ray, moveX, moveY, moveAngle, thatWall.p1),
        moveAndRotateCamera(camera, moveX, moveY, moveAngle, thatWall.p1),
        screenOffset,
        screenWidth,
      );
    } else {
      const lensDistance = rayCross.distance * Math.cos(camera.angle - ray.angle);
      const perspectiveHeight =
        (PERSPECTIVE_HEIGHT / lensDistance) * (sectors[sector].height / HEIGHT_RATIO);

      context.save();

      context.beginPath();
      context.fillStyle = darken(wall.color, Math.sqrt(rayCross.distance) * 6);
      context.fillRect(
        screenOffset,
        PERSPECTIVE_HEIGHT / 2 - perspectiveHeight,
        screenWidth,
        perspectiveHeight * 2,
      );
      context.closePath();
      context.fill();

      context.restore();
    }
  }
}

export function renderSector(
  context: CanvasRenderingContext2D,
  sector: number,
  sectors: Sector[],
  camera: Camera,
) {
  for (let i = 0; i < PERSPECTIVE_WIDTH; i += 1) {
    const biasedFraction = i / PERSPECTIVE_WIDTH - 0.5;
    const angle = Math.atan2(biasedFraction, FOCUS_LENGTH) + camera.angle;
    const ray = {
      ...camera,
      angle,
    };
    renderColumn(context, sector, sectors, ray, camera, i, 1);
  }
}
