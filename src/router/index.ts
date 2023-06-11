import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/MainView.vue'
import RefactorView from '../views/RefactorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/refactor',
      name: 'RefactorView',
      component: RefactorView
    }
  ]
})

export default router
