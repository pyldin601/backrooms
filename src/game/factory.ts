import { getRandomColor } from '../util/colors';
import { IPortal, IWall } from '@/game/map-types';
import { IPoint } from '@/game/geometry-types';

export function sector(height: number, walls: readonly IWall[]) {
  return {
    height,
    walls,
  };
}

export function wall(
  p1: IPoint,
  p2: IPoint,
  color: string = getRandomColor(),
  portal: IPortal | null = null,
  texture: number = 0,
) {
  return { p1, p2, color, portal, texture };
}

export function point(x: IPoint, y: IPoint) {
  return { x, y };
}

export function portal(sectorId: number, wallId: number) {
  return { sectorId, wallId };
}
