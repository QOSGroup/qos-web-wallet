import * as types from './mutation-types'
import { isNotEmpty } from '../utils'
import extensionizer from 'extensionizer'
import clone from 'clone'

export default {
  [types.UPDATE_FOO] (state, payload) {
    state.foo = payload
  },
  [types.ADD_ACTIONNUM] (state, payload) {
    let num = state.actionNum
    num = num === '' ? 1 : (Number(num) + 1)
    state.actionNum = num.toString()
    extensionizer.browserAction.setBadgeText({ text: state.actionNum })
  },
  [types.DELETE_ACTIONNUM] (state, payload) {
    let num = state.actionNum
    if (isNotEmpty(num)) {
      num = Number(num) - 1
      num = num === 0 ? '' : num.toString()
    }
    state.actionNum = num.toString()
    extensionizer.browserAction.setBadgeText({ text: state.actionNum })
  },
  [types.INPUT_TOPAGE_PARAMS] (state, payload) {
    state.toPage = payload
  },
  [types.ADD_MSG_QUEUE] (state, payload) {
    console.log('types.ADD_MSG_QUEUE===', payload)
    state.msgQueue.push(payload)
  },
  [types.CLONE_STATE] (state, payload) {
    const keyArr = payload.keyArr
    const bgState = payload.bgState
    for (const item of keyArr) {
      state[item] = clone(bgState[item])
    }
  },
  [types.HAS_DIRECT_PAGE] (state, payload) {
    // state.msgQueue[0].hasDirect = true
  },
  [types.DELETE_MSG_PROCESSED] (state, payload) {
    const msgQueue = state.msgQueue
    const msgs = msgQueue.splice(payload.msgIndex, 1)
    if (msgs.length > 0) {
      // 赋值回调消息索引
      console.log(' 赋值回调消息索引', msgs[0])
      payload.msg.callbackId = msgs[0].callbackId
      // 回调消息
      msgs[0].sendResponse(payload.msg)
    }
    state.msgQueue = msgQueue
  },
  [types.SET_ACCOUNT] (state, payload) {
    const accs = state.accounts
    let acc = accs.find(x => x.address === payload.address)
    if (acc) {
      acc = payload
      return
    }
    state.accounts.push(payload)
  },
  [types.DELETE_ACCOUNT] (state, payload) {
    const accs = state.accounts
    let index = accs.findIndex(x => x.address === payload.address)
    console.log(payload.address, index)
    if (index > -1) {
      state.accounts.splice(index, 1)
    }
  }
}
