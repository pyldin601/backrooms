// @flow
export function isBetween(bound1: number, bound2: number, subject: number): boolean {
  return bound1 < bound2
    ? bound1 <= subject && subject <= bound2
    : bound2 <= subject && subject <= bound1;
}
