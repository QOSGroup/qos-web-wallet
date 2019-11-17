import store from '../store'
import { ToPage } from './business/types'
import * as types from './store/mutation-types'

export function registerGloablFunction (global) {
  global.getBgState = function () {
    setTimeout(() => {
      store.commit(types.INPUT_TOPAGE_PARAMS, new ToPage({ pageName: '', params: {} }))
    }, 0)
    return Object.assign({}, store.state)
  }

  global.getFirstMsg = async function () {
    return store.getters.firstMsg
  }

  global.msgProcessed = function (msgIndex, msg) {
    msgIndex = msgIndex || 0
    // 删除指定索引消息, 并回调
    store.commit(types.DELETE_MSG_PROCESSED, { msgIndex, msg })
  }

  // 保存账户信息
  global.saveAccount = function () {

  }
}
