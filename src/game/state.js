// @flow
export type PlayerStateInterface = {|
  position: {
    x: number;
    y: number;
    angle: number;
  };
|}

export type WallStateInterface = {|
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
|}

export type MapStateInterface = {|
  walls: Array<WallStateInterface>;
|}

export type GameStateInterface = {|
  player: PlayerStateInterface;
  map: MapStateInterface;
|}

export type KeysStateInterface = {|
  ArrowLeft: boolean,
  ArrowRight: boolean,
  ArrowUp: boolean,
  ArrowDown: boolean,
|};
