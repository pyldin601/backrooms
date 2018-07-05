// @flow
export interface Point {
  x: number;
  y: number;
}

export interface Portal {
  sector: number;
  wall: number;
}

export interface Wall {
  p1: Point;
  p2: Point;
  color: string;
  portal: Portal;
}

export interface Sector {
  height: number;
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

export interface RenderStats {
  renderedSectors: number;
}
