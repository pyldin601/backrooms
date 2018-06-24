// @flow
import type { Point } from './geometry';

export const moveTo = (context: Path2D, { x, y }: Point) => context.moveTo(x, y);
export const lineTo = (context: Path2D, { x, y }: Point) => context.lineTo(x, y);
