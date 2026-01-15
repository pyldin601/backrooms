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

// Shared texture data for floor/ceiling rendering
interface TextureCache {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
}

let textureCache: TextureCache | null = null;

function getTextureCache(textureImage: CanvasImageSource): TextureCache {
  if (textureCache) return textureCache;

  const offscreen = document.createElement('canvas');
  offscreen.width = (textureImage as HTMLImageElement).width || 384;
  offscreen.height = (textureImage as HTMLImageElement).height || 960;
  const offCtx = offscreen.getContext('2d')!;
  offCtx.drawImage(textureImage, 0, 0);
  const textureData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);

  textureCache = {
    pixels: textureData.data,
    width: textureData.width,
    height: textureData.height,
  };

  return textureCache;
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

// Render floor/ceiling for a single column within clip bounds
function renderFloorCeilingColumn(
  context: CanvasRenderingContext2D,
  imageData: ImageData,
  sector: ISector,
  camera: ICamera,
  ray: IRay,
  screenX: number,
  clipTop: number,
  clipBottom: number,
  textureCache: TextureCache,
) {
  const horizon = PERSPECTIVE_HEIGHT / 2;
  const positionConstant = (PERSPECTIVE_HEIGHT * sector.height) / HEIGHT_RATIO;

  const floorTextureOffset = getTextureOffset(sector.floorTexture);
  const ceilingTextureOffset = getTextureOffset(sector.ceilingTexture);

  const cosAngle = Math.cos(ray.angle);
  const sinAngle = Math.sin(ray.angle);
  const fisheyeCorrection = Math.cos(ray.angle - camera.angle);

  const data = imageData.data;
  const texPixels = textureCache.pixels;
  const texWidth = textureCache.width;

  // Render floor (from horizon down to clipBottom)
  const floorStart = Math.max(Math.ceil(horizon + 1), Math.ceil(clipTop));
  const floorEnd = Math.min(PERSPECTIVE_HEIGHT, Math.floor(clipBottom));

  for (let screenY = floorStart; screenY < floorEnd; screenY++) {
    const rowDistance = positionConstant / (screenY - horizon);
    const realDistance = rowDistance / fisheyeCorrection;

    const worldX = camera.x + realDistance * cosAngle;
    const worldY = camera.y + realDistance * sinAngle;

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

    const texIndex = (texY * texWidth + texX) * 4;
    const pixelIndex = (screenY * PERSPECTIVE_WIDTH + screenX) * 4;

    const darkenFactor = Math.max(0, 1 - realDistance / 150);

    data[pixelIndex] = texPixels[texIndex] * darkenFactor;
    data[pixelIndex + 1] = texPixels[texIndex + 1] * darkenFactor;
    data[pixelIndex + 2] = texPixels[texIndex + 2] * darkenFactor;
    data[pixelIndex + 3] = 255;
  }

  // Render ceiling (from clipTop down to horizon)
  const ceilingStart = Math.max(0, Math.ceil(clipTop));
  const ceilingEnd = Math.min(Math.floor(horizon), Math.floor(clipBottom));

  for (let screenY = ceilingStart; screenY < ceilingEnd; screenY++) {
    const rowDistance = positionConstant / (horizon - screenY);
    const realDistance = rowDistance / fisheyeCorrection;

    const worldX = camera.x + realDistance * cosAngle;
    const worldY = camera.y + realDistance * sinAngle;

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

    const texIndex = (texY * texWidth + texX) * 4;
    const pixelIndex = (screenY * PERSPECTIVE_WIDTH + screenX) * 4;

    const darkenFactor = Math.max(0, 1 - realDistance / 150);

    data[pixelIndex] = texPixels[texIndex] * darkenFactor;
    data[pixelIndex + 1] = texPixels[texIndex + 1] * darkenFactor;
    data[pixelIndex + 2] = texPixels[texIndex + 2] * darkenFactor;
    data[pixelIndex + 3] = 255;
  }
}

function renderPortal(
  wall: IWall,
  sectors: readonly ISector[],
  ray: IRay,
  camera: ICamera,
  screenOffset: number,
  screenWidth: number,
  clipTop: number,
  clipBottom: number,
  context: CanvasRenderingContext2D,
  imageData: ImageData,
  textureImage: CanvasImageSource,
  texCache: TextureCache,
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
    clipTop,
    clipBottom,
    context,
    imageData,
    textureImage,
    texCache,
  );
}

