// @flow
import type { Sector } from '../game/core/types';

export type PlayerStateInterface = {|
  position: {
    x: number;
    y: number;
    angle: number;
    sectorId: number;
  };
|}

export type MapStateInterface = {|
  sectors: Array<Sector>;
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
