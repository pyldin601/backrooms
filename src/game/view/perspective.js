// @flow
import type { GameStateInterface } from '../state';

function renderMap(context: CanvasRenderingContext2D, { map, player }: GameStateInterface) {
  const { x, y, angle } = player.position;

  const path = new Path2D();
  const px = x;
  const py = y;

  map.walls.forEach(wall => {
    const vx1 = wall.x1;
    const vy1 = wall.y1;
    const vx2 = wall.x2;
    const vy2 = wall.y2;

    const tx1 = vx1 - px; const ty1 = vy1 - py;
    const tx2 = vx2 - px; const ty2 = vy2 - py;

    const tz1 = tx1 * Math.cos(angle) + ty1 * Math.sin(angle);
    const tz2 = tx2 * Math.cos(angle) + ty2 * Math.sin(angle);

    const _tx1 = tx1 * Math.sin(angle) - ty1 * Math.cos(angle);
    const _tx2 = tx2 * Math.sin(angle) - ty2 * Math.cos(angle);

    const x1 = -_tx1 * 16 / tz1; const y1a = -50 / tz1; const y1b = 50 / tz1;
    const x2 = -_tx2 * 16 / tz2; const y2a = -50 / tz2; const y2b = 50 / tz2;

    path.moveTo(50 + x1, 50 + y1a);
    path.lineTo(50 + x2, 50 + y2a);
    path.lineTo(50 + x2, 50 + y2b);
    path.lineTo(50 + x1, 50 + y1b);
    path.lineTo(50 + x1, 50 + y1a);
  });

  context.fillStyle = '#aabb00';
  context.fill(path);
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  context.clearRect(0, 0, 100, 100);
  renderMap(context, game);
}
