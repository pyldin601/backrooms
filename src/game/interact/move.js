// @flow
import type { PlayerPosition } from '../state';
import type { Map, Sector, Wall } from '../core/types';
import { isPortal, moveCameraInRelationToPortal } from '../core/portal';
import { willClipTheWall } from '../core/collision';
import { movePoint } from '../../util/geometry';

export function movePlayerOnMap(
  playerPosition: PlayerPosition,
  step: number,
  angle: number,
  sectorId: number,
  sector: Sector,
  map: Map,
): PlayerPosition {
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

  return playerPosition;
}

export function makeSectorBehindPortal(map: Map, sectorId: number, wallId: number): Sector {
  const sector = map.sectors[sectorId];
  return {
    ...sector,
    walls: sector.walls.filter((_, index) => index !== wallId),
  };
}

export function movePlayer(
  playerPosition: PlayerPosition,
  step: number,
  angle: number,
): PlayerPosition {
  return { ...playerPosition, ...movePoint(playerPosition, step, angle) };
}

export function movePlayerThroughPortal(
  playerPosition: PlayerPosition,
  thisWall: Wall,
  thatWall: Wall,
  sectorIdBehindPortal: number,
): PlayerPosition {
  return {
    ...playerPosition,
    ...moveCameraInRelationToPortal(thisWall, thatWall, playerPosition),
    sectorId: sectorIdBehindPortal,
  };
}
