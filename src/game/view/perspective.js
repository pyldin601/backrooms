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

  const px = x;
  const py = y;


  context.fillStyle = '#cacaca';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 2);



  context.fillStyle = '#2a2a2a';
  context.fillRect(0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);


  map.walls.forEach(wall => {
    const vx1 = wall.x1;
    const vy1 = wall.y1;
    const vx2 = wall.x2;
    const vy2 = wall.y2;

    let tx1 = vx1 - px; const ty1 = vy1 - py;
    let tx2 = vx2 - px; const ty2 = vy2 - py;

    let tz1 = tx1 * Math.cos(angle) + ty1 * Math.sin(angle);
    let tz2 = tx2 * Math.cos(angle) + ty2 * Math.sin(angle);

    tx1 = tx1 * Math.sin(angle) - ty1 * Math.cos(angle);
    tx2 = tx2 * Math.sin(angle) - ty2 * Math.cos(angle);

    if (tz1 > 0 || tz2 > 0) {
      const i1: Point = intersect(tx1, tz1, tx2, tz2, -.001, .001, -20, 5);
      const i2: Point = intersect(tx1, tz1, tx2, tz2, .001, .001, 20, 5);

      if (tz1 <= 0) {
        if (i1.y > 0) {
          tx1 = i1.x; tz1 = i1.y;
        } else {
          tx1 = i2.x; tz1 = i2.y;          
        }
      }

      if (tz2 <= 0) {
        if (i1.y > 0) {
          tx2 = i1.x; tz2 = i1.y;
        } else {
          tx2 = i2.x; tz2 = i2.y;          
        }
      }
      
      const POV = 32;
      const POV_ = 1;

      const x1 = -tx1 * POV / tz1; const y1a = -CANVAS_HEIGHT / POV_ / tz1; const y1b = CANVAS_HEIGHT / POV_ / tz1;
      const x2 = -tx2 * POV / tz2; const y2a = -CANVAS_HEIGHT / POV_ / tz2; const y2b = CANVAS_HEIGHT / POV_ / tz2;

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

      // context.strokeStyle = wall.color;
      // context.stroke();
      context.restore(); 
    }
 
  });
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  // context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  renderMap(context, game);
}
