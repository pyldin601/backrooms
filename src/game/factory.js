import { getRandomColor } from '../util/colors';

export function sector(height, walls) {
  return {
    height,
    walls,
  };
}

export function wall(
  p1,
  p2,
  color = getRandomColor(),
  portal = null,
  texture = 0,
) {
  return { p1, p2, color, portal, texture };
}

export function point(x, y) {
  return { x, y };
}

export function portal(sectorId, wallId) {
  return { sectorId, wallId };
}
