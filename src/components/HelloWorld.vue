<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-center fill-height mx-auto"
      max-width="900"
    >
      <v-img
        class="mb-4"
        height="250"
        src="@/assets/splash-logo.jpg"
      />

      <div class="text-center">
        <h1 class="text-h2 font-weight-bold">Driving Up the Mountain!</h1>
        
        <p class="text-body-1">
The road to the top is treacherous, and only the bold dare to face it. Your car’s engine is strong, but it won’t last forever—keep an eye out for hazards, breakdowns, and anything that could stop you in your tracks.
Collect coins, upgrade your vehicle, and make critical repairs to push further up the mountain.

The higher you climb, the harder it gets. Will you make it to the summit, or will the mountain claim you first?

Are you ready to drive?</p>
      </div>

      <div class="py-4" />

      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-btn
            class="ma-2"
            color="primary"
            block
            @click="startNewGame"
          >
            New Game
          </v-btn>
        </v-col>

        <v-col cols="12" md="6">
          <v-btn
            class="ma-2"
            color="secondary"
            block
            @click="continueGame"
          >
            Continue Game
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function startNewGame() {
  router.push({ name: 'Game' }); // Navigate to the "Game" page
}

function continueGame() {
  // Logic for continuing a game
}
</script>
