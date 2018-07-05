// @flow
import type { Sector, Camera, Ray, Wall, RayCross } from './types';
import { PERSPECTIVE_WIDTH, PERSPECTIVE_HEIGHT } from '../../consts';
import { crossTheWall, moveAndRotateCamera } from './raycaster';
import { darken } from './colors';
import { getWallAngle, getWallCenter } from '../../util/geometry';

export const FOCUS_LENGTH = 0.8;
export const HEIGHT_RATIO = 1.3;

function renderPortal(
  wall: Wall,
  sectors: Sector[],
  ray: Camera,
  camera: Camera,
  screenOffset: number,
  screenWidth: number,
  context: CanvasRenderingContext2D,
) {
  const { portal: { wallId, sectorId } } = wall;

  const thatWall = sectors[sectorId].walls[wallId];

  const thisWallAngle = getWallAngle(wall);
  const thatWallAngle = getWallAngle(thatWall);

  const thisWallCenter = getWallCenter(wall);
  const thatWallCenter = getWallCenter(thatWall);

  const angleDiff = thisWallAngle - thatWallAngle;
  const moveX = thisWallCenter.x - thatWallCenter.x;
  const moveY = thisWallCenter.y - thatWallCenter.y;

  renderColumn(
    context,
    sectorId,
    sectors,
    moveAndRotateCamera(ray, -moveX, -moveY, -angleDiff, thatWallCenter),
    moveAndRotateCamera(camera, -moveX, -moveY, -angleDiff, thatWallCenter),
    screenOffset,
    screenWidth,
  );
}

function renderWall(
  rayCross: RayCross,
  camera: Camera,
  ray: Camera,
  sectors: Sector[],
  sector: number,
  wall: Wall,
  screenOffset: number,
  screenWidth: number,
  context: CanvasRenderingContext2D,
) {
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

    if (rayCross === null || rayCross.distance >= nearestWall) {
      continue;
    }

    nearestWall = rayCross.distance;

    if (wall.portal) {
      renderPortal(wall, sectors, ray, camera, screenOffset, screenWidth, context);
    } else {
      renderWall(rayCross, camera, ray, sectors, sector, wall, screenOffset, screenWidth, context);
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
