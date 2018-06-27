// @flow
import { interval, Scheduler } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { createKeysStream } from './game/keys';
import { takeSecond } from './util/projection';
import { createGameReducer } from './game/reducer';
import renderAbsolute from './game/view/absolute';
import renderTransformed from './game/view/transformed';
import renderPerspective from './game/view/perspective';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './consts';

const generator$ = interval(Scheduler.requestAnimationFrame)
  .pipe(withLatestFrom(createKeysStream(), takeSecond()));

const prepareCanvasAndGetContext = (canvasId) => {
  const element = document.getElementById(canvasId);
  if (element instanceof HTMLCanvasElement) {
    element.width = CANVAS_WIDTH;
    element.height = CANVAS_HEIGHT;
    const context = element.getContext('2d');
    context.imageSmoothingEnabled = false;
    return context;
  } else {
    throw new Error('BAD ELEMENT');
  }
};

const absoluteContext = prepareCanvasAndGetContext('canvas-absolute');
const transformedContext = prepareCanvasAndGetContext('canvas-transformed');
const perspectiveContext = prepareCanvasAndGetContext('canvas-perspective');

generator$
  .pipe(createGameReducer())
  .subscribe(gameState => {
    renderAbsolute(absoluteContext, gameState);
    renderTransformed(transformedContext, gameState);
    renderPerspective(perspectiveContext, gameState);
  });
