import { createRouter, createWebHistory } from 'vue-router'
import TechnicalRequirements from '@/views/TechnicalRequirements.vue'

const routes = [
  {
    path: '/',
    name: 'TechnicalRequirements',
    component: TechnicalRequirements
  },
  {
    path: '/sets/:setId',
    name: 'SetDetails',
    component: TechnicalRequirements,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router