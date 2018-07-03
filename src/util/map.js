//@flow
import { getRandomColor } from './colors';
import type { Sector, Wall } from '../game/core/types';

const BLOCK_SIZE = 10;

export function createInnerBlock(x: number, y: number, width: number, height: number): Wall[] {
  return [
    { p2: { x: x, y: y }, p1: { x: x + width, y: y }, color: getRandomColor(), portal: undefined },
    {
      p2: { x: x + width, y: y },
      p1: { x: x + width, y: y + height },
      color: getRandomColor(),
      portal: undefined,
    },
    {
      p2: { x: x + width, y: y + height },
      p1: { x: x, y: y + height },
      color: getRandomColor(),
      portal: undefined,
    },
    { p2: { x: x, y: y + height }, p1: { x: x, y: y }, color: getRandomColor(), portal: undefined },
  ];
}

export function createOuterBlock(x: number, y: number, width: number, height: number): Wall[] {
  return [
    { p1: { x: x, y: y }, p2: { x: x + width, y: y }, color: getRandomColor(), portal: undefined },
    {
      p1: { x: x + width, y: y },
      p2: { x: x + width, y: y + height },
      color: getRandomColor(),
      portal: undefined,
    },
    {
      p1: { x: x + width, y: y + height },
      p2: { x: x, y: y + height },
      color: getRandomColor(),
      portal: undefined,
    },
    { p1: { x: x, y: y + height }, p2: { x: x, y: y }, color: getRandomColor(), portal: undefined },
  ];
}

export function flatMapToSector(width: number, height: number, map: any[][]): Sector {
  const sector = {
    walls: [...createOuterBlock(0, 0, width, height)],
    height: BLOCK_SIZE,
  };
  for (let x = 0; x < map.length; x += 1) {
    for (let y = 0; y < map[x].length; y += 1) {
      if (map[x][y] > 1) {
        sector.walls.push(
          ...createInnerBlock((x + 1) * BLOCK_SIZE, (y + 1) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE),
        );
      }
    }
  }
  return sector;
}
