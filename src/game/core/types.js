// @flow
export interface Point {
  x: number;
  y: number;
}

export interface Portal {
  sectorId: number;
  wallId: number;
}

export interface Wall {
  p1: Point;
  p2: Point;
  color: string;
  portal: ?Portal;
}

export interface Sector {
  height: number;
  walls: Wall[];
}

export interface Map {
  sectors: Sector[];
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
