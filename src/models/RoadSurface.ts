export enum RoadSurface {
  Road = 'road',
  Grass = 'grass',
}

export function getSurfaceEffect(surface: RoadSurface): { dragMultiplier: number } {
  switch (surface) {
    case RoadSurface.Grass:
      return { dragMultiplier: 2 }; // Grass increases drag
    case RoadSurface.Road:
    default:
      return { dragMultiplier: 1 }; // Normal road behavior
  }
}
