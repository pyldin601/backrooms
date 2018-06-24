// @flow
import { interval } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import initialState from './game/initial-state';
import render from './game/render';
import { createKeysStream } from './game/keys';
import { takeSecond } from './util/projection';

const keys$ = createKeysStream();
const generator$ = interval(500);
const keysScanner$ = generator$.pipe(withLatestFrom(keys$, takeSecond()));

const canvas = document.getElementById('canvas-main');

if (canvas instanceof HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  keysScanner$.subscribe(key => console.log(key));
  // interval(1000).subscribe(() => render(context, initialState));
}
