export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Portal {
  readonly sectorId: number;
  readonly wallId: number;
}

export interface Wall {
  readonly p1: Point;
  readonly p2: Point;
  readonly color: string;
  readonly portal: Portal | null;
  readonly texture: number;
}

export interface WallWithPortal {
  readonly p1: Point;
  readonly p2: Point;
  readonly color: string;
  readonly portal: Portal;
  readonly texture: number;
}

export interface Sector {
  readonly height: number;
  readonly walls: readonly Wall[];
}

export interface Map {
  readonly sectors: readonly Sector[];
}

export interface Ray {
  readonly x: number;
  readonly y: number;
  readonly angle: number;
}

export interface RayCross {
  readonly distance: number;
  readonly offset: number;
}

export interface Camera {
  readonly x: number;
  readonly y: number;
  readonly angle: number;
}

export interface RenderStats {
  readonly renderedSectors: number;
}
