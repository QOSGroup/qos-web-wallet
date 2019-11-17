import * as types from './mutation-types'
import { ToPage } from '../business/types'

export const setFoo = ({ commit }, payload) => {
  commit(types.UPDATE_FOO, payload)
}

export const getToPage = ({ commit, state, getters }) => {
  console.log('state.toPage', JSON.stringify(state.toPage), getters.toPage)
  const obj = Object.assign({}, state.toPage)
  commit(types.INPUT_TOPAGE_PARAMS, new ToPage({ pageName: '', params: obj.params }))
  return obj
}

export const getFirstMsg = ({ state }) => {
  return state.msgQueue[0]
}

export const getAccounts = ({ state }) => {
  return state.accounts
}
