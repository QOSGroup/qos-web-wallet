import { getAccountList2 } from '../../business/auth'
import store from '@/store'
import * as types from '@/store/mutation-types'
// import { ToPage } from '../../business/types'
import {
  isNotEmpty
} from '../../utils'
const extension = require('extensionizer')

// 非登录权限下使用
const whiteListPage = ['/login/login', '/register/register', '/wallet/create', '/wallet/result', '/wallet/import']
// const whiteListPage = ['/login', '/register', '/transfer', '/newwallet', '/newwalletresult', '/importwalletwithseed', '/homepage', '/delegateorunbond', '/txresult', '/accountlist', '/newaccount', '/importaccount']

// 获取backgroud.js中store中的state
const bg = extension.extension.getBackgroundPage()
const bgState = bg.getBgState()
// store.commit(types.CLONE_STATE, { keyArr: ['msgQueue'], bgState })

export async function beforeEach (to, from, next) {
  store.commit(types.CLONE_STATE, { keyArr: ['msgQueue', 'accounts'], bgState })
  console.log('MsgQueue first----:', store.getters.firstMsg)
  const accounts = store.getters.accounts
  console.log(`(!accounts || accounts.length === 0) && whiteListPage.indexOf(to.path) === -1`,
    (!accounts || accounts.length === 0), whiteListPage.indexOf(to.path) === -1, from.path, to.path)
  // 是否未登录
  if ((!accounts || accounts.length === 0) && whiteListPage.indexOf(to.path) === -1) {
    const accs = await getAccountList2()
    console.log('.....', from.name, to.name)
    // if (from.name === to.name) {
    //   return next()
    // }
    if (!accs || accs.length === 0) {
      next({ name: 'register' })
      return
    }
    next('/login/login')
    return
  }

  const first = store.getters.firstMsg
  console.log('MsgQueue first:', first)
  if (isNotEmpty(first)) {
    const data = first.params
    // console.log('from.params---', from, from.params)
    // console.log('to.params---', to, to.params)
    if (isNotEmpty(data.pageName) && !first.hasDirect) {
      // 更新当前first data 为已跳转页面状态
      store.commit(types.HAS_DIRECT_PAGE)
      next({
        name: data.pageName,
        params: { hasDirect: true }
      })
      return
    }
  }
  next()
}
