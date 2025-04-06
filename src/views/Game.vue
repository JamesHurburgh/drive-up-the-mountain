<template>
  <v-container class="fill-height">
    <div class="text-center">
      <h1 class="text-h2 font-weight-bold">Driving Up the Mountain</h1>
      <p class="text-body-1">You're behind the wheel, climbing the treacherous road to the summit. The path is rough, and the higher you go, the harder it gets. Keep an eye on your car’s health—breakdowns, flat tires, and engine trouble are just around the corner. Collect coins and upgrades to keep your vehicle running and push forward. Can you reach the top, or will the mountain stop you in your tracks? Stay focused, stay alive!</p>
      <canvas id="gameCanvas" width="800" height="400" style="border: 1px solid black;"></canvas>
      <p class="text-body-1 font-weight-bold">Distance Traveled: {{ distanceDisplay }} meters</p>
      <p class="text-body-1 font-weight-bold">Vehicle Speed: {{ speedDisplay }} km/h</p>
      <p class="text-body-1 font-weight-bold">Fuel Level: {{ fuelDisplay }}%</p>
      <v-slider
        class="mt-4"
        v-model="distancePercentage"
        :max="100"
        :min="0"
        tick-always
        tick-size="4"
        disabled
        label="Distance Progress"
      ></v-slider>
      <v-btn class="ma-2" color="primary" @click="toggleGame">
        <v-icon left>{{ isRunning ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        {{ isRunning ? 'Pause' : 'Play' }}
      </v-btn>
      <div class="mt-4">
        <h2 class="text-h5 font-weight-bold">Controls</h2>
        <p class="text-body-1">Use the following keys to control your vehicle:</p>
        <ul class="text-left">
          <li><strong>Arrow Up:</strong> Accelerate</li>
          <li><strong>Arrow Down:</strong> Brake</li>
          <li><strong>Arrow Left:</strong> Steer Left</li>
          <li><strong>Arrow Right:</strong> Steer Right</li>
        </ul>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Trip } from '@/models/Trip';
import { Vehicle } from '@/models/Vehicle';
import { Element } from '@/models/Element';
import { RoadSurface, getSurfaceEffect } from '@/models/RoadSurface';
import redCarImage from '@/assets/red-car.png';

// Import rock assets
import rock1 from '@/assets/rock-1.png';
import rock2 from '@/assets/rock-2.png';
import rock3 from '@/assets/rock-3.png';
import rock4 from '@/assets/rock-4.png';
import rock5 from '@/assets/rock-5.png';
import rock6 from '@/assets/rock-6.png';
import rock7 from '@/assets/rock-7.png';
import rock8 from '@/assets/rock-8.png';
import rock9 from '@/assets/rock-9.png';

const rockSprites = [rock1, rock2, rock3, rock4, rock5, rock6, rock7, rock8, rock9];

const isRunning = ref(false);
let lastTimestamp = 0;
const router = useRouter();
const trip = reactive(new Trip(0, 10000));
const vehicle = reactive(new Vehicle(0, 100, 200, 5, 2));

// Generate rocks at random locations every 100 meters
for (let i = 100; i < trip.goal; i += 100) {
  const randomHorizontalPosition = Math.random() * 2 - 1; // Random value between -1 (far left) and 1 (far right)
  const randomSize = Math.random() * 30 + 40; // Random size between 40 and 70 pixels
  const randomRockSprite = rockSprites[Math.floor(Math.random() * rockSprites.length)]; // Randomly select a rock sprite
  trip.addElement(new Element(i, randomSize, randomRockSprite, randomHorizontalPosition));
}

const distanceDisplay = computed(() => trip.getDistance().toFixed(2));
const speedDisplay = computed(() => (vehicle.getSpeed()).toFixed(2));
const fuelDisplay = computed(() => vehicle.getFuelLevel().toFixed(2));
const distancePercentage = computed(() => ((trip.getDistance() / trip.goal) * 100).toFixed(2));

let roadLineOffset = 0;
const carImage = new Image();
carImage.src = redCarImage;

let carPositionX = 0;
const carMaxOffset = 150; // Allow driving on the grass
let carMomentumX = 0;
const carMomentumDecay = 0.95;
const carAccelerationX = 1;

let isMovingLeft = false;
let isMovingRight = false;
const carAccelerationRate = 0.1;

function toggleGame() {
  isRunning.value = !isRunning.value;
  if (isRunning.value) {
    lastTimestamp = performance.now();
    requestAnimationFrame(gameTick);
  }
}

function gameTick(timestamp: number) {
  if (!isRunning.value) return;

  const delta = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  vehicle.onTick(delta);
  const distanceTraveled = vehicle.getSpeed() * delta;
  trip.updateDistance(distanceTraveled);

  // Update horizontal momentum based on key presses
  if (isMovingLeft) {
    carMomentumX = Math.max(carMomentumX - carAccelerationRate, -carMaxOffset);
  } else if (isMovingRight) {
    carMomentumX = Math.min(carMomentumX + carAccelerationRate, carMaxOffset);
  }

  // Apply momentum decay and update car position
  carMomentumX *= carMomentumDecay;
  carPositionX = Math.max(-carMaxOffset, Math.min(carMaxOffset, carPositionX + carMomentumX));

  // Determine the surface the car is driving on
  const surface = Math.abs(carPositionX) > 100 ? RoadSurface.Grass : RoadSurface.Road;
  const surfaceEffect = getSurfaceEffect(surface);

  // Apply surface effects to the vehicle
  vehicle.drag = 2 * surfaceEffect.dragMultiplier;

  if (trip.isGoalReached()) {
    console.log('Goal reached! Game over.');
    isRunning.value = false;
    router.push('/game-finished');
    return;
  }

  drawCanvas();
  requestAnimationFrame(gameTick);
}

function drawCanvas() {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the grass
  ctx.fillStyle = 'green';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the road (extend to the top of the screen)
  ctx.fillStyle = 'gray';
  const roadWidth = canvas.width / 3;
  const roadX = (canvas.width - roadWidth) / 2;
  ctx.fillRect(roadX, 0, roadWidth, canvas.height);

  // Clip to the road area
  ctx.save();
  ctx.beginPath();
  ctx.rect(roadX, 0, roadWidth, canvas.height);
  ctx.clip();

  // Draw lane markings
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  const laneMarkingHeight = 20;
  const laneMarkingGap = 20;
  roadLineOffset += vehicle.getSpeed() * 0.0075; // Slow down the line movement
  if (roadLineOffset > (laneMarkingHeight + laneMarkingGap)) {
    roadLineOffset = 0;
  }

  for (let y = roadLineOffset - (laneMarkingHeight + laneMarkingGap); y < canvas.height; y += laneMarkingHeight + laneMarkingGap) {
    ctx.beginPath();
    ctx.moveTo(roadX + roadWidth / 2, y);
    ctx.lineTo(roadX + roadWidth / 2, y + laneMarkingHeight);
    ctx.stroke();
  }

  // Restore the clipping region
  ctx.restore();

  // Draw visible elements
  const visibleElements = trip.getVisibleElements(1000); // View distance of 300 meters
  visibleElements.forEach((element) => {
    const roadWidth = canvas.width / 3;
    const elementX = canvas.width / 2 + element.horizontalPosition * roadWidth; // Position based on horizontal offset
    const elementY = canvas.height - (element.distance - trip.getDistance()); // Position based on distance, independent of line movement
    ctx.drawImage(
      element.sprite,
      elementX - element.size / 2, // Center horizontally
      elementY - element.size, // Position vertically
      element.size, // Width
      element.size // Height
    );
  });

  // Draw the vehicle (red car) with vibration
  const carWidth = 50;
  const carHeight = 50;
  const vibration = Math.random() * vehicle.getSpeed() * 0.02 - vehicle.getSpeed() * 0.01;
  ctx.drawImage(
    carImage,
    roadX + roadWidth / 2 - carWidth / 2 + carPositionX,
    canvas.height - 80 + vibration,
    carWidth,
    carHeight
  );
}

function startAccelerating() {
  vehicle.accelerate();
}

function stopAccelerating() {
  vehicle.stopAccelerating();
}

function applyBrakes() {
  vehicle.speed = Math.max(0, vehicle.speed * 0.9);
}

function releaseBrakes() {
  // Logic for releasing brakes can be added here if needed
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    startAccelerating();
  } else if (event.key === 'ArrowLeft') {
    isMovingLeft = true;
  } else if (event.key === 'ArrowRight') {
    isMovingRight = true;
  } else if (event.key === 'ArrowDown') {
    applyBrakes();
  }
}

function handleKeyUp(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    stopAccelerating();
  } else if (event.key === 'ArrowLeft') {
    isMovingLeft = false;
  } else if (event.key === 'ArrowRight') {
    isMovingRight = false;
  } else if (event.key === 'ArrowDown') {
    releaseBrakes();
  }
}

onMounted(() => {
  isRunning.value = true;
  lastTimestamp = performance.now();
  requestAnimationFrame(gameTick);

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  isRunning.value = false;
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});
</script>
