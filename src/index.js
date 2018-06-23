// @flow
import initialState from './game/initial-state';
import render from './game/render';
import { createKeysStream } from './game/keys';

const canvas = document.getElementById('canvas-main');

if (canvas instanceof HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  createKeysStream().subscribe(key => console.log(key));
  // interval(1000).subscribe(() => render(context, initialState));
}