export function renderColumn(
  sectorId: number,
  sectors: readonly ISector[],
  ray: IRay,
  camera: ICamera,
  screenOffset: number,
  screenWidth: number,
  clipTop: number,
  clipBottom: number,
  context: CanvasRenderingContext2D,
  imageData: ImageData,
  textureImage: CanvasImageSource,
  texCache: TextureCache,
) {
  const currentSector = sectors[sectorId];
  const horizon = PERSPECTIVE_HEIGHT / 2;

  let nearestWall = Infinity;
  let wallTop = clipTop;
  let wallBottom = clipBottom;

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

    wallTop = Math.max(clipTop, horizon - perspectiveHeight);
    wallBottom = Math.min(clipBottom, horizon + perspectiveHeight);

    if (hasWallPortal(wall)) {
      const sectorAfterPortal = sectors[wall.portal.sectorId];

      // Calculate portal opening bounds
      const portalPerspectiveHeight = heightScale * (sectorAfterPortal.height / HEIGHT_RATIO);
      const portalTop = Math.max(clipTop, horizon - portalPerspectiveHeight);
      const portalBottom = Math.min(clipBottom, horizon + portalPerspectiveHeight);

      // Render floor/ceiling for the current sector (the parts NOT covered by portal)
      // Ceiling: from clipTop to portalTop
      if (portalTop > clipTop) {
        renderFloorCeilingColumn(
          context,
          imageData,
          currentSector,
          camera,
          ray,
          screenOffset,
          clipTop,
          portalTop,
          texCache,
        );
      }
      // Floor: from portalBottom to clipBottom
      if (portalBottom < clipBottom) {
        renderFloorCeilingColumn(
          context,
          imageData,
          currentSector,
          camera,
          ray,
          screenOffset,
          portalBottom,
          clipBottom,
          texCache,
        );
      }

      // Render the sector through the portal with clipped bounds
      renderPortal(
        wall,
        sectors,
        ray,
        camera,
        screenOffset,
        screenWidth,
        portalTop,
        portalBottom,
        context,
        imageData,
        textureImage,
        texCache,
      );

      // Render wall edges if portal sector is shorter
      if (sectorAfterPortal.height < currentSector.height) {
        context.save();
        context.beginPath();
        context.fillStyle = darken(wall.color, Math.sqrt(rayCross.distance) * 6);
        // Top edge
        context.fillRect(screenOffset, wallTop, screenWidth, portalTop - wallTop);
        // Bottom edge
        context.fillRect(screenOffset, portalBottom, screenWidth, wallBottom - portalBottom);
        context.closePath();
        context.fill();
        context.restore();
      }
    } else {
      // Solid wall - render floor/ceiling for full clip range, then wall on top
      renderFloorCeilingColumn(
        context,
        imageData,
        currentSector,
        camera,
        ray,
        screenOffset,
        clipTop,
        clipBottom,
        texCache,
      );

      // Wall texture is rendered in second pass (renderColumnWallsOnly)
    }
  }
}

export function renderSector(
  context: CanvasRenderingContext2D,
  sectorId: number,
  sectors: readonly ISector[],
  camera: ICamera,
  textureImage: CanvasImageSource,
) {
  // Create ImageData for floor/ceiling pixel manipulation
  const imageData = context.createImageData(PERSPECTIVE_WIDTH, PERSPECTIVE_HEIGHT);
  const texCache = getTextureCache(textureImage);

  // Render each column with integrated floor/ceiling/wall rendering
  for (let i = 0; i < PERSPECTIVE_WIDTH; i += 1) {
    const biasedFraction = i / PERSPECTIVE_WIDTH - 0.5;
    const angle = Math.atan2(biasedFraction, FOCUS_LENGTH) + camera.angle;
    const ray = {
      ...camera,
      angle,
    };
    renderColumn(
      sectorId,
      sectors,
      ray,
      camera,
      i,
      1,
      0, // clipTop: start at screen top
      PERSPECTIVE_HEIGHT, // clipBottom: end at screen bottom
      context,
      imageData,
      textureImage,
      texCache,
    );
  }

  // Draw the floor/ceiling ImageData first
  context.putImageData(imageData, 0, 0);

  // Re-render walls on top (they were drawn to context during column rendering)
  for (let i = 0; i < PERSPECTIVE_WIDTH; i += 1) {
    const biasedFraction = i / PERSPECTIVE_WIDTH - 0.5;
    const angle = Math.atan2(biasedFraction, FOCUS_LENGTH) + camera.angle;
    const ray = {
      ...camera,
      angle,
    };
    renderColumnWallsOnly(sectorId, sectors, ray, camera, i, 1, 0, PERSPECTIVE_HEIGHT, context, textureImage);
  }
}

