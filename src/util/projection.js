// @flow
export function takeSecond<T>() {
  return (a: *, b: T) => b;
}
