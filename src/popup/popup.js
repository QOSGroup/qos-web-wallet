import Vue from 'vue'
import App from './App'
import store from '../store'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import {
  Form,
  FormItem,
  Input,
  Button
} from 'element-ui'

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
