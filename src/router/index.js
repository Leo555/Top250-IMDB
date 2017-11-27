import Router from 'vue-router'
import NProgress from 'nprogress'
import { TITLE } from 'constants/index'
import store from 'store'
const Main = () => import('components/main/Index')
const View = () => import('components/view/Index')
const Search = () => import('components/view/Search')
const NotFound = () => import('components/view/NotFound')
const movies = store.state.movies

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

const getMovieTitle = id => {
  let movie = movies.find(m => m.id === id)
  return movie.name
}

const updateTitle = to => {
  if (to.name === 'View') {
    document.title = to.params.title || getMovieTitle(to.params.id) || TITLE
  } else if (to.name === 'Search') {
    document.title = `搜索：${decodeURIComponent(to.params.keyword)}- ${TITLE}`
  } else if (to.name === '404') {
    document.title = `404 - ${TITLE}`
  } else {
    document.title = TITLE
  }
}

router.afterEach((to, from) => {
  NProgress.done()
  updateTitle(to)
})

export default router
