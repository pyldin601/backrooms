export function isBetween(bound1: number, bound2: number, subject: number) {
  return bound1 < bound2
    ? bound1 <= subject && subject <= bound2
    : bound2 <= subject && subject <= bound1;
}

export function scale(min: number, max: number, rate: number) {
  const delta = max - min;

  return min + delta * rate;
}

export function unscale(num1: number, num2: number, subject: number) {
  return (1 / (num2 - num1)) * (subject - num1);
}
