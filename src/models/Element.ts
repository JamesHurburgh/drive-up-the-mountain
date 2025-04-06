export class Element {
  distance: number; // Distance from the start of the trip in meters
  size: number; // Size of the element in pixels (affects both height and width)
  sprite: HTMLImageElement; // Sprite image for the element
  horizontalPosition: number; // Horizontal position relative to the road center (-1 for far left, 1 for far right, 0 for center)

  constructor(distance: number, size: number, spriteSrc: string, horizontalPosition: number = 0) {
    this.distance = distance;
    this.size = size;
    this.sprite = new Image();
    this.sprite.src = spriteSrc; // Load the sprite image
    this.horizontalPosition = horizontalPosition; // Set horizontal position
  }
}
