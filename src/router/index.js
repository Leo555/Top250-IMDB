import Router from 'vue-router'
import NProgress from 'nprogress'
const Main = () => import('components/main/Index')
const View = () => import('components/view/Index')
const Search = () => import('components/view/Search')
const NotFound = () => import('components/view/NotFound')

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1
})

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      name: 'Main',
      path: '/',
      component: Main
    }, {
      path: '/page/:p',
      name: 'Page',
      component: Main
    }, {
      path: '/view/:id',
      name: 'View',
      component: View
    }, {
      path: '/search/:keyword',
      name: 'Search',
      component: Search
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!(from.path === to.path && from.hash !== to.hash)) {
    NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

export default router
