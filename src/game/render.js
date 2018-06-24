// @flow
import type { GameStateInterface, MapStateInterface, PlayerStateInterface } from './state';
import { rotatePoint } from '../util/geometry';
import type { Point } from '../util/geometry';

const moveTo = (context, { x, y }: Point) => context.moveTo(x, y);
const lineTo = (context, { x, y }: Point) => context.lineTo(x, y);

function renderPlayer(context: CanvasRenderingContext2D, { player } : GameStateInterface) {
  const { x, y, angle } = player.position;

  const path = new Path2D();
  moveTo(path, rotatePoint({ x: x - 5, y: y + 5 }, { x, y }, angle));
  lineTo(path, rotatePoint({ x, y: y - 5 }, { x, y }, angle));
  lineTo(path, rotatePoint({ x: x + 5, y: y + 5 }, { x, y }, angle));

  context.strokeStyle = '#666666';
  context.stroke(path);
}

function renderMap(context: CanvasRenderingContext2D, { map }: GameStateInterface) {
  const path = new Path2D();

  map.walls.forEach(wall => {
    console.log(wall);
    moveTo(path, { x: wall.x1, y: wall.y1 });
    lineTo(path, { x: wall.x2, y: wall.y2 });
  });

  context.strokeStyle = '#aabb00';
  context.stroke(path);
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  context.clearRect(0, 0, 300, 300);
  renderMap(context, game);
  renderPlayer(context, game);
}
