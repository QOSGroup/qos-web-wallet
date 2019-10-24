import { getToken, getAccountList } from '../../business/auth'
import store from '@/store'
import * as types from '@/store/mutation-types'
import { ToPage } from '../../business/types'
import { isNotEmpty } from '../../utils'
import clone from 'clone'
// import { isNotEmpty } from '../../utils'
const extension = require('extensionizer')

const whiteListPage = ['/login', '/register', '/transfer']

// 获取backgroud.js中store中的state
const bg = extension.extension.getBackgroundPage()
const bgState = bg.getBgState()
store.commit(types.SET_MSG_QUEQUE, clone(bgState.msgQueue))
store.commit(types.INPUT_TOPAGE_PARAMS, new ToPage(bgState.toPage))
console.log('bgState.msgQueue', bgState.msgQueue)

export async function beforeEach (to, from, next) {
  // const first = await bg.getFirstMsg()
  const first = store.getters.firstMsg
  console.log('store.getters.firstMsg', store.getters.firstMsg)
  if (isNotEmpty(first)) {
    const data = first.params
    if (isNotEmpty(data.pageName) && !first.hasDirect) {
      // 更新当前first data 为已跳转页面状态
      store.commit(types.HAS_DIRECT_PAGE)
      next({ name: data.pageName })
      return
    }
  }
  // const toPage = await store.dispatch('getToPage')
  // if (isNotEmpty(toPage.pageName)) {
  //   next({ name: toPage.pageName })
  //   return
  // }

  if (!getToken() && whiteListPage.indexOf(to.path) === -1) {
    console.log('real to page name', to.name)
    // 判断是否有token
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
