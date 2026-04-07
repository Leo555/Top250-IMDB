import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/page/:page',
    name: 'Page',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/view/:id',
    name: 'Detail',
    component: () => import('@/views/Detail.vue'),
  },
  {
    path: '/search/:keyword',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1,
})

router.beforeEach((to, from, next) => {
  if (from.path !== to.path) {
    NProgress.start()
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
