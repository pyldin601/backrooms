// @flow
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../consts";
import type { Point } from "../../util/geometry";
import type { GameStateInterface } from '../state';

const fnCross = (x1: number, y1: number, x2: number, y2: number): number => x1 * y2 - y1 * x2; 

const intersect = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): Point => {
  let x: number = fnCross(x1, y1, x2, y2);
  let y: number = fnCross(x3, y3, x4, y4);
  const det = fnCross(x1-x2, y1-y2, x3-x4, y3-y4);
  const res: Point = {
    x: fnCross(x, x1-x2, y, x3-x4) / det,
    y: fnCross(x, y1-y2, y, y3-y4) / det
  };
  return res;
}

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

    let tz1 = tx1 * Math.cos(angle) + ty1 * Math.sin(angle);
    let tz2 = tx2 * Math.cos(angle) + ty2 * Math.sin(angle);

    let _tx1 = tx1 * Math.sin(angle) - ty1 * Math.cos(angle);
    let _tx2 = tx2 * Math.sin(angle) - ty2 * Math.cos(angle);

    if (tz1 > 0 || tz2 > 0) {
      const i1: Point = intersect(_tx1, tz1, _tx2, tz2, -.0001, .0001, -20, 5);
      const i2: Point = intersect(_tx1, tz1, _tx2, tz2, .0001, .0001, 20, 5);

      if (tz1 <= 0) {
        if (i1.y > 0) {
          _tx1 = i1.x; tz1 = i1.y;
        } else {
          _tx1 = i2.x; tz1 = i2.y;          
        }
      }

      if (tz2 <= 0) {
        if (i1.y > 0) {
          _tx2 = i1.x; tz2 = i1.y;
        } else {
          _tx2 = i2.x; tz2 = i2.y;          
        }
      }
      
      const x1 = -_tx1 * 16 / tz1; const y1a = -50 / tz1; const y1b = 50 / tz1;
      const x2 = -_tx2 * 16 / tz2; const y2a = -50 / tz2; const y2b = 50 / tz2;

      path.moveTo(CANVAS_WIDTH / 2 + x1, CANVAS_HEIGHT / 2 + y1a);
      path.lineTo(CANVAS_WIDTH / 2 + x2, CANVAS_HEIGHT / 2 + y2a);
      path.lineTo(CANVAS_WIDTH / 2 + x2, CANVAS_HEIGHT / 2 + y2b);
      path.lineTo(CANVAS_WIDTH / 2 + x1, CANVAS_HEIGHT / 2 + y1b);
      path.lineTo(CANVAS_WIDTH / 2 + x1, CANVAS_HEIGHT / 2 + y1a);
    } 
  });

  context.strokeStyle = '#aabb00';
  context.stroke(path);
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  renderMap(context, game);
}
