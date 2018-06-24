// @flow
import { interval, Scheduler } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import render from './game/render';
import { createKeysStream } from './game/keys';
import { takeSecond } from './util/projection';
import { createGameReducer } from './game/reducer';

const generator$ = interval(Scheduler.requestAnimationFrame)
  .pipe(withLatestFrom(createKeysStream(), takeSecond()));

const canvas = document.getElementById('canvas-main');

if (canvas instanceof HTMLCanvasElement) {
  canvas.width = 300;
  canvas.height = 300;

  const context = canvas.getContext('2d');

  generator$
    .pipe(createGameReducer())
    .subscribe(gameState => render(context, gameState));
}
