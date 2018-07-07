// @flow
import type { PlayerPosition } from '../state';
import type { Map } from '../core/types';

export function willPlayerClipTheWall(
  playerOldPos: PlayerPosition,
  playerNewPos: PlayerPosition,
  sectorId: number,
  wallId: number,
  map: Map,
): boolean {
  const wall = map.sectors[sectorId].walls[wallId];

}
