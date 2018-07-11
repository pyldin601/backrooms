// @flow
import { scan } from 'rxjs/operators';
import type { GameStateInterface, PlayerStateInterface } from './state';
import initialState from './initial-state';
import { PLAYER_TURN_STEP, PLAYER_SPEED } from '../consts';
import type { Map } from './core/types';
import { movePlayerOnMap } from './interact/move';
import type { KeysState } from './keys';

function movePlayerPosition(
  player: PlayerStateInterface,
  map: Map,
  moveSpeed: number,
  moveAngle: number,
): PlayerStateInterface {
  const playerSector = map.sectors[player.position.sectorId];
  const position = movePlayerOnMap(
    player.position,
    moveSpeed,
    moveAngle,
    player.position.sectorId,
    playerSector,
    map,
  );
  return { ...player, position };
}

function turnPlayer(player: PlayerStateInterface, turnAngle: number): PlayerStateInterface {
  const position = { ...player.position, angle: player.position.angle + turnAngle };
  return { ...player, position };
}

function movePlayer(
  gameState: GameStateInterface,
  keysState: KeysState,
  deltaMs: number,
): GameStateInterface {
  let walkSpeed = (PLAYER_SPEED / 16) * deltaMs;
  let turnSpeed = (PLAYER_TURN_STEP / 16) * deltaMs;

  const { player, map } = gameState;

  let playerState = player;

  // Acceleration
  if (keysState.Shift) {
    walkSpeed *= 2;
    turnSpeed *= 2;
  }

  // Forward
  if (keysState.ArrowUp) {
    playerState = movePlayerPosition(playerState, map, walkSpeed, playerState.position.angle);
  }

  // Backward
  if (keysState.ArrowDown) {
    playerState = movePlayerPosition(
      playerState,
      map,
      walkSpeed,
      playerState.position.angle - Math.PI,
    );
  }

  if (keysState.Alt) {
    // Strafe left
    if (keysState.ArrowLeft) {
      playerState = movePlayerPosition(
        playerState,
        map,
        walkSpeed,
        playerState.position.angle - Math.PI / 2,
      );
    }

    // Strafe right
    if (keysState.ArrowRight) {
      playerState = movePlayerPosition(
        playerState,
        map,
        walkSpeed,
        playerState.position.angle + Math.PI / 2,
      );
    }
  } else {
    // Turn left
    if (keysState.ArrowLeft) {
      playerState = turnPlayer(playerState, -turnSpeed);
    }

    // Turn right
    if (keysState.ArrowRight) {
      playerState = turnPlayer(playerState, turnSpeed);
    }
  }

  return playerState === player ? gameState : { ...gameState, player: playerState };
}

interface ReducerState {
  time: number;
  state: GameStateInterface;
}

function reduce({ time, state }: ReducerState, keysState: KeysState): ReducerState {
  const now = Date.now();
  return { time: now, state: movePlayer(state, keysState, now - time) };
}

export function createGameReducer() {
  return scan(reduce, { time: Date.now(), state: initialState });
}
