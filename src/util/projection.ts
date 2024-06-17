export function takeSecond<A, B>() {
  return (a: A, b: B): B => b;
}
