// @flow
import type { GameInterface } from "./models";

const initialState: GameInterface = {
  player: {
    position: {
      x: 0,
      y: 0,
      angle: 0.0,
    },
  },
  map: {
    walls: [
      { x1: -20, y1: 20, x2: 20, y2: 20 },
    ],
  },
};

export default initialState;