// Separate function to render only walls (after floor/ceiling ImageData is drawn)
function renderColumnWallsOnly(
  sectorId: number,
  sectors: readonly ISector[],
  ray: IRay,
  camera: ICamera,
  screenOffset: number,
  screenWidth: number,
  clipTop: number,
  clipBottom: number,
  context: CanvasRenderingContext2D,
  textureImage: CanvasImageSource,
) {
  const currentSector = sectors[sectorId];
  const horizon = PERSPECTIVE_HEIGHT / 2;

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

    const wallTop = Math.max(clipTop, horizon - perspectiveHeight);
    const wallBottom = Math.min(clipBottom, horizon + perspectiveHeight);

    if (hasWallPortal(wall)) {
      const sectorAfterPortal = sectors[wall.portal.sectorId];
      const portalPerspectiveHeight = heightScale * (sectorAfterPortal.height / HEIGHT_RATIO);
      const portalTop = Math.max(clipTop, horizon - portalPerspectiveHeight);
      const portalBottom = Math.min(clipBottom, horizon + portalPerspectiveHeight);

      // Render portal walls
      const movedCamera = moveCameraInRelationToPortal(
        wall,
        sectors[wall.portal.sectorId].walls[wall.portal.wallId],
        camera,
      );
      const movedRay = moveCameraInRelationToPortal(
        wall,
        sectors[wall.portal.sectorId].walls[wall.portal.wallId],
        ray,
      );

      renderColumnWallsOnly(
        wall.portal.sectorId,
        sectors,
        movedRay,
        movedCamera,
        screenOffset,
        screenWidth,
        portalTop,
        portalBottom,
        context,
        textureImage,
      );

      // Render wall edges if portal sector is shorter
      if (sectorAfterPortal.height < currentSector.height) {
        context.save();
        context.beginPath();
        context.fillStyle = darken(wall.color, Math.sqrt(rayCross.distance) * 6);
        context.fillRect(screenOffset, wallTop, screenWidth, portalTop - wallTop);
        context.fillRect(screenOffset, portalBottom, screenWidth, wallBottom - portalBottom);
        context.closePath();
        context.fill();
        context.restore();
      }
    } else {
      // Render wall texture with proper clipping
      const wallLength = getDistanceBetweenPoints(wall.p1, wall.p2);
      const textureOffset = TEXTURE_TILE_WIDTH * wall.texture;
      const textureColumnOffset =
        textureOffset + ((wallLength * TEXTURE_MAP_SCALE * rayCross.offset) % TEXTURE_TILE_WIDTH);

      // Calculate unclipped wall bounds
      const unclippedTop = horizon - perspectiveHeight;
      const unclippedBottom = horizon + perspectiveHeight;
      const fullWallHeight = unclippedBottom - unclippedTop;

      // Calculate which portion of the texture is visible
      const texVStart = ((wallTop - unclippedTop) / fullWallHeight) * TEXTURE_TILE_HEIGHT;
      const texVEnd = ((wallBottom - unclippedTop) / fullWallHeight) * TEXTURE_TILE_HEIGHT;
      const texVHeight = texVEnd - texVStart;

      if (texVHeight > 0 && wallBottom > wallTop) {
        context.drawImage(
          textureImage,
          textureColumnOffset,
          texVStart,
          1,
          texVHeight,
          screenOffset,
          wallTop,
          1,
          wallBottom - wallTop,
        );
      }
    }
  }
}

export function renderFloor(
  context: CanvasRenderingContext2D,
  camera: ICamera,
  screenOffset: number,
  screenWidth: number,
  perspectiveHeight: number,
) {
  // No-op - floor rendered per-column now
}

export function renderCeiling(
  context: CanvasRenderingContext2D,
  camera: ICamera,
  screenOffset: number,
  screenWidth: number,
  perspectiveHeight: number,
) {
  // No-op - ceiling rendered per-column now
}
