// @flow
import { interval, Scheduler, Subject } from 'rxjs';
import { withLatestFrom, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { createKeysStream } from './game/keys';
import { takeSecond } from './util/projection';
import { createGameReducer } from './game/reducer';
import renderTransformed from './game/view/transformed';
import renderPerspective from './game/view/perspective';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PERSPECTIVE_WIDTH, PERSPECTIVE_HEIGHT } from './consts';

const generator$ = interval(Scheduler.requestAnimationFrame).pipe(
  withLatestFrom(createKeysStream(), takeSecond()),
);

const reload$ = new Subject();

// for HMR reloading support
if (module.hot) {
  module.hot.accept(() => reload$.next());
}

const prepareCanvasAndGetContext = (canvasId, width, height) => {
  const element = document.getElementById(canvasId);
  if (element instanceof HTMLCanvasElement) {
    element.width = width;
    element.height = height;
    const context = element.getContext('2d');
    context.imageSmoothingEnabled = false;
    return context;
  } else {
    throw new Error('BAD ELEMENT');
  }
};

const transformedContext = prepareCanvasAndGetContext(
  'canvas-transformed',
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
);
const perspectiveContext = prepareCanvasAndGetContext(
  'canvas-perspective',
  PERSPECTIVE_WIDTH,
  PERSPECTIVE_HEIGHT,
);

generator$
  .pipe(
    takeUntil(reload$),
    createGameReducer(),
    distinctUntilChanged(null, ({ state }) => state),
  )
  .subscribe(({ time, state }) => {
    renderTransformed(transformedContext, state);
    renderPerspective(perspectiveContext, state);
  });
