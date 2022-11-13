import { isPortal, moveCameraInRelationToPortal } from '../core/portal';
import { willClipTheWall } from '../core/collision';
import { movePoint, AXES } from '../../util/geometry';

export function movePlayerOnMap(
  playerPosition,
  step,
  angle,
  sectorId,
  sector,
  map,
) {
  const newPlayerPosition = movePlayer(playerPosition, step, angle);
  const clippedWall = sector.walls.find(wall =>
    willClipTheWall(playerPosition, newPlayerPosition, wall),
  );

  if (!clippedWall) {
    return newPlayerPosition;
  }

  if (isPortal(clippedWall.portal)) {
    const { sectorId, wallId } = clippedWall.portal;
    const wallBehindPortal = map.sectors[sectorId].walls[wallId];
    const sectorBehindWall = makeSectorBehindPortal(map, sectorId, wallId);
    const playerPositionBehindPortal = movePlayerThroughPortal(
      playerPosition,
      clippedWall,
      wallBehindPortal,
      sectorId,
    );
    return movePlayerOnMap(
      playerPositionBehindPortal,
      step,
      angle - (playerPosition.angle - playerPositionBehindPortal.angle),
      sectorId,
      sectorBehindWall,
      map,
    );
  }

  // Move each axis separately to slip along walls
  return AXES.reduce((playerPosition, axis) => {
    const newPlayerPosition = movePlayer(playerPosition, step, angle, axis);
    const hasClippings = sector.walls.some(wall =>
      willClipTheWall(playerPosition, newPlayerPosition, wall),
    );
    return hasClippings ? playerPosition : newPlayerPosition;
  }, playerPosition);
}

export function makeSectorBehindPortal(map, sectorId, wallId) {
  const sector = map.sectors[sectorId];

  return {
    ...sector,
    walls: sector.walls.filter((_, index) => index !== wallId),
  };
}

export function movePlayer(
  playerPosition,
  step,
  angle,
  axis,
) {
  return { ...playerPosition, ...movePoint(playerPosition, step, angle, axis) };
}

export function movePlayerThroughPortal(
  playerPosition,
  thisWall,
  thatWall,
  sectorIdBehindPortal,
) {
  return {
    ...playerPosition,
    ...moveCameraInRelationToPortal(thisWall, thatWall, playerPosition),
    sectorId: sectorIdBehindPortal,
  };
}
