// @flow
import type { Wall, Sector, Portal, Point } from './core/types';
import { getRandomColor } from '../util/colors';

export function sector(height: number, walls: Wall[]): Sector {
  return {
    height,
    walls,
  };
}

export function wall(
  p1: Point,
  p2: Point,
  color: string = getRandomColor(),
  portal: ?Portal = null,
): Wall {
  return { p1, p2, color, portal };
}

export function point(x: number, y: number): Point {
  return { x, y };
}

export function portal(sectorId: number, wallId: number): Portal {
  return { sectorId, wallId };
}
