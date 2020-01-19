// @flow
export function loadImage(src: string): Promise<Image> {
  return new Promise(function(resolve) {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = src;
  });
}
