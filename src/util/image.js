export function loadImage(src) {
  return new Promise(function(resolve) {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = src;
  });
}
