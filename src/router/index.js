import Router from 'vue-router'
import Main from 'components/main/Index'
import View from 'components/view/Index'
import Search from 'components/view/Search'
import NotFound from 'components/view/NotFound'
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

const updateTitle = to => {
  if (to.name === 'View') {
    document.title = to.params.name
  } else if (to.name === 'Search') {
    document.title = `搜索：${to.params.keyword}- IMDB top250`
  } else if (to.name === '404') {
    document.title = `404 - IMDB top250`
  } else {
    document.title = `IMDB top250`
  }
}

router.afterEach((to, from) => {
  NProgress.done()
  updateTitle(to)
})

export default router
