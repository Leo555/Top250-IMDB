import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import * as helpers from 'helpers'
import * as stringHelper from 'helpers/string'
import SearchBarItem from 'components/search/SearchBarItem'
import Icon from 'components/Icon'
import { Button, Input, Autocomplete, Row, Col } from 'element-ui'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

const components = [
  Button,
  SearchBarItem,
  Input,
  Row,
  Col,
  Autocomplete,
  Icon
]

components.forEach((item) => Vue.component(item.name, item))

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
  template: '<App/>',
  components: {App}
})
