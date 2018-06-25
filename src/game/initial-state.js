// @flow
import type { GameStateInterface } from "./state";

const initialState: GameStateInterface = {
  player: {
    position: {
      x: 50,
      y: 50,
      angle: 0,
    },
  },
  map: {
    walls: [
      { x1: 70, y1: 20, x2: 70, y2: 70 },
      // { x1: 40, y1: 40, x2: 260, y2: 40 },
    ],
  },
};

export default initialState;
