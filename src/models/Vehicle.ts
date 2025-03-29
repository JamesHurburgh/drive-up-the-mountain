export class Vehicle {
  speed: number; // Speed in meters per second
  fuel: number; // Fuel level as a percentage (0 to 100)
  maxSpeed: number; // Maximum speed in meters per second
  acceleration: number; // Acceleration in meters per second squared
  drag: number; // Drag factor to slow the vehicle down
  isAccelerating: boolean; // Whether the vehicle is accelerating

  constructor(initialSpeed: number, initialFuel: number, maxSpeed: number, acceleration: number, drag: number) {
    this.speed = initialSpeed;
    this.fuel = initialFuel;
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
    this.drag = drag;
    this.isAccelerating = false;
  }

  accelerate() {
    if (this.fuel > 0) {
      this.isAccelerating = true;
    }
  }

  stopAccelerating() {
    this.isAccelerating = false;
  }

  onTick(deltaTime: number) {
    if (this.isAccelerating && this.fuel > 0) {
      this.speed = Math.min(this.speed + this.acceleration * deltaTime, this.maxSpeed);
      this.consumeFuel(deltaTime * 0.005); // Example: fuel consumed per second while accelerating
    } else {
      this.speed = Math.max(0, this.speed - this.drag * deltaTime); // Apply drag to slow down
    }
  }

  consumeFuel(amount: number) {
    this.fuel = Math.max(0, this.fuel - amount);
  }

  getFuelLevel(): number {
    return this.fuel;
  }

  getSpeed(): number {
    return this.speed;
  }
}
