import type { Point } from './geometry';

export const moveTo = (context: CanvasRenderingContext2D, { x, y }: Point) => context.moveTo(x, y);
export const lineTo = (context: CanvasRenderingContext2D, { x, y }: Point) => context.lineTo(x, y);
