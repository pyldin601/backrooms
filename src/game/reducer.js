// @flow
import { scan } from 'rxjs/operators';
import type { GameStateInterface, KeysStateInterface, PlayerStateInterface } from './state';
import initialState from './initial-state';
import { movePoint } from '../util/geometry';
import { PLAYER_TURN_STEP, PLAYER_SPEED } from '../consts';

function movePlayer(player: PlayerStateInterface, keysState: KeysStateInterface) {
  if (keysState.ArrowDown) {
    const { x, y, angle } = player.position;
    player.position = { angle, ...movePoint({ x, y }, PLAYER_SPEED, angle) };
  }

  if (keysState.ArrowUp) {
    const { x, y, angle } = player.position;
    player.position = { angle, ...movePoint({ x, y }, -PLAYER_SPEED, angle) };
  }

  if (keysState.ArrowLeft) {
    player.position.angle -= PLAYER_TURN_STEP;
  }

  if (keysState.ArrowRight) {
    player.position.angle += PLAYER_TURN_STEP;
  }
}

function reduce(game: GameStateInterface, keysState: KeysStateInterface): GameStateInterface {
  movePlayer(game.player, keysState);
  return game;
}

export function createGameReducer() {
  return scan(reduce, initialState);
}
