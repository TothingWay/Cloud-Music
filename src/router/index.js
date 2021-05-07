import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () => import('@/views/recommend.vue')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend
  },
  {
    path: '/singer',
    component: Recommend
  },
  {
    path: '/rank',
    component: Recommend
  },
  {
    path: '/search',
    component: Recommend
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router