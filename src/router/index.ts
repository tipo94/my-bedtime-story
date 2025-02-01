import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import StoryCreator from '@/views/StoryCreator.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/create'
  },
  {
    path: '/create',
    name: 'StoryCreator',
    component: StoryCreator
  },
  // Add a catch-all route to redirect old tab paths
  {
    path: '/tabs/:pathMatch(.*)*',
    redirect: '/create'
  },
  // Add a catch-all route for any other unknown paths
  {
    path: '/:pathMatch(.*)*',
    redirect: '/create'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
