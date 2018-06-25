// @flow
import { interval, Scheduler } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { createKeysStream } from './game/keys';
import { takeSecond } from './util/projection';
import { createGameReducer } from './game/reducer';
import renderAbsolute from './game/view/absolute';
import renderTransformed from './game/view/transformed';
import renderPerspective from './game/view/perspective';

const generator$ = interval(Scheduler.requestAnimationFrame)
  .pipe(withLatestFrom(createKeysStream(), takeSecond()));

const absoluteCanvas = document.getElementById('canvas-absolute');
const transformedCanvas = document.getElementById('canvas-transformed');
const perspectiveCanvas = document.getElementById('canvas-perspective');

if (
  absoluteCanvas instanceof HTMLCanvasElement &&
  transformedCanvas instanceof HTMLCanvasElement &&
  perspectiveCanvas instanceof HTMLCanvasElement
) {
  absoluteCanvas.width = 100;
  absoluteCanvas.height = 100;

  transformedCanvas.width = 100;
  transformedCanvas.height = 100;

  perspectiveCanvas.width = 100;
  perspectiveCanvas.height = 100;

  const absoluteContext = absoluteCanvas.getContext('2d');
  const transformedContext = transformedCanvas.getContext('2d');
  const perspectiveContext = perspectiveCanvas.getContext('2d');

  generator$
    .pipe(createGameReducer())
    .subscribe(gameState => {
      renderAbsolute(absoluteContext, gameState);
      renderTransformed(transformedContext, gameState);
      renderPerspective(perspectiveContext, gameState);
    });
}
