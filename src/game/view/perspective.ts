import { renderSector } from '../core/renderer';
import { IGameState } from '@/game/map-types';

function renderMap(
  context: CanvasRenderingContext2D,
  { map, player }: IGameState,
  textureImage: CanvasImageSource,
) {
  renderSector(context, player.position.sectorId, map.sectors, player.position, textureImage);
}

export default function render(
  context: CanvasRenderingContext2D,
  game: IGameState,
  textureImage: CanvasImageSource,
) {
  renderMap(context, game, textureImage);
}
