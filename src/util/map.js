import { getRandomColor } from './colors';

const BLOCK_SIZE = 10;

export function createInnerBlock(x, y, width, height) {
  return [
    { p2: { x, y }, p1: { x: x + width, y }, color: getRandomColor(), portal: undefined },
    {
      p2: { x: x + width, y },
      p1: { x: x + width, y: y + height },
      color: getRandomColor(),
      portal: undefined,
    },
    {
      p2: { x: x + width, y: y + height },
      p1: { x, y: y + height },
      color: getRandomColor(),
      portal: undefined,
    },
    { p2: { x, y: y + height }, p1: { x, y }, color: getRandomColor(), portal: undefined },
  ];
}

export function createOuterBlock(x, y, width, height) {
  return [
    { p1: { x, y }, p2: { x: x + width, y }, color: getRandomColor(), portal: undefined },
    {
      p1: { x: x + width, y },
      p2: { x: x + width, y: y + height },
      color: getRandomColor(),
      portal: undefined,
    },
    {
      p1: { x: x + width, y: y + height },
      p2: { x, y: y + height },
      color: getRandomColor(),
      portal: undefined,
    },
    { p1: { x, y: y + height }, p2: { x, y }, color: getRandomColor(), portal: undefined },
  ];
}

export function flatMapToSector(width, height, map) {
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
