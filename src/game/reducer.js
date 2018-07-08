// @flow
import { scan } from 'rxjs/operators';
import type { GameStateInterface, KeysStateInterface, PlayerStateInterface } from './state';
import initialState from './initial-state';
import { movePoint } from '../util/geometry';
import { PLAYER_TURN_STEP, PLAYER_SPEED } from '../consts';
import type { Map, Point, Wall } from './core/types';
import { willClipTheWall } from './core/collision';
import { hasWallPortal, moveCameraInRelationToPortal } from './core/portal';


function movePlayerPosition(player: PlayerStateInterface, map: Map, moveSpeed: number, moveAngle: number) {
  const { x, y, angle, sectorId } = player.position;
  const originalPosition = { x, y };
  const newPosition = movePoint(originalPosition, moveSpeed, moveAngle);

  const sector = map.sectors[player.position.sectorId];

  const clippedWall = sector.walls.find(wall => willClipTheWall(originalPosition, newPosition, wall));

  if (!clippedWall) {
    player.position = { angle, sectorId, ...newPosition };
    return;
  }

  if (hasWallPortal(clippedWall)) {
    const { sectorId, wallId } = clippedWall.portal;
    const thatWall = map.sectors[sectorId].walls[wallId];
    const positionBehindPortal = moveCameraInRelationToPortal(clippedWall, thatWall, { ...newPosition, angle });
    player.position = { ...positionBehindPortal, sectorId };
  }
}

function movePlayer({ player, map }: GameStateInterface, keysState: KeysStateInterface, deltaMs: number) {
  const walkSpeed = PLAYER_SPEED / 16 * deltaMs;
  const turnSpeed = PLAYER_TURN_STEP / 16 * deltaMs;

  // Forward
  if (keysState.ArrowUp) {
    movePlayerPosition(player, map, walkSpeed, player.position.angle);
  }

  // Backward
  if (keysState.ArrowDown) {
    movePlayerPosition(player, map, walkSpeed, player.position.angle - Math.PI);
  }


  if (keysState.Alt) {
    // Strafe left
    if (keysState.ArrowLeft) {
      movePlayerPosition(player, map, walkSpeed, player.position.angle - Math.PI / 2);
    }

    // Strafe right
    if (keysState.ArrowRight) {
      movePlayerPosition(player, map, walkSpeed, player.position.angle + Math.PI / 2);
    }
  } else {
    // Turn left
    if (keysState.ArrowLeft) {
      player.position.angle -= turnSpeed;
    }

    // Turn right
    if (keysState.ArrowRight) {
      player.position.angle += turnSpeed;
    }
  }
}

interface ReducerState {
  time: number;
  state: GameStateInterface;
}

function reduce({ time, state }: ReducerState, keysState: KeysStateInterface): ReducerState {
  const now = Date.now();
  movePlayer(state, keysState, now - time);
  return { time: now, state };
}

export function createGameReducer() {
  return scan(reduce, { time: Date.now(), state: initialState });
}
