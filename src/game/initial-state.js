// @flow
import type { GameStateInterface } from './state';
import { point, portal, sector, wall } from './factory';
import { getRandomColor } from '../util/colors';

export const DEFAULT_HEIGHT = 10;

const initialState: GameStateInterface = {
  player: {
    position: {
      x: 10,
      y: 25,
      angle: 0,
      sectorId: 0,
    },
  },
  map: {
    sectors: [
      sector(DEFAULT_HEIGHT, [
        wall(point(0, 0), point(30, 0)),
        wall(point(30, 0), point(30, 20)),
        wall(point(30, 20), point(30, 30), getRandomColor(), portal(1, 0)),
        wall(point(30, 30), point(30, 50)),
        wall(point(30, 50), point(0, 50)),
        wall(point(0, 50), point(0, 0)),
      ]),
      sector(DEFAULT_HEIGHT - 1, [
        wall(point(40, 0), point(50, 0), getRandomColor(), portal(0, 2)),
        wall(point(50, 0), point(50, 50)),
        wall(point(50, 50), point(40, 50), getRandomColor(), portal(2, 1)),
        wall(point(40, 50), point(40, 0)),
      ]),
      sector(DEFAULT_HEIGHT, [
        wall(point(60, 50), point(60, 30)),
        wall(point(60, 30), point(60, 20), getRandomColor(), portal(1, 2)),
        wall(point(60, 20), point(60, 0)),
        wall(point(60, 0), point(90, 0)),
        wall(point(90, 0), point(90, 10), getRandomColor(), portal(2, 12)),
        wall(point(90, 10), point(80, 10)),
        wall(point(80, 10), point(80, 20)),
        wall(point(80, 20), point(90, 20)),
        wall(point(90, 20), point(90, 30), getRandomColor(), portal(1, 0)),
        wall(point(90, 30), point(80, 30)),
        wall(point(80, 30), point(80, 40)),
        wall(point(80, 40), point(90, 40)),
        wall(point(90, 40), point(90, 50), getRandomColor(), portal(2, 4)),
        wall(point(90, 50), point(60, 50)),
      ]),
    ],
  },
};

export default initialState;
