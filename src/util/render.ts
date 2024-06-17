import { IPoint } from '@/game/geometry-types';

export const moveTo = (context: CanvasRenderingContext2D, { x, y }: IPoint) => context.moveTo(x, y);
export const lineTo = (context: CanvasRenderingContext2D, { x, y }: IPoint) => context.lineTo(x, y);
