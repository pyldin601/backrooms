// @flow
import { orderBy } from 'lodash';
import type { GameStateInterface } from '../state';
import { renderSector } from '../core/renderer';

function renderMap(context: CanvasRenderingContext2D, { map, player }: GameStateInterface) {
  renderSector(context, player.position.sectorId, map.sectors, player.position);
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  renderMap(context, game);
}
