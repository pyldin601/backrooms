// @flow
import type { Sector } from '../game/core/types';

export type PlayerPosition = {|
  x: number;
  y: number;
  angle: number;
  sectorId: number;
|};

export type PlayerStateInterface = {|
  position: PlayerPosition;
|}

export type MapStateInterface = {|
  sectors: Array<Sector>;
|}

export type GameStateInterface = {|
  player: PlayerStateInterface;
  map: MapStateInterface;
|}
