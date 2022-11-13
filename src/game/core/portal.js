import { getLineAngle, getLineCenter, rotatePoint } from '../../util/geometry';

export function hasWallPortal(wall) {
  return isPortal(wall.portal);
}

export function isPortal(portal) {
  return portal !== null && portal !== undefined;
}

export function moveCameraInRelationToPortal(thisWall, thatWall, camera) {
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
  camera,
  moveX,
  moveY,
  moveAngle,
  center,
) {
  const movedCamera = { ...camera, x: camera.x - moveX, y: camera.y - moveY };
  const newCenter = rotatePoint(movedCamera, center, moveAngle);

  return { ...camera, angle: camera.angle + moveAngle, ...newCenter };
}
