import { getToken, getAccountList } from '../../utils/auth'

const whiteListPage = ['/login', '/register']

export function beforeEach (to, from, next) {
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
}
