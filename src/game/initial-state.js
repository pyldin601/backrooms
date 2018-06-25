// @flow
import type { GameStateInterface } from "./state";

const initialState: GameStateInterface = {
  player: {
    position: {
      x: 150,
      y: 150,
      angle: 0.0,
    },
  },
  map: {
    walls: [
      { x1: 20, y1: 20, x2: 280, y2: 20 },
      { x1: 40, y1: 40, x2: 260, y2: 40 },
    ],
  },
};

export default initialState;
