export function isBetween(bound1, bound2, subject) {
  return bound1 < bound2
    ? bound1 <= subject && subject <= bound2
    : bound2 <= subject && subject <= bound1;
}

export function scale(min, max, rate) {
  const delta = max - min;

  return min + delta * rate;
}

export function unscale(num1, num2, subject) {
  return 1 / (num2 - num1) * (subject - num1);
}
