// @flow
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../consts";
import type { GameStateInterface } from "./state";

const WALL_SIZE = 10;

const initialState: GameStateInterface = {
  player: {
    position: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      angle: 0,
    },
  },
  map: {
    walls: [
      { x1: CANVAS_WIDTH / 2 - WALL_SIZE, y1: CANVAS_HEIGHT / 2 - WALL_SIZE, x2: CANVAS_WIDTH / 2 + WALL_SIZE, y2: CANVAS_HEIGHT /2 - WALL_SIZE, color: 'red' },
      { x1: CANVAS_WIDTH / 2 + WALL_SIZE, y1: CANVAS_HEIGHT / 2 - WALL_SIZE, x2: CANVAS_WIDTH / 2 + WALL_SIZE, y2: CANVAS_HEIGHT /2 + WALL_SIZE, color: 'blue' },
      { x1: CANVAS_WIDTH / 2 + WALL_SIZE, y1: CANVAS_HEIGHT / 2 + WALL_SIZE, x2: CANVAS_WIDTH / 2 - WALL_SIZE, y2: CANVAS_HEIGHT /2 + WALL_SIZE, color: 'white' },
      { x1: CANVAS_WIDTH / 2 - WALL_SIZE, y1: CANVAS_HEIGHT / 2 - WALL_SIZE, x2: CANVAS_WIDTH / 2 - WALL_SIZE, y2: CANVAS_HEIGHT /2 + WALL_SIZE, color: 'yellow' },
    ],
  },
};

export default initialState;
