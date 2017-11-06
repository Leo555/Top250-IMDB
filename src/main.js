import Vue from 'vue'
import App from './App'
import router from './router'
import * as helpers from 'helpers'
import * as stringHelper from 'helpers/string'
import SearchBarItem from 'components/Search/SearchBarItem.vue'
import Icon from 'components/Icon.vue'
import { Button, Input, Autocomplete, Row, Col } from 'element-ui'

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

// register global utility filters.
let _filters = Object.assign(helpers, stringHelper)
Object.keys(_filters).forEach(key => {
  Vue.filter(key, _filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
