// @flow
import { orderBy } from 'lodash';
import { PERSPECTIVE_HEIGHT, PERSPECTIVE_WIDTH } from '../../consts';
import type { GameStateInterface } from '../state';
import { renderSector } from '../core/renderer';

function renderBackground(context: CanvasRenderingContext2D, { map }: GameStateInterface) {
  context.fillStyle = '#009aff';
  context.fillRect(0, 0, PERSPECTIVE_WIDTH, PERSPECTIVE_HEIGHT / 2);

  context.fillStyle = '#2a2a2a';
  context.fillRect(0, PERSPECTIVE_HEIGHT / 2, PERSPECTIVE_WIDTH, PERSPECTIVE_HEIGHT);
}

function renderMap(context: CanvasRenderingContext2D, { map, player }: GameStateInterface) {
  const camera = player.position;

  renderSector(context, map.sectors[0], camera);
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  renderBackground(context, game);
  renderMap(context, game);
}
