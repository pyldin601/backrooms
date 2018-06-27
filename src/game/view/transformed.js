// @flow
import type { GameStateInterface } from '../state';
import { getShortDistanceToLine, rotatePoint } from '../../util/geometry';
import { moveTo, lineTo } from '../../util/render';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../consts';
import { orderBy } from 'lodash';

const playerPosition = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2,
};

function renderPlayer(context: CanvasRenderingContext2D, { player }: GameStateInterface) {
  const x = playerPosition.x;
  const y = playerPosition.y;

  const path = new Path2D();
  moveTo(path, { x, y });
  lineTo(path, { x: x + 5, y });

  context.strokeStyle = '#666666';
  context.stroke(path);
}

function renderMap(context: CanvasRenderingContext2D, { map, player }: GameStateInterface) {
  const { x, y, angle } = player.position;

  const diffX = x - playerPosition.x;
  const diffY = y - playerPosition.y;

  const path = new Path2D();

  const sortedWalls = orderBy(map.walls, wall => getShortDistanceToLine(wall, player.position), 'desc');

  sortedWalls.forEach(wall => {
    moveTo(path, rotatePoint({ x: wall.x1 - diffX, y: wall.y1 - diffY }, playerPosition, -angle));
    lineTo(path, rotatePoint({ x: wall.x2 - diffX, y: wall.y2 - diffY }, playerPosition, -angle));

    context.strokeStyle = wall.color;
    context.stroke(path);
  });
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  renderMap(context, game);
  renderPlayer(context, game);
}
