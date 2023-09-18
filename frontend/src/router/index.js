import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CampDetailsView from '../views/CampDetailsView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Fromni'
    },
    component: HomeView
  },
  {
    path: '/:id',
    name: 'detail',
    meta: {
      title: 'Fromni'
    },
    component: CampDetailsView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
