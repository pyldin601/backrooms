// @flow
import type { Sector, Camera, Ray, Wall, RayCross } from './types';
import { PERSPECTIVE_WIDTH, PERSPECTIVE_HEIGHT } from '../../consts';
import { crossTheWall } from './raycaster';
import { darken } from './color';
import { hasWallPortal, moveCameraInRelationToPortal } from './portal';

export const FOCUS_LENGTH = 0.8;
export const HEIGHT_RATIO = 1.3;
export const RENDER_DISTANCE = 4096;

export const DEFAULT_CEILING_COLOR = '#009aff';
export const DEFAULT_FLOOR_COLOR = '#2a2a2a';

function renderPortal(
  wall: Wall,
  sectors: Sector[],
  ray: Camera,
  camera: Camera,
  screenOffset: number,
  screenWidth: number,
  context: CanvasRenderingContext2D,
) {
  const { portal } = wall;

  if (portal === null || portal === undefined) {
    throw new Error(`Wall expected to have portal`);
  }

  const { sectorId, wallId } = portal;

  const thatWall = sectors[sectorId].walls[wallId];

  const movedCamera = moveCameraInRelationToPortal(wall, thatWall, camera);
  const movedRay = moveCameraInRelationToPortal(wall, thatWall, ray);

  renderColumn(sectorId, sectors, movedRay, movedCamera, screenOffset, screenWidth, context);
}

export function renderColumn(
  sectorId: number,
  sectors: Sector[],
  ray: Ray,
  camera: Camera,
  screenOffset: number,
  screenWidth: number,
  context: CanvasRenderingContext2D,
) {
  let nearestWall = Infinity;

  for (const wall of sectors[sectorId].walls) {
    const rayCross = crossTheWall(ray, wall);

    if (
      rayCross === null ||
      rayCross.distance >= nearestWall ||
      rayCross.distance > RENDER_DISTANCE
    ) {
      continue;
    }

    nearestWall = rayCross.distance;

    const lensDistance = rayCross.distance * Math.cos(camera.angle - ray.angle);
    const heightScale = PERSPECTIVE_HEIGHT / lensDistance;
    const perspectiveHeight = heightScale * (sectors[sectorId].height / HEIGHT_RATIO);

    if (hasWallPortal(wall)) {
      renderPortal(wall, sectors, ray, camera, screenOffset, screenWidth, context);
    } else {
      // Render wall
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

    // Render ceiling
    context.save();
    context.beginPath();
    context.fillStyle = DEFAULT_CEILING_COLOR;
    context.fillRect(screenOffset, 0, screenWidth, PERSPECTIVE_HEIGHT / 2 - perspectiveHeight + 1);
    context.closePath();
    context.fill();
    context.restore();

    // Render floor
    context.save();
    context.beginPath();
    context.fillStyle = DEFAULT_FLOOR_COLOR;
    context.fillRect(
      screenOffset,
      PERSPECTIVE_HEIGHT / 2 + perspectiveHeight - 1,
      screenWidth,
      PERSPECTIVE_HEIGHT / 2 - perspectiveHeight + 1,
    );
    context.closePath();
    context.fill();
    context.restore();
  }
}

export function renderSector(
  context: CanvasRenderingContext2D,
  sectorId: number,
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
    renderColumn(sectorId, sectors, ray, camera, i, 1, context);
  }
}
