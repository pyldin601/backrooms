import type { GameStateInterface } from '../state';
import { renderSector } from '../core/renderer';

function renderMap(
  context: CanvasRenderingContext2D,
  { map, player }: GameStateInterface,
  textureImage: HTMLImageElement,
) {
  renderSector(context, player.position.sectorId, map.sectors, player.position, textureImage);
}

export default function render(
  context: CanvasRenderingContext2D,
  game: GameStateInterface,
  textureImage: HTMLImageElement,
) {
  renderMap(context, game, textureImage);
}
