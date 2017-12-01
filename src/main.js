import 'es6-promise/auto'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import App from 'components/App'
import router from './router'
import store from './store'
import * as helpers from 'helpers'
import * as stringHelper from 'helpers/string'
import SearchBarItem from 'components/search/SearchBarItem'
import NotFound from 'components/view/NotFound'
import Icon from 'components/Icon'
import { Button, Input, Autocomplete, Row, Col } from 'element-ui'
import VueLazyload from 'vue-lazyload'
import 'nprogress/nprogress.css'
import 'styles/components/nprogress.less'
import { KEYWORDS, DESCRIPTION } from 'constants/index'
Vue.config.productionTip = false

const components = [
  Button,
  SearchBarItem,
  NotFound,
  Input,
  Row,
  Col,
  Autocomplete,
  Icon
]

components.forEach((item) => Vue.component(item.name, item))

Vue.use(VueRouter)
Vue.use(Meta)
Vue.use(VueLazyload, {
  error: '/static/img/movie.png',
  loading: '/static/img/movie.png',
  attempt: 1
})

// register global utility filters.
let _filters = Object.assign(helpers, stringHelper)
Object.keys(_filters).forEach(key => {
  Vue.filter(key, _filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  metaInfo: {
    meta: [
      {vmid: 'description', name: 'description', content: DESCRIPTION},
      {vmid: 'keywords', name: 'keywords', content: KEYWORDS}
    ]
  },
  template: '<App/>',
  components: {App}
})
