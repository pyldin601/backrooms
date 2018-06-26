// @flow
import type { GameStateInterface } from '../state';
import { rotatePoint } from '../../util/geometry';
import { moveTo, lineTo } from '../../util/render';

const playerPosition = {
  x: 50,
  y: 50,
};

function renderPlayer(context: CanvasRenderingContext2D, { player } : GameStateInterface) {
  const x = playerPosition.x;
  const y = playerPosition.y;

  const path = new Path2D();
  moveTo(path, { x, y });
  lineTo(path, { x: x + 5, y, });
  
  context.strokeStyle = '#666666';
  context.stroke(path);
}

function renderMap(context: CanvasRenderingContext2D, { map, player }: GameStateInterface) {
  const { x, y, angle } = player.position;

  const diffX = x - playerPosition.x;
  const diffY = y - playerPosition.y;

  const path = new Path2D();

  map.walls.forEach(wall => {
    moveTo(path, rotatePoint({ x: wall.x1 - diffX, y: wall.y1 - diffY }, playerPosition, -angle));
    lineTo(path, rotatePoint({ x: wall.x2 - diffX, y: wall.y2 - diffY }, playerPosition, -angle));
  });

  context.strokeStyle = '#aabb00';
  context.stroke(path);
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  context.clearRect(0, 0, 300, 300);
  renderMap(context, game);
  renderPlayer(context, game);
}
