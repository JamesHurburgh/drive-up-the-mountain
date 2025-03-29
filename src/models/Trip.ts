export class Trip {
  distance: number; // Distance in meters
  goal: number; // Goal distance in meters

  constructor(initialDistance: number, goal: number) {
    this.distance = initialDistance;
    this.goal = goal;
  }

  updateDistance(delta: number) {
    this.distance += delta;
  }

  getDistance(): number {
    return this.distance;
  }

  isGoalReached(): boolean {
    return this.distance >= this.goal;
  }
}
