// @flow
import type { PlayerPosition } from '../state';
import type { Map } from '../core/types';
import { hasWallPortal, moveCameraInRelationToPortal } from '../core/portal';
import { willClipTheWall } from '../core/collision';

export function willPlayerClipTheWall(
  startPlayerPosition: PlayerPosition,
  endPlayerPosition: PlayerPosition,
  sectorId: number,
  wallId: number,
  map: Map,
): boolean {
  const wall = map.sectors[sectorId].walls[wallId];
  if (hasWallPortal(wall)) {
    const { sectorId, wallId } = wall.portal;
    const wallBehindPortal = map.sectors[sectorId].walls[wallId];
    const positionBehindPortal = moveCameraInRelationToPortal(
      wall,
      wallBehindPortal,
      endPlayerPosition,
    );
    return willClipTheWall(startPlayerPosition, positionBehindPortal, wallBehindPortal);
  }
  return willClipTheWall(startPlayerPosition, endPlayerPosition, wall);
}
