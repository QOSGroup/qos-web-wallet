import store from '../store'
import * as types from '../store/mutation-types'
import {
  decrypt,
  encrypt
} from '../utils/crypt'
import {
  getAccountList,
  setAccount,
  getCurrentAccount,
  setCurrentAccount
} from '../business/auth'
import {
  isNotEmpty,
  isNotEmptyObject
} from '../utils'
import { rpc } from '@/utils/rpc'

// 注册成功、登录成功、账户切换、修改账户名称:完成持久化存储当前账户信息
export async function setCurrentAccountLocal (accountList, pwd, name) {
  return new Promise(async (resolve) => {
    // 设置当前登录账户:默认所有登录成功账户中的第一个
    const currentAcc = await getCurrentAccount()
    const encryptKey = encrypt(accountList[0].privateKey, pwd)
    const address = accountList[0].address
    if (!name) {
      name = address.substr(address.length - 4, address.length - 1)
    }
    const accCurrent = { name: name, address: address, encryptKey: encryptKey }
    let acc = accountList.find(x => x.address === currentAcc.address)
    // 当前登录账户为空、登录的账户存在accountList中
    if (!isNotEmptyObject(currentAcc) || !acc) {
      await setCurrentAccount(accCurrent)
      store.commit(types.SET_CURRENT_ACCOUNT, accCurrent)
    } else {
      await setCurrentAccount({ name: name, address: acc.address, encryptKey: encrypt(acc.privateKey, pwd) })
      store.commit(types.SET_CURRENT_ACCOUNT, { name: name, address: acc.address, encryptKey: encrypt(acc.privateKey, pwd) })
    }
    return resolve()
  })
}

export function registerGloablFunction (global) {
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

  // 注销
  global.accountCurrentDelete = function () {
    // 不传递account 将设置为null
    store.commit(types.SET_CURRENT_ACCOUNT)
  }

  // bg store 设置当前账户
  global.setCurrentAccount = function (account) {
    // 不传递account 将设置为null
    store.commit(types.SET_CURRENT_ACCOUNT, account)
  }

  // 保存账户信息,创建或导入(助记词或私钥)
  global.saveAccount = async function ({
    privateKey,
    mnemonic,
    pwd,
    name
  }) {
    return new Promise(async (resolve) => {
      let account
      if (privateKey) {
        account = rpc.recoveryAccountByPrivateKey(privateKey)
        // console.log('根据私钥恢复的账户信息:', account)
      }
      if (mnemonic) {
        account = rpc.importAccount(mnemonic)
        // console.log('根据助记词恢复账户信息:', account)
      }
      // 账户列表本地持久化:新增
      await setAccount(account, pwd, name)
      // 当前账户本地持久化:更新
      const list = [account]
      await setCurrentAccountLocal(list, pwd, name)

      // bg store 存储登录信息
      store.commit(types.SET_PASS_CHECK, pwd)
      store.commit(types.SET_ACCOUNT, account)
      return resolve(account)
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
      let account = rpc.recoveryAccountByPrivateKey(privateKey)
      // 返回登录的账户列表
      accountList.push(account)
      // 存储至store中,数组类型,这其中的存储用于判断是否登录
      store.commit(types.SET_ACCOUNT, account)
    }
    // 本地持久化存储当前账户
    await setCurrentAccountLocal(accountList, pwd)
    store.commit(types.SET_PASS_CHECK, pwd)
    // 返回该密码可以解密的账户列表
    return accountList
  }
}
