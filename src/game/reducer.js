// @flow
import { scan } from 'rxjs/operators';
import type { GameStateInterface, KeysStateInterface, PlayerStateInterface } from './state';
import initialState from './initial-state';
import { movePoint } from '../util/geometry';
import { PLAYER_TURN_STEP, PLAYER_SPEED } from '../consts';

function movePlayer(player: PlayerStateInterface, keysState: KeysStateInterface, deltaMs: number) {
  const walkSpeed = PLAYER_SPEED / 16 * deltaMs;
  const turnSpeed = PLAYER_TURN_STEP / 16 * deltaMs;

  if (keysState.ArrowDown) {
    const { x, y, angle, sectorId } = player.position;
    player.position = { angle, ...movePoint({ x, y }, walkSpeed, angle), sectorId };
  }

  if (keysState.ArrowUp) {
    const { x, y, angle, sectorId } = player.position;
    player.position = { angle, ...movePoint({ x, y }, -walkSpeed, angle), sectorId };
  }

  if (keysState.ArrowLeft) {
    player.position.angle -= turnSpeed;
  }

  if (keysState.ArrowRight) {
    player.position.angle += turnSpeed;
  }
}

interface ReducerState {
  time: number;
  state: GameStateInterface;
}

function reduce({ time, state }: ReducerState, keysState: KeysStateInterface): ReducerState {
  const now = Date.now();
  movePlayer(state.player, keysState, now - time);
  return { time: now, state };
}

export function createGameReducer() {
  return scan(reduce, { time: Date.now(), state: initialState });
}
