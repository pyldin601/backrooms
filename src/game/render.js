// @flow
import type { GameInterface, GameMapInterface, PlayerInterface } from './models';

function renderPlayer(context: CanvasRenderingContext2D, player: PlayerInterface) {
  console.log('player', player);
}

function renderMap(context: CanvasRenderingContext2D, map: GameMapInterface) {
  console.log('map', map);
}

export default function render(context: CanvasRenderingContext2D, game: GameInterface) {
  renderMap(context, game.map);
  renderPlayer(context, game.player);
}
