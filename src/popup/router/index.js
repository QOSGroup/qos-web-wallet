import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { getToken, getAccountList } from '../../utils/auth'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

const whiteListPage = ['/login', '/register']

router.beforeEach((to, from, next) => {
  if (!getToken() && whiteListPage.indexOf(to.path) === -1) {
    const accList = getAccountList()
    if (!accList || accList.length === 0) {
      next('/register')
      return
    }
    next('/login')
    return
  }
  next()
})

export default router
