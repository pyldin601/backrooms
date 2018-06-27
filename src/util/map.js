//@flow
import type { WallStateInterface } from "../game/state";
import type { Point } from './geometry';
import { getRandomColor } from "./colors";

export function generateWallFromTwoPoints (a: Point, b: Point): WallStateInterface {
    return {
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
        color: getRandomColor()
    }
}

export function generateWallArrayFromPointsArray (pointsArray: Point[]): WallStateInterface[] {
    let wallArray = [];
    let previousPoint = null;

    for (let point of pointsArray) {
        if (previousPoint === null) {
            previousPoint = point;
            continue;
        }
        wallArray.push(generateWallFromTwoPoints(previousPoint, point));
        previousPoint = point;

    }

    return wallArray;
}