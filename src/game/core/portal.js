// @flow
import type { Camera, Point, Wall } from './types';
import { getLineAngle, getLineCenter, rotatePoint } from '../../util/geometry';

export function isWallHasPortal(wall: Wall): boolean {
  return wall.portal !== null && wall.portal !== undefined;
}

export function moveCameraInRelationToPortal(thisWall: Wall, thatWall: Wall, camera: Camera): Camera {
  const thisWallAngle = getLineAngle(thisWall);
  const thatWallAngle = getLineAngle(thatWall);

  const thisWallCenter = getLineCenter(thisWall);
  const thatWallCenter = getLineCenter(thatWall);

  const angleDiff = thisWallAngle - thatWallAngle;
  const moveX = thisWallCenter.x - thatWallCenter.x;
  const moveY = thisWallCenter.y - thatWallCenter.y;

  return moveAndRotateCamera(camera, moveX, moveY, angleDiff - Math.PI, thatWallCenter);
}

export function moveAndRotateCamera(
  camera: Camera,
  moveX: number,
  moveY: number,
  moveAngle: number,
  center: Point,
): Camera {
  const movedCamera = { ...camera, x: camera.x - moveX, y: camera.y - moveY };
  const newCenter = rotatePoint(movedCamera, center, moveAngle);
  return { ...camera, angle: camera.angle + moveAngle, ...newCenter };
}
