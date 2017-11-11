import Router from 'vue-router'
import Main from 'components/main/Index'
import View from 'components/view/Index'
import Search from 'components/view/Search'
import NotFound from 'components/main/NotFound'
import NProgress from 'nprogress'

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
      path: '',
      component: Main
    }, {
      path: '/view/:name',
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
