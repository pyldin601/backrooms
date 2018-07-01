// @flow
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../consts";
import { generateWallArrayFromPointsArray } from "../util/map";
import type { GameStateInterface } from "./state";

const WALL_SIZE = 10;

const initialMapPoints = [
  // {x: CANVAS_WIDTH / 2 - 20, y: CANVAS_HEIGHT / 2 - 20},
  // {x: CANVAS_WIDTH / 2 - 10, y: CANVAS_HEIGHT / 2 - 20},
  // {x: CANVAS_WIDTH / 2 - 10, y: CANVAS_HEIGHT / 2 - 10},
  // {x: CANVAS_WIDTH / 2 + 10, y: CANVAS_HEIGHT / 2 - 10},
  // {x: CANVAS_WIDTH / 2 + 10, y: CANVAS_HEIGHT / 2 - 20},
  // {x: CANVAS_WIDTH / 2 + 20, y: CANVAS_HEIGHT / 2 - 20},
  // {x: CANVAS_WIDTH / 2 + 20, y: CANVAS_HEIGHT / 2 + 10},
  // {x: CANVAS_WIDTH / 2 + 10, y: CANVAS_HEIGHT / 2 + 20},
  // {x: CANVAS_WIDTH / 2 - 10, y: CANVAS_HEIGHT / 2 + 20},
  {x: CANVAS_WIDTH / 2 - 20, y: CANVAS_HEIGHT / 2 + 10},
  {x: CANVAS_WIDTH / 2 - 20, y: CANVAS_HEIGHT / 2 - 20},
];

const initialWalls = generateWallArrayFromPointsArray(initialMapPoints);

const initialState: GameStateInterface = {
  player: {
    position: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      angle: 0,
    },
  },
  map: {
    walls: initialWalls
  },
};

export default initialState;
