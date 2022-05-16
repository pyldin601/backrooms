export function takeSecond<T>() {
  return (a: unknown, b: T) => b;
}
