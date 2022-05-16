import type { Sector } from './core/types';

export type PlayerPosition = {
  x: number;
  y: number;
  z: number;
  angle: number;
  sectorId: number;
};

export type PlayerStateInterface = {
  position: PlayerPosition;
};

export type MapStateInterface = {
  sectors: Array<Sector>;
};

export type GameStateInterface = {
  player: PlayerStateInterface;
  map: MapStateInterface;
};
