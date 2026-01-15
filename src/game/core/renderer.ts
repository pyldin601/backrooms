import {
  PERSPECTIVE_WIDTH,
  PERSPECTIVE_HEIGHT,
  TEXTURE_MAP_SCALE,
  TEXTURE_TILE_WIDTH,
  TEXTURE_TILE_HEIGHT,
} from '../../consts';
import { crossTheWall } from './raycaster';
import { darken } from './color';
import { hasWallPortal, moveCameraInRelationToPortal } from './portal';
import { getDistanceBetweenPoints } from '../../util/geometry';
import { ICamera, IRay, ISector, IWall } from '@/game/map-types';

export const FOCUS_LENGTH = 0.8;
export const HEIGHT_RATIO = 1.3;
export const RENDER_DISTANCE = 4096;

export const DEFAULT_CEILING_COLOR = '#009aff';
export const DEFAULT_FLOOR_COLOR = '#2a2a2a';

// Texture atlas layout: 6 columns of 64px tiles
const TEXTURE_ATLAS_COLUMNS = 6;

function renderPortal(
  wall: IWall,
  sectors: readonly ISector[],
  ray: IRay,
  camera: ICamera,
  screenOffset: number,
  screenWidth: number,
  context: CanvasRenderingContext2D,
  textureImage: CanvasImageSource,
) {
  const { portal } = wall;

  if (portal === null || portal === undefined) {
    throw new Error(`Wall expected to have portal`);
  }

  const { sectorId, wallId } = portal;

  const thatWall = sectors[sectorId].walls[wallId];

  const movedCamera = moveCameraInRelationToPortal(wall, thatWall, camera);
  const movedRay = moveCameraInRelationToPortal(wall, thatWall, ray);

  renderColumn(
    sectorId,
    sectors,
    movedRay,
    movedCamera,
    screenOffset,
    screenWidth,
    context,
    textureImage,
  );
}

export function renderColumn(
  sectorId: number,
  sectors: readonly ISector[],
  ray: IRay,
  camera: ICamera,
  screenOffset: number,
  screenWidth: number,
  context: CanvasRenderingContext2D,
  textureImage: CanvasImageSource,
) {
  const currentSector = sectors[sectorId];

  let nearestWall = Infinity;

  for (const wall of currentSector.walls) {
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
    const perspectiveHeight = heightScale * (currentSector.height / HEIGHT_RATIO);

    renderCeiling(context, camera, screenOffset, screenWidth, perspectiveHeight);
    renderFloor(context, camera, screenOffset, screenWidth, perspectiveHeight);

    if (hasWallPortal(wall)) {
      const sectorAfterPortal = sectors[wall.portal.sectorId];
      renderPortal(wall, sectors, ray, camera, screenOffset, screenWidth, context, textureImage);
      if (sectorAfterPortal.height < currentSector.height) {
        const portalPerspectiveHeight = heightScale * (sectorAfterPortal.height / HEIGHT_RATIO);
        // render top and bottom parts of wall
        context.save();
        context.beginPath();
        context.fillStyle = darken(wall.color, Math.sqrt(rayCross.distance) * 6);
        context.fillRect(
          screenOffset,
          0,
          screenWidth,
          PERSPECTIVE_HEIGHT / 2 - portalPerspectiveHeight,
        );
        context.fillRect(
          screenOffset,
          PERSPECTIVE_HEIGHT / 2 + portalPerspectiveHeight,
          screenWidth,
          PERSPECTIVE_HEIGHT / 2 + perspectiveHeight,
        );
        context.closePath();
        context.fill();
        context.restore();
      }
    } else {
      // Render wall
      const wallLength = getDistanceBetweenPoints(wall.p1, wall.p2);
      const textureOffset = TEXTURE_TILE_WIDTH * wall.texture;
      const textureColumnOffset =
        textureOffset + ((wallLength * TEXTURE_MAP_SCALE * rayCross.offset) % TEXTURE_TILE_WIDTH);

      context.drawImage(
        textureImage,
        textureColumnOffset,
        1,
        1,
        TEXTURE_TILE_HEIGHT,
        screenOffset,
        PERSPECTIVE_HEIGHT / 2 - perspectiveHeight,
        1,
        perspectiveHeight * 2,
      );
    }
  }
}

// Get texture coordinates from texture index
function getTextureOffset(textureIndex: number) {
  const col = textureIndex % TEXTURE_ATLAS_COLUMNS;
  const row = Math.floor(textureIndex / TEXTURE_ATLAS_COLUMNS);
  return {
    x: col * TEXTURE_TILE_WIDTH,
    y: row * TEXTURE_TILE_HEIGHT,
  };
}

