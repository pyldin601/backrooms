// @flow
import type { GameStateInterface } from '../state';
import { rotatePoint } from '../../util/geometry';
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

  map.sectors.forEach(sector => {
    sector.walls.forEach(wall => {
      moveTo(path, rotatePoint({ x: wall.p1.x - diffX, y: wall.p1.y - diffY }, playerPosition, -angle));
      lineTo(path, rotatePoint({ x: wall.p2.x - diffX, y: wall.p2.y - diffY }, playerPosition, -angle));

      context.strokeStyle = wall.color;
      context.stroke(path);
    });
  });

}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  renderMap(context, game);
  renderPlayer(context, game);
}
