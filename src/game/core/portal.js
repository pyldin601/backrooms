// @flow
import type { Camera, Point, Wall } from './types';
import { getWallAngle, getWallCenter, rotatePoint } from '../../util/geometry';

export function isWallHasPortal(wall: Wall): boolean {
  return wall.portal !== null && wall.portal !== undefined;
}

export function moveCameraInRelationToPortal(thisWall: Wall, thatWall: Wall, camera: Camera): Camera {
  const thisWallAngle = getWallAngle(thisWall);
  const thatWallAngle = getWallAngle(thatWall);

  const thisWallCenter = getWallCenter(thisWall);
  const thatWallCenter = getWallCenter(thatWall);

  const angleDiff =  thatWallAngle - thisWallAngle;
  const moveX = thisWallCenter.x - thatWallCenter.x;
  const moveY = thisWallCenter.y - thatWallCenter.y;

  return moveAndRotateCamera(camera, moveX, moveY, angleDiff, thatWallCenter);
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
