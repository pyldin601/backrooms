// @flow
import type { GameStateInterface } from '../state';
import { project3DPoint } from '../../util/geometry';
import { moveTo, lineTo } from '../../util/render';

function renderMap(context: CanvasRenderingContext2D, { map, player }: GameStateInterface) {
  const { x, y, angle } = player.position;

  const path = new Path2D();

  map.walls.forEach(wall => {
    moveTo(path, project3DPoint({ x: wall.x1, y: wall.y1, z: 140 }, { x, y, z: 0 }, angle));
    lineTo(path, project3DPoint({ x: wall.x1, y: wall.y1, z: 160 }, { x, y, z: 0 }, angle));
    lineTo(path, project3DPoint({ x: wall.x2, y: wall.y2, z: 160 }, { x, y, z: 0 }, angle));
    lineTo(path, project3DPoint({ x: wall.x2, y: wall.y2, z: 140 }, { x, y, z: 0 }, angle));
    lineTo(path, project3DPoint({ x: wall.x1, y: wall.y1, z: 140 }, { x, y, z: 0 }, angle));
  });

  context.strokeStyle = '#aabb00';
  context.stroke(path);
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  context.clearRect(0, 0, 300, 300);
  renderMap(context, game);
}
