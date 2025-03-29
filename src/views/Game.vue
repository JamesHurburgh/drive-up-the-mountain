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
      <v-btn
        class="ma-2"
        color="success"
        depressed
        @mousedown="startAccelerating"
        @mouseup="stopAccelerating"
        @mouseleave="stopAccelerating"
      >
        Accelerate
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Trip } from '@/models/Trip';
import { Vehicle } from '@/models/Vehicle';
import redCarImage from '@/assets/red-car.png'; // Import the red-car asset

const isRunning = ref(false);
let lastTimestamp = 0;
const router = useRouter();
const trip = reactive(new Trip(0, 1000)); // Initial distance: 0, goal: 1000 meters
const vehicle = reactive(new Vehicle(0, 100, 200, 5, 2)); // Initial speed: 0, fuel: 100%, max speed: 50, acceleration: 5, drag: 2

const distanceDisplay = computed(() => trip.getDistance().toFixed(2));
const speedDisplay = computed(() => (vehicle.getSpeed()).toFixed(2)); // km/h
const fuelDisplay = computed(() => vehicle.getFuelLevel().toFixed(2));
const distancePercentage = computed(() => ((trip.getDistance() / trip.goal) * 100).toFixed(2));

let roadLineOffset = 0; // Offset for the road lines
const carImage = new Image();
carImage.src = redCarImage; // Preload the car image

function gameTick(timestamp: number) {
  if (!isRunning.value) return;

  const delta = (timestamp - lastTimestamp) / 1000; // Convert delta to seconds
  lastTimestamp = timestamp;

  vehicle.onTick(delta); // Update vehicle stats based on physics
  const distanceTraveled = vehicle.getSpeed() * delta; // Speed * time in seconds
  trip.updateDistance(distanceTraveled);

  if (trip.isGoalReached()) {
    console.log('Goal reached! Game over.');
    isRunning.value = false;
    router.push('/game-finished'); // Use the path instead of the route name
    return;
  }

  drawCanvas(); // Update the canvas on each tick

  console.log(`Distance traveled: ${trip.getDistance()} meters, Speed: ${vehicle.getSpeed()} m/s, Fuel level: ${vehicle.getFuelLevel()}%`);
  requestAnimationFrame(gameTick);
}

function drawCanvas() {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the sky
  ctx.fillStyle = 'skyblue';
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

  // Draw the grass
  ctx.fillStyle = 'green';
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

  // Draw the road
  ctx.fillStyle = 'gray';
  const roadWidth = canvas.width / 3;
  const roadX = (canvas.width - roadWidth) / 2;
  ctx.fillRect(roadX, canvas.height / 2, roadWidth, canvas.height / 2);

  // Clip to the road area
  ctx.save();
  ctx.beginPath();
  ctx.rect(roadX, canvas.height / 2, roadWidth, canvas.height / 2);
  ctx.clip();

  // Draw lane markings
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  const laneMarkingHeight = 20;
  const laneMarkingGap = 20;
  roadLineOffset += vehicle.getSpeed() * 0.1; // Adjust the offset based on the vehicle's speed
  if (roadLineOffset > (laneMarkingHeight + laneMarkingGap)) {
    roadLineOffset = 0; // Reset the offset when it exceeds the total marking height
  }

  for (let y = canvas.height / 2 + roadLineOffset; y < canvas.height; y += laneMarkingHeight + laneMarkingGap) {
    ctx.beginPath();
    ctx.moveTo(roadX + roadWidth / 2, y);
    ctx.lineTo(roadX + roadWidth / 2, y + laneMarkingHeight);
    ctx.stroke();
  }

  // Restore the clipping region
  ctx.restore();

  // Draw the vehicle (red car)
  const carWidth = 50;
  const carHeight = 50;
  ctx.drawImage(carImage, roadX + roadWidth / 2 - carWidth / 2, canvas.height - 80, carWidth, carHeight);
}

function startAccelerating() {
  vehicle.accelerate();
}

function stopAccelerating() {
  vehicle.stopAccelerating();
}

function toggleGame() {
  isRunning.value = !isRunning.value;
  if (isRunning.value) {
    lastTimestamp = performance.now();
    requestAnimationFrame(gameTick);
  }
}

onMounted(() => {
  isRunning.value = true;
  lastTimestamp = performance.now();
  requestAnimationFrame(gameTick);
});

onUnmounted(() => {
  isRunning.value = false;
});
</script>
