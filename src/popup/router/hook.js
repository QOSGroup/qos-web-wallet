import { getAccountList } from '../../business/auth'
import store from '@/store'
import * as types from '@/store/mutation-types'
// import { ToPage } from '../../business/types'
import {
  isNotEmpty, isNotEmptyObject
} from '../../utils'
const extension = require('extensionizer')

// 非登录权限下使用
const whiteListPage = ['/login/login', '/register/register', '/wallet/create', '/wallet/result', '/wallet/import']

// 获取backgroud.js中store中的state
const bg = extension.extension.getBackgroundPage()
const bgState = bg.getBgState()
// 无论是否登录,将bg store的msgQueue[0]拷贝至popup页面的store.state.msgQueueLast
store.commit(types.SET_MSGQUEUE_LAST, bgState.msgQueue[bgState.msgQueue.length - 1])
// 已经登录,直接进行bg store的拷贝
if (bgState.accounts.length !== 0) {
  store.commit(types.CLONE_STATE, { keyArr: ['accounts', 'currentAccount', 'passCheck'], bgState })
}
export async function beforeEach (to, from, next) {
  const accounts = store.getters.accounts
  // 是否未登录
  if ((!accounts || accounts.length === 0) && whiteListPage.indexOf(to.path) === -1) {
    const accs = await getAccountList()
    console.log('....', from.name, to.name)
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

  // 获取popup store中的msgQueueLast
  const last = store.getters.msgQueueLast
  console.log('msgQueueLast: --- popup ---', last)
  if (isNotEmptyObject(last)) {
    const data = last.params
    // console.log('from.params---', from, from.params)
    // console.log('to.params---', to, to.params)
    if (isNotEmpty(data.pageName) && !last.hasDirect) {
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

window.onbeforeunload = function (e) {
  // // 页面关闭之前，删除当前正在处理的消息，根据callbackId进行删除处理
  const last = store.getters.msgQueueLast
  bg.deleteMsg(last)
}
