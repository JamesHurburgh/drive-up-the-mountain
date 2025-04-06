import { Element } from './Element';

export class Trip {
  distance: number; // Distance in meters
  goal: number; // Goal distance in meters
  elements: Element[]; // List of elements on the trip

  constructor(initialDistance: number, goal: number) {
    this.distance = initialDistance;
    this.goal = goal;
    this.elements = []; // Initialize the elements list
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

  addElement(element: Element) {
    this.elements.push(element); // Add a new element to the trip
  }

  getVisibleElements(viewDistance: number): Element[] {
    // Filter elements within the visible range
    return this.elements.filter(
      (element) =>
        element.distance >= this.distance - viewDistance &&
        element.distance <= this.distance + viewDistance
    );
  }
}
