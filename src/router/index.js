import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Öppna dokument',
      component: HomeView,
      // This one loads even if it's not visited. Use for important pages that needs fast loading.
    },
    {
      path: '/create',
      name: 'Nytt dokument',
      component: () => import('../views/NewDocView.vue'),
    },
    {
      path: '/:id/:type',
      name: 'DocView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DocView.vue'),
    },
    {
      path: '/fail',
      name: 'Fail',
      component: () => import('../views/FailView.vue'),
    },
    {
      path: '/login',
      name: 'LoginView',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'RegisterView',
      component: () => import('../views/RegisterView.vue'),
    }
  ],
})

export default router
