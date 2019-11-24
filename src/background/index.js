import store from '../store'
import {
  ToPage
} from '../business/types'
import * as types from '../store/mutation-types'
import QOSRpc from 'js-for-qos-httprpc'
import {
  encrypt,
  decrypt
} from '../utils/crypt'
import {
  getAccountList,
  setAccount,
  getCurrentAccount,
  setCurrentAccount
} from '../business/auth'
import {
  isNotEmpty
} from '../utils'

export function registerGloablFunction (global) {
  const qosRpc = new QOSRpc({
    baseUrl: ''
  })
  global.getBgState = function () {
    setTimeout(() => {
      store.commit(types.INPUT_TOPAGE_PARAMS, new ToPage({
        pageName: '',
        params: {}
      }))
    }, 0)
    return store.state
  }

  global.msgProcessed = function (msgIndex, msg) {
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
    // 设置当前登录账户:默认所有登录成功账户中的第一个
    const currentAcc = getCurrentAccount()
    const encryptKey = encrypt(accountList[0].privateKey, pwd)
    const address = accountList[0].address
    const name = address.substr(address.length - 4, address.length - 1)
    console.log('currentAcc==', currentAcc)
    // 当前登录账户为空
    if (currentAcc === null || currentAcc === 'undefined') {
      setCurrentAccount({ name: name, address: address, encryptKey: encryptKey })
    } else {
      // 当前登录的账户存在,判断是否在accountList中,不在其中,重新设置为accountList第一个
      let acc = accountList.find(x => x.address === currentAcc.address)
      if (!acc) {
        setCurrentAccount({ name: name, address: address, encryptKey: encryptKey })
      }
    }
    return accountList
  }
}
