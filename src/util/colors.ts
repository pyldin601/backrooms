export const COLOR_CODES = Object.freeze([
  '#FFFF00',
  '#2AD689',
  '#F3FF3F',
  '#0D5C63',
  '#247B7B',
  '#44A1A0',
]);

export function getRandomColor(): string {
  const colorIndex = Math.floor(Math.random() * COLOR_CODES.length);

  return COLOR_CODES[colorIndex]!;
}
