import { rotatePoint } from '../../util/geometry';
import { moveTo, lineTo } from '../../util/render';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../consts';

const playerPosition = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2,
};

function renderPlayer(context, { player }) {
  const x = playerPosition.x;
  const y = playerPosition.y;

  context.save();
  context.beginPath();

  moveTo(context, { x, y });
  lineTo(context, { x: x + 5, y });

  context.strokeStyle = '#666666';
  context.stroke();
  context.restore();
}

function renderMap(context, { map, player }) {
  const { x, y, angle } = player.position;

  const diffX = x - playerPosition.x;
  const diffY = y - playerPosition.y;

  map.sectors.forEach(sector => {
    sector.walls.forEach(wall => {
      context.save();
      context.beginPath();
      moveTo(
        context,
        rotatePoint({ x: wall.p1.x - diffX, y: wall.p1.y - diffY }, playerPosition, -angle),
      );
      lineTo(
        context,
        rotatePoint({ x: wall.p2.x - diffX, y: wall.p2.y - diffY }, playerPosition, -angle),
      );
      context.strokeStyle = wall.portal ? '#DD00DD' : wall.color;
      context.stroke();
      context.restore();
    });
  });
}

function renderPosition(
  context,
  { player: { position } },
) {
  const playerAngle = 360 / Math.PI * position.angle / 2;
  const positionText = `(${[position.x, position.y, position.z, playerAngle]
    .map(n => n.toFixed(0))
    .join(', ')})`;
  context.save();
  context.fillStyle = '#ff8800';
  context.fillText(positionText, 2, 10);
  context.fill();
  context.restore();
}

export default function render(context, game) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  renderMap(context, game);
  renderPlayer(context, game);
  renderPosition(context, game);
}
