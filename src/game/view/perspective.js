// @flow
import { orderBy } from 'lodash';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../consts';
import type { GameStateInterface } from '../state';
import { renderSector } from '../core/renderer';

function renderBackground(context: CanvasRenderingContext2D, { map }: GameStateInterface) {
  context.fillStyle = '#009aff';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 2);

  context.fillStyle = '#2a2a2a';
  context.fillRect(0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function renderMap(context: CanvasRenderingContext2D, { map, player }: GameStateInterface) {
  const camera = player.position;
  const sector = {
    walls: map.walls.map(({ x1, y1, x2, y2, color }) => ({
      p1: { x: x1, y: y1 },
      p2: { x: x2, y: y2 },
      height: 10,
      color,
    })),
  };

  renderSector(context, sector, camera);
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  renderBackground(context, game);
  renderMap(context, game);
}
