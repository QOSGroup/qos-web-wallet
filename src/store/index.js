import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    actionNum: '',
    toPage: {
      pageName: '',
      params: {}
    },
    // 仅background store用于存储所有消息
    msgQueue: [],
    // 仅popup store使用
    msgQueueFirst: {},
    // background popup使用
    accounts: [],
    // 存储一个对象与持久化存储中的currentAccount一致,仅在popup store存储
    currentAccount: {},
    passCheck: ''
  },
  getters,
  mutations,
  actions
})
