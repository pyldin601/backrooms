// @flow
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../consts';
import type { GameStateInterface } from '../state';
import { orderBy } from 'lodash';
import { getShortDistanceToLine } from '../../util/geometry';

function renderMap(context: CanvasRenderingContext2D, { map, player }: GameStateInterface) {
  const { x, y, angle } = player.position;

  const px = x;
  const py = y;

  context.fillStyle = '#cacaca';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 2);

  context.fillStyle = '#2a2a2a';
  context.fillRect(0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);

  const sortedWalls = orderBy(
    map.walls,
    wall => getShortDistanceToLine(wall, player.position),
    'desc',
  );

  sortedWalls.forEach(wall => {
    const vx1 = wall.x1;
    const vy1 = wall.y1;
    const vx2 = wall.x2;
    const vy2 = wall.y2;

    let tx1 = vx1 - px;
    const ty1 = vy1 - py;
    let tx2 = vx2 - px;
    const ty2 = vy2 - py;

    let tz1 = tx1 * Math.cos(angle) + ty1 * Math.sin(angle);
    let tz2 = tx2 * Math.cos(angle) + ty2 * Math.sin(angle);

    if (tz1 <= 0 || tz2 <= 0) {
      return;
    }

    tx1 = tx1 * Math.sin(angle) - ty1 * Math.cos(angle);
    tx2 = tx2 * Math.sin(angle) - ty2 * Math.cos(angle);

    const POV = 32;
    const POV_ = 1;

    const x1 = (-tx1 * POV) / tz1;
    const y1a = -CANVAS_HEIGHT / POV_ / tz1;
    const y1b = CANVAS_HEIGHT / POV_ / tz1;
    const x2 = (-tx2 * POV) / tz2;
    const y2a = -CANVAS_HEIGHT / POV_ / tz2;
    const y2b = CANVAS_HEIGHT / POV_ / tz2;

    context.save();
    context.beginPath();
    context.moveTo(CANVAS_WIDTH / 2 + x1, CANVAS_HEIGHT / 2 + y1a);
    context.lineTo(CANVAS_WIDTH / 2 + x2, CANVAS_HEIGHT / 2 + y2a);
    context.lineTo(CANVAS_WIDTH / 2 + x2, CANVAS_HEIGHT / 2 + y2b);
    context.lineTo(CANVAS_WIDTH / 2 + x1, CANVAS_HEIGHT / 2 + y1b);
    context.lineTo(CANVAS_WIDTH / 2 + x1, CANVAS_HEIGHT / 2 + y1a);
    context.closePath();
    context.fillStyle = wall.color;
    context.fill();

    context.restore();
  });
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  // context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  renderMap(context, game);
}
