// @flow
import { orderBy } from 'lodash';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../consts';
import type { GameStateInterface } from '../state';
import { getShortDistanceToLine, projectPerspective } from '../../util/geometry';
import { renderSector } from '../core/renderer';

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
    const relativeP1 = {
      x: wall.x1 - px,
      y: wall.y1 - py,
    };

    const relativeP2 = {
      x: wall.x2 - px,
      y: wall.y2 - py,
    };

    const perspectiveP1 = projectPerspective(relativeP1, angle);
    const perspectiveP2 = projectPerspective(relativeP2, angle);

    if (perspectiveP1.y <= 0 || perspectiveP2.y <= 0) {
      return;
    }

    const POV = 32;
    const POV_ = 1;

    const x1 = (-perspectiveP1.x * POV) / perspectiveP1.y;
    const y1a = -CANVAS_HEIGHT / POV_ / perspectiveP1.y;
    const y1b = CANVAS_HEIGHT / POV_ / perspectiveP1.y;
    const x2 = (-perspectiveP2.x * POV) / perspectiveP2.y;
    const y2a = -CANVAS_HEIGHT / POV_ / perspectiveP2.y;
    const y2b = CANVAS_HEIGHT / POV_ / perspectiveP2.y;

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

function render2(context: CanvasRenderingContext2D, { map, player }: GameStateInterface) {
  const camera = player.position;
  const sector = {
    walls: map.walls.map(({ x1, y1, x2, y2, color }) => ({
      p1: { x: x1, y: y1 },
      p2: { x: x2, y: y2 },
      color,
    })),
  };

  // context.fillStyle = '#cacaca';
  // context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 2);
  //
  // context.fillStyle = '#2a2a2a';
  // context.fillRect(0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);

  renderSector(context, sector, camera);
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // renderMap(context, game);
  render2(context, game);
}
