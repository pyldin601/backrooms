// @flow
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise(function (resolve) {
    const image = new Image();

    image.onload = () => resolve(image);
    image.src = src;
  });
}
