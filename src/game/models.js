// @flow
export type PlayerInterface = {|
  position: {
    x: number;
    y: number;
    angle: number;
  };
|}

export type WallInterface = {|
  x1: number;
  y1: number;
  x2: number;
  y2: number;
|}

export type GameMapInterface = {|
  walls: Array<WallInterface>;
|}

export type GameInterface = {|
  player: PlayerInterface;
  map: GameMapInterface;
|}
