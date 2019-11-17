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
  TableColumn,
  Slider,
  Radio,
  RadioButton,
  RadioGroup,
  Select,
  Option,
  Upload,
  Link,
  Dialog
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
Vue.use(Slider)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Upload)
Vue.use(Link)
Vue.use(Dialog)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