// Render textured floor and ceiling for the entire sector
export function renderFloorAndCeiling(
  context: CanvasRenderingContext2D,
  sector: ISector,
  camera: ICamera,
  textureImage: CanvasImageSource,
) {
  const horizon = PERSPECTIVE_HEIGHT / 2;
  const playerHeight = sector.height / (2 * HEIGHT_RATIO);

  const floorTextureOffset = getTextureOffset(sector.floorTexture);
  const ceilingTextureOffset = getTextureOffset(sector.ceilingTexture);

  // Create ImageData for pixel-level manipulation
  const imageData = context.createImageData(PERSPECTIVE_WIDTH, PERSPECTIVE_HEIGHT);
  const data = imageData.data;

  // We need to read from the texture - create an offscreen canvas
  const offscreen = document.createElement('canvas');
  offscreen.width = (textureImage as HTMLImageElement).width || 384;
  offscreen.height = (textureImage as HTMLImageElement).height || 64;
  const offCtx = offscreen.getContext('2d')!;
  offCtx.drawImage(textureImage, 0, 0);
  const textureData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
  const texPixels = textureData.data;
  const texWidth = textureData.width;

  for (let screenX = 0; screenX < PERSPECTIVE_WIDTH; screenX++) {
    // Calculate ray angle for this column
    const biasedFraction = screenX / PERSPECTIVE_WIDTH - 0.5;
    const rayAngle = Math.atan2(biasedFraction, FOCUS_LENGTH) + camera.angle;
    const cosAngle = Math.cos(rayAngle);
    const sinAngle = Math.sin(rayAngle);
    const fisheyeCorrection = Math.cos(rayAngle - camera.angle);

    // Render floor (bottom half)
    for (let screenY = horizon + 1; screenY < PERSPECTIVE_HEIGHT; screenY++) {
      const rowDistance = playerHeight / ((screenY - horizon) / PERSPECTIVE_HEIGHT);
      const realDistance = rowDistance / fisheyeCorrection;

      // Calculate world coordinates
      const worldX = camera.x + realDistance * cosAngle;
      const worldY = camera.y + realDistance * sinAngle;

      // Calculate texture coordinates
      const texX = Math.floor(
        floorTextureOffset.x +
          ((((worldX * TEXTURE_MAP_SCALE) % TEXTURE_TILE_WIDTH) + TEXTURE_TILE_WIDTH) %
            TEXTURE_TILE_WIDTH),
      );
      const texY = Math.floor(
        floorTextureOffset.y +
          ((((worldY * TEXTURE_MAP_SCALE) % TEXTURE_TILE_HEIGHT) + TEXTURE_TILE_HEIGHT) %
            TEXTURE_TILE_HEIGHT),
      );

      // Sample texture
      const texIndex = (texY * texWidth + texX) * 4;
      const pixelIndex = (screenY * PERSPECTIVE_WIDTH + screenX) * 4;

      // Apply distance-based darkening
      const darkenFactor = Math.max(0, 1 - realDistance / 150);

      data[pixelIndex] = texPixels[texIndex] * darkenFactor;
      data[pixelIndex + 1] = texPixels[texIndex + 1] * darkenFactor;
      data[pixelIndex + 2] = texPixels[texIndex + 2] * darkenFactor;
      data[pixelIndex + 3] = 255;
    }

    // Render ceiling (top half)
    for (let screenY = 0; screenY < horizon; screenY++) {
      const rowDistance = playerHeight / ((horizon - screenY) / PERSPECTIVE_HEIGHT);
      const realDistance = rowDistance / fisheyeCorrection;

      // Calculate world coordinates
      const worldX = camera.x + realDistance * cosAngle;
      const worldY = camera.y + realDistance * sinAngle;

      // Calculate texture coordinates
      const texX = Math.floor(
        ceilingTextureOffset.x +
          ((((worldX * TEXTURE_MAP_SCALE) % TEXTURE_TILE_WIDTH) + TEXTURE_TILE_WIDTH) %
            TEXTURE_TILE_WIDTH),
      );
      const texY = Math.floor(
        ceilingTextureOffset.y +
          ((((worldY * TEXTURE_MAP_SCALE) % TEXTURE_TILE_HEIGHT) + TEXTURE_TILE_HEIGHT) %
            TEXTURE_TILE_HEIGHT),
      );

      // Sample texture
      const texIndex = (texY * texWidth + texX) * 4;
      const pixelIndex = (screenY * PERSPECTIVE_WIDTH + screenX) * 4;

      // Apply distance-based darkening
      const darkenFactor = Math.max(0, 1 - realDistance / 150);

      data[pixelIndex] = texPixels[texIndex] * darkenFactor;
      data[pixelIndex + 1] = texPixels[texIndex + 1] * darkenFactor;
      data[pixelIndex + 2] = texPixels[texIndex + 2] * darkenFactor;
      data[pixelIndex + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);
}

export function renderSector(
  context: CanvasRenderingContext2D,
  sectorId: number,
  sectors: readonly ISector[],
  camera: ICamera,
  textureImage: CanvasImageSource,
) {
  const currentSector = sectors[sectorId];

  // First pass: render textured floor and ceiling
  renderFloorAndCeiling(context, currentSector, camera, textureImage);

  // Second pass: render walls on top
  for (let i = 0; i < PERSPECTIVE_WIDTH; i += 1) {
    const biasedFraction = i / PERSPECTIVE_WIDTH - 0.5;
    const angle = Math.atan2(biasedFraction, FOCUS_LENGTH) + camera.angle;
    const ray = {
      ...camera,
      angle,
    };
    renderColumn(sectorId, sectors, ray, camera, i, 1, context, textureImage);
  }
}

export function renderFloor(
  context: CanvasRenderingContext2D,
  camera: ICamera,
  screenOffset: number,
  screenWidth: number,
  perspectiveHeight: number,
) {
  // Now a no-op since floor is rendered in renderFloorAndCeiling
}

export function renderCeiling(
  context: CanvasRenderingContext2D,
  camera: ICamera,
  screenOffset: number,
  screenWidth: number,
  perspectiveHeight: number,
) {
  // Now a no-op since ceiling is rendered in renderFloorAndCeiling
}
