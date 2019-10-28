import Vue from 'vue'
import App from './App'
import store from '../store'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'

import {
  Form,
  FormItem,
  Input,
  Button,
  PageHeader,
  Icon,
  Image,
  Divider,
  TabPane,
  Tabs,
  Table,
  TableColumn
} from 'element-ui'

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(PageHeader)
Vue.use(Icon)
Vue.use(Image)
Vue.use(Divider)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Table)
Vue.use(TableColumn)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
