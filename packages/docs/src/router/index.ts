import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home-view.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/search-view.vue')
    },
    {
      path: '/:content+',
      name: 'content',
      component: () => import('../components/content-frame.vue')
    }
  ]
})

export default router
