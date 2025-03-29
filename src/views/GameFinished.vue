<template>
  <v-container class="fill-height">
    <div class="text-center">
      <h1 class="text-h2 font-weight-bold">Congratulations!</h1>
      <p class="text-body-1">You have reached your goal. Well done!</p>
      <v-btn class="ma-2" color="primary" @click="goToSplash">
        Back to Main Menu
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToSplash() {
  try {
    router.push({ name: 'SplashPage' });
  } catch (error) {
    console.error('Failed to navigate to SplashPage:', error);
    alert('Failed to navigate to the main menu. Please try again.');
  }
}
</script>
