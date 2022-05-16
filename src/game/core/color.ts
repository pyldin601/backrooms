const COLOR_PREG = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/;

export function darken(color: string, amount: number): string {
  const match = COLOR_PREG.exec(color);

  if (match === null) {
    throw new Error(`Bad color - ${color}`);
  }

  return `#${match
    .slice(1)
    .map((hex) => parseInt(hex, 16))
    .map((int) => Math.max(0, int - Math.floor((int / 100) * amount)))
    .map((newInt) => newInt.toString(16).padStart(2, '0'))
    .join('')}`;
}
