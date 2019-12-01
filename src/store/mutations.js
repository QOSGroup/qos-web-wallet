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
    console.log('types.ADD_MSG_QUEUE-----------------start')
    state.msgQueue.push(payload)
    console.log(state.msgQueue)
    console.log('types.ADD_MSG_QUEUE-----------------end')
  },
  [types.CLONE_STATE] (state, payload) {
    const keyArr = payload.keyArr
    const bgState = payload.bgState
    for (const item of keyArr) {
      state[item] = clone(bgState[item])
    }
  },
  [types.HAS_DIRECT_PAGE] (state, payload) {
    // 修改popup页面的从bg中msgqueue中clone的 第一条消息为hasDirect
    state.msgQueueFirst.hasDirect = true
  },
  [types.DELETE_MSG_PROCESSED] (state, payload) {
    console.log('types.DELETE_MSG_PROCESSED --------- start')
    const msgQueue = state.msgQueue
    const msgs = msgQueue.splice(payload.msgIndex, 1)
    if (msgs.length > 0) {
      let duration = 0
      if (msgs[0].type === 'qosEnable') { // 登录之后先关闭原窗口
        window.qos_noti.closePopup()
        duration = 100
      }
      // 赋值回调callbackId
      console.log('赋值回调消息索引:  ', msgs[0])
      payload.msg.callbackId = msgs[0].callbackId
      // 回调消息
      setTimeout(() => {
        msgs[0].sendResponse(payload.msg)
      }, duration)
    }
    // state.msgQueue = msgQueue
    console.log('state.msgQueue.length', state.msgQueue.length)
    console.log('types.DELETE_MSG_PROCESSED --------- end')
  },
  [types.DELETEMSGBYCALLBACKID] (state, callbackId) {
    const index = state.msgQueue.findIndex(x => x.callbackId === callbackId)
    if (index > -1) {
      state.msgQueue.splice(index, 1)
    }
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
    if (index > -1) {
      state.accounts.splice(index, 1)
    }
  },
  [types.SET_CURRENT_ACCOUNT] (state, payload) {
    if (payload) {
      state.currentAccount = payload
      return
    }
    state.currentAccount = null
  },
  [types.SET_MSGQUEUE_FIRST] (state, payload) {
    if (payload) {
      state.msgQueueFirst = payload
      return
    }
    state.msgQueueFirst = null
  },
  [types.SET_PASS_CHECK] (state, payload) {
    state.passCheck = payload
  }
}
