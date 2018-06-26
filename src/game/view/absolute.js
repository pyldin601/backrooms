// @flow
import type { GameStateInterface } from '../state';
import { rotatePoint } from '../../util/geometry';
import { moveTo, lineTo } from '../../util/render';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../consts';

function renderPlayer(context: CanvasRenderingContext2D, { player } : GameStateInterface) {
  const { x, y, angle } = player.position;

  const path = new Path2D();
  moveTo(path, rotatePoint({ x, y }, { x, y }, angle));
  lineTo(path, rotatePoint({ x: x + 5, y, }, { x, y }, angle));
  // lineTo(path, rotatePoint({ x: x - 5, y: y + 5 }, { x, y }, angle));

  context.strokeStyle = '#666666';
  context.stroke(path);
}

function renderMap(context: CanvasRenderingContext2D, { map }: GameStateInterface) {
  const path = new Path2D();

  map.walls.forEach(wall => {
    moveTo(path, { x: wall.x1, y: wall.y1 });
    lineTo(path, { x: wall.x2, y: wall.y2 });

    context.strokeStyle = wall.color;
    context.stroke(path);
  });
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  renderMap(context, game);
  renderPlayer(context, game);
}
