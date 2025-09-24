import { createRouter, createWebHistory } from 'vue-router'
import DocList from '@/components/DocList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Listan',
      component: DocList,
      // This one loads even if it's not visited. Use for important pages that needs fast loading.
    },
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    {
      path: '/:id',
      name: 'UpdateDoc',
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
  ],
})

export default router
