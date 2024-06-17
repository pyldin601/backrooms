export function loadImage(src: string) {
  return new Promise<HTMLImageElement>(function (resolve, reject) {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image ${src}`));
    image.src = src;
  });
}
