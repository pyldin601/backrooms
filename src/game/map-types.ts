import { IPoint } from '@/game/geometry-types';

export interface IWall {
  p1: IPoint;
  p2: IPoint;
  color: string;
  portal: IPortal | null;
  texture: number;
}

export interface IWallWithPortal extends IWall {
  portal: IPortal;
}

export interface IPortal {
  sectorId: number;
  wallId: number;
}

export interface ICamera {
  x: number;
  y: number;
  angle: number;
}

export interface IRay {
  x: number;
  y: number;
  angle: number;
}

export interface ISector {
  height: number;
  walls: readonly IWall[];
}

export interface IPlayer {
  position: {
    x: number;
    y: number;
    z: number;
    angle: number;
    sectorId: number;
  };
}

export interface IMap {
  sectors: readonly ISector[];
}

export interface IGameState {
  player: IPlayer;
  map: IMap;
}
