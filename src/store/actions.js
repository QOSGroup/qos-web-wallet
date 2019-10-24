import * as types from './mutation-types'
import { ToPage } from '../business/types'

export const setFoo = ({ commit }, payload) => {
  commit(types.UPDATE_FOO, payload)
}

export const getToPage = ({ commit, state, getters }, payload) => {
  console.log('state.toPage', JSON.stringify(state.toPage), getters.toPage)
  const obj = Object.assign({}, state.toPage)
  commit(types.INPUT_TOPAGE_PARAMS, new ToPage({ pageName: '', params: obj.params }))
  return obj
}
