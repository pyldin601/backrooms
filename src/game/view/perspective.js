import { renderSector } from '../core/renderer';

function renderMap(
  context,
  { map, player },
  textureImage,
) {
  renderSector(context, player.position.sectorId, map.sectors, player.position, textureImage);
}

export default function render(
  context,
  game,
  textureImage,
) {
  renderMap(context, game, textureImage);
}
