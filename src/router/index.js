import Vue from 'vue'
import Router from 'vue-router'
import Index from 'components/Index'
import Main from 'components/main/Index'
import View from 'components/view/Index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/',
      component: Index,
      meta: Object.assign({keepAlive: true}),
      children: [{
        name: 'Main',
        path: '',
        component: Main
      }, {
        path: '/view/:name',
        name: 'View',
        component: View
      }]
    }
  ]
})
