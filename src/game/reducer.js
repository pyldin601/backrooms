import { scan } from 'rxjs/operators';
import initialState from './initial-state';
import { PLAYER_TURN_STEP, PLAYER_SPEED } from '../consts';
import { movePlayerOnMap } from './interact/move';

function movePlayerPosition(
  player,
  map,
  moveSpeed,
  moveAngle,
) {
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

function turnPlayer(player, turnAngle) {
  const tpi = 2 * Math.PI;
  const position = { ...player.position, angle: (player.position.angle + turnAngle + tpi) % tpi };

  return { ...player, position };
}

function movePlayer(
  gameState,
  keysState,
  deltaMs,
) {
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

function reduce({ time, state }, keysState) {
  const now = Date.now();

  return { time: now, state: movePlayer(state, keysState, now - time) };
}

export function createGameReducer() {
  return scan(reduce, { time: Date.now(), state: initialState });
}
