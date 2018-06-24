// @flow
import { scan } from 'rxjs/operators';
import type { GameStateInterface, KeysStateInterface } from './state';
import initialState from './initial-state';

function reduce(game: GameStateInterface, keysState: KeysStateInterface): GameStateInterface {
  if (keysState.ArrowDown) {
    game.player.position.y += .5;
  }
  if (keysState.ArrowUp) {
    game.player.position.y -= .5;
  }
  if (keysState.ArrowLeft) {
    game.player.position.angle -= .01;
  }
  if (keysState.ArrowRight) {
    game.player.position.angle += .01;
  }
  return game;
}

export function createGameReducer() {
  return scan(reduce, initialState);
}
