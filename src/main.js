import 'es6-promise/auto'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import App from 'components/App'
import router from './router'
import store from './store'
import * as helpers from 'helpers'
import SearchBarItem from 'components/search/SearchBarItem'
import NotFound from 'components/view/NotFound'
import Icon from 'components/Icon'
import { Button, Input, Autocomplete, Row, Col } from 'element-ui'
import 'nprogress/nprogress.css'
import 'styles/components/nprogress.less'
import { TITLE, KEYWORDS, DESCRIPTION } from 'constants/index'
import { INIT_MOVIES_DATA } from 'constants/actions'
import lazyload from 'directives/lazyload'

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
Vue.directive('lazy', lazyload)

// register global utility filters.
let _filters = Object.assign({}, helpers)
Object.keys(_filters).forEach(key => {
  Vue.filter(key, _filters[key])
})

const metaInfo = {
  title: TITLE,
  meta: [
    {vmid: 'description', name: 'description', content: DESCRIPTION},
    {vmid: 'keywords', name: 'keywords', content: KEYWORDS}
  ]
}

/* eslint-disable no-new */
document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    router,
    store,
    metaInfo,
    template: '<App/>',
    components: {App}
  }).$mount('#app')

  // 异步加载电影数据，不阻塞首屏渲染
  store.dispatch(INIT_MOVIES_DATA)
})
