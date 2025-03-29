<template>
  <v-container class="fill-height">
    <div class="text-center">
      <h1 class="text-h2 font-weight-bold">Driving Up the Mountain</h1>
      <p class="text-body-1">You're behind the wheel, climbing the treacherous road to the summit. The path is rough, and the higher you go, the harder it gets. Keep an eye on your car’s health—breakdowns, flat tires, and engine trouble are just around the corner. Collect coins and upgrades to keep your vehicle running and push forward. Can you reach the top, or will the mountain stop you in your tracks? Stay focused, stay alive!</p>
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

const isRunning = ref(false);
let lastTimestamp = 0;
const router = useRouter();
const trip = reactive(new Trip(0, 1000)); // Initial distance: 0, goal: 1000 meters
const vehicle = reactive(new Vehicle(10, 100, 50, 5, 2)); // Initial speed: 10, fuel: 100%, max speed: 50, acceleration: 5, drag: 2

const distanceDisplay = computed(() => trip.getDistance().toFixed(2));
const speedDisplay = computed(() => (vehicle.getSpeed() * 3.6).toFixed(2)); // Convert m/s to km/h
const fuelDisplay = computed(() => vehicle.getFuelLevel().toFixed(2));
const distancePercentage = computed(() => ((trip.getDistance() / trip.goal) * 100).toFixed(2));

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

  console.log(`Distance traveled: ${trip.getDistance()} meters, Speed: ${vehicle.getSpeed()} m/s, Fuel level: ${vehicle.getFuelLevel()}%`);
  requestAnimationFrame(gameTick);
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
