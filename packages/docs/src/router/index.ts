import ContentFrame from '@/components/content-frame.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home-view.vue'
import SearchView from '../views/search-view.vue'

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
      component: SearchView
    },
    {
      path: '/:content+',
      name: 'content',
      component: ContentFrame
    }
  ]
})

export default router
