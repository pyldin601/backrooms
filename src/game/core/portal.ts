import { getLineAngle, getLineCenter, rotatePoint } from '@/util/geometry';
import { ICamera, IPortal, IWall } from '@/game/map-types';
import { IPoint } from '@/game/geometry-types';

export function hasWallPortal(wall: IWall) {
  return isPortal(wall.portal);
}

export function isPortal(portal: IPortal | null | undefined): portal is IPortal {
  return portal !== null && portal !== undefined;
}

export function moveCameraInRelationToPortal(thisWall: IWall, thatWall: IWall, camera: ICamera) {
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
  camera: ICamera,
  moveX: number,
  moveY: number,
  moveAngle: number,
  center: IPoint,
) {
  const movedCamera = { ...camera, x: camera.x - moveX, y: camera.y - moveY };
  const newCenter = rotatePoint(movedCamera, center, moveAngle);

  return { ...camera, angle: camera.angle + moveAngle, ...newCenter };
}
