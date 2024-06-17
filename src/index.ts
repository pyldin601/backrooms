import { defer, interval, animationFrameScheduler, Subject, distinct } from 'rxjs';
import { combineLatest, withLatestFrom, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { createKeysStream } from './game/keys';
import { takeSecond } from './util/projection';
import { createGameReducer } from './game/reducer';
import renderTransformed from './game/view/transformed';
import renderPerspective from './game/view/perspective';
import { loadImage } from './util/image';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PERSPECTIVE_WIDTH, PERSPECTIVE_HEIGHT } from './consts';
import wallsFile from './images/walls.png';
import { assert } from './util/assert';

const textureImage$ = defer(() => loadImage(wallsFile));

const generator$ = interval(0, animationFrameScheduler).pipe(
  withLatestFrom(createKeysStream(), takeSecond()),
);

const reload$ = new Subject();

// for HMR reloading support
if (module.hot) {
  module.hot.accept(() => reload$.next(null));
}

const prepareCanvasAndGetContext = (canvasId: string, width: number, height: number) => {
  const element = document.getElementById(canvasId);
  assert(element);

  if (element instanceof HTMLCanvasElement) {
    element.width = width;
    element.height = height;

    const context = element.getContext('2d');
    assert(context);

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
assert(transformedContext);
const perspectiveContext = prepareCanvasAndGetContext(
  'canvas-perspective',
  PERSPECTIVE_WIDTH,
  PERSPECTIVE_HEIGHT,
);
assert(perspectiveContext);

generator$
  .pipe(takeUntil(reload$), createGameReducer(), combineLatest(textureImage$))
  .subscribe(([{ time, state }, textureImage]) => {
    renderTransformed(transformedContext, state);
    renderPerspective(perspectiveContext, state, textureImage);
  });
