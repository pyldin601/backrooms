// @flow
export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  p1: Point;
  p2: Point;
  height: number;
  color: string;
}

export interface Sector {
  walls: Wall[];
}

export interface Ray {
  x: number;
  y: number;
  angle: number;
}

export interface RayCross {
  distance: number;
  offset: number;
}

export interface Camera {
  x: number;
  y: number;
  angle: number;
}
