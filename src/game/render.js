// @flow
import type { GameStateInterface, MapStateInterface, PlayerStateInterface } from './state';

function renderPlayer(context: CanvasRenderingContext2D, player: PlayerStateInterface) {
  const { x, y } = player.position;

  context.strokeStyle = '#444444';

  context.beginPath();
  context.moveTo(x, y - 5);
  context.lineTo(x, y + 5);

  context.moveTo(x, y - 5);
  context.lineTo(x - 5, y);

  context.moveTo(x, y - 5);
  context.lineTo(x + 5, y);

  context.stroke();
}

function renderMap(context: CanvasRenderingContext2D, map: MapStateInterface) {
  console.log('map', map);
}

export default function render(context: CanvasRenderingContext2D, game: GameStateInterface) {
  context.clearRect(0, 0, 300, 300);
//  renderMap(context, game.map);
  renderPlayer(context, game.player);
}
