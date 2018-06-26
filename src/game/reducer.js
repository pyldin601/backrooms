// @flow
import { scan } from 'rxjs/operators';
import type { GameStateInterface, KeysStateInterface, PlayerStateInterface } from './state';
import initialState from './initial-state';
import { movePoint } from '../util/geometry';

function movePlayer(player: PlayerStateInterface, keysState: KeysStateInterface) {
  if (keysState.ArrowDown) {
    const { x, y, angle } = player.position;
    player.position = { angle, ...movePoint({ x, y }, .1, angle) };
  }

  if (keysState.ArrowUp) {
    const { x, y, angle } = player.position;
    player.position = { angle, ...movePoint({ x, y }, -.1, angle) };
  }

  if (keysState.ArrowLeft) {
    player.position.angle -= .01;
  }

  if (keysState.ArrowRight) {
    player.position.angle += .01;
  }
}

function reduce(game: GameStateInterface, keysState: KeysStateInterface): GameStateInterface {
  movePlayer(game.player, keysState);
  return game;
}

export function createGameReducer() {
  return scan(reduce, initialState);
}
