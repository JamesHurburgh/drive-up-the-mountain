/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { createRouter, createWebHistory } from 'vue-router';
import SplashPage from '@/components/SplashPage.vue';
import Game from '@/views/Game.vue';
import GameFinished from '@/views/GameFinished.vue';

const routes = [
  { path: '/', name: 'SplashPage', component: SplashPage }, // Ensure this path and name are correct
  { path: '/game', name: 'Game', component: Game },
  { path: '/game-finished', name: 'GameFinished', component: GameFinished },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
