// @flow
import { interval } from 'rxjs';
import initialState from './game/initial-state';
import render from './game/render';

const canvas = document.getElementById('canvas-main');

if (canvas instanceof HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  interval(1000).subscribe(() => render(context, initialState));
}
