// @flow
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../consts";
import type { GameStateInterface } from "./state";

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
      { x1: CANVAS_WIDTH / 2 - 20, y1: CANVAS_HEIGHT / 2 - 20, x2: CANVAS_WIDTH / 2 + 20, y2: CANVAS_HEIGHT /2 - 20 },
      { x1: CANVAS_WIDTH / 2 + 20, y1: CANVAS_HEIGHT / 2 - 20, x2: CANVAS_WIDTH / 2 + 20, y2: CANVAS_HEIGHT /2 + 20 },
      { x1: CANVAS_WIDTH / 2 + 20, y1: CANVAS_HEIGHT / 2 + 20, x2: CANVAS_WIDTH / 2 - 20, y2: CANVAS_HEIGHT /2 + 20 },
      { x1: CANVAS_WIDTH / 2 - 20, y1: CANVAS_HEIGHT / 2 - 20, x2: CANVAS_WIDTH / 2 - 20, y2: CANVAS_HEIGHT /2 + 20 },
    ],
  },
};

export default initialState;
