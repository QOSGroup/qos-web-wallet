import * as types from './mutation-types'
import { isNotEmpty } from '../utils'
import extensionizer from 'extensionizer'

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
  }
}
