import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/title/HomeScreen.vue'
import GameView from '@/views/title/GameScreen.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView
    },
  ]
})

export default router