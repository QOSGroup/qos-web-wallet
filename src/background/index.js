import store from '../store'
import * as types from '../store/mutation-types'
import QOSRpc from 'js-for-qos-httprpc'
import {
  decrypt
} from '../utils/crypt'
import {
  getAccountList,
  setAccount
} from '../business/auth'
import {
  isNotEmpty
} from '../utils'

export function registerGloablFunction (global) {
  const qosRpc = new QOSRpc({
    baseUrl: ''
  })
  global.getBgState = function () {
    // setTimeout(() => {
    //   store.commit(types.INPUT_TOPAGE_PARAMS, new ToPage({
    //     pageName: '',
    //     params: {}
    //   }))
    // }, 0)
    return store.state
  }

  global.msgProcessed = function (msg, msgIndex) {
    msgIndex = msgIndex || 0
    // 删除指定索引消息, 并回调
    store.commit(types.DELETE_MSG_PROCESSED, {
      msgIndex,
      msg
    })
  }

  // 注销时store移除账户
  global.accountDelete = function (account) {
    store.commit(types.DELETE_ACCOUNT, account)
  }

  // 保存账户信息
  global.saveAccount = async function ({
    privateKey,
    mnemonic,
    pwd
  }) {
    return new Promise(async (resolve) => {
      let account
      if (privateKey) {
        account = qosRpc.recoveryAccountByPrivateKey(privateKey)
        // 账户本地持久化
        await setAccount(account, pwd)
        store.commit(types.SET_ACCOUNT, account)
        return resolve(account)
      }
      if (mnemonic) {
        account = qosRpc.importAccount(mnemonic)
        // 账户本地持久化
        await setAccount(account, pwd)
        store.commit(types.SET_ACCOUNT, account)
        return resolve(account)
      }
    })
  }

  global.login = async function (pwd) {
    const list = await getAccountList()
    const accountList = []
    for (const acc of list) {
      let privateKey = decrypt(acc.encryptKey, pwd)
      // 解密失败，密码不正确
      if (!isNotEmpty(privateKey)) {
        return false
      }
      let account = qosRpc.recoveryAccountByPrivateKey(privateKey)
      // 返回登录的账户列表
      accountList.push(account)
      // 存储至store中,这其中的存储用于判断是否登录
      store.commit(types.SET_ACCOUNT, account)
    }
    // 调用设置当前账户

    return accountList
  }
}
