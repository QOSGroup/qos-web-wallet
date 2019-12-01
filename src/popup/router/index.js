import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { beforeEach } from './hook'
// const extension = require('extensionizer')

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

router.beforeEach(beforeEach)

export default router

// extension.runtime.onMessage.addListener(
//   function (request, sender, sendResponse) {
//     if (request.msg === 'something_completed') {
//       //  To do something
//       console.log(request.data.subject)
//       console.log(request.data.content)
//     }
//   }
// )
