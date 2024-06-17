export function assert<T>(t: T | null | undefined): asserts t is T {
  if (t === null || t === undefined) {
    throw new Error('Assertion error');
  }
}
