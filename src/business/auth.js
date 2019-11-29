import db from '../utils/db'
import { encrypt } from '../utils/crypt'

// const TOKEN_KEY = 'qos-web-wallet-token'
const ACCOUNTLIST = 'qos-account-list'
const CURRENTACCOUNT = 'qos-current-account'

// export function setToken (token) {
//   return db.set(TOKEN_KEY, token)
// }

// export function getToken () {
//   return db.get(TOKEN_KEY)
// }

/** 设置账户 */
export async function setAccount (account, pwd, name) {
  let list = await getAccountList()
  // {address,privateKey}
  let acc
  if (list && Array.isArray(list)) {
    acc = list.find(x => x.address === account.address)
  } else {
    list = []
  }
  const encryptKey = encrypt(account.privateKey, pwd)
  if (!name) {
    name = account.address.substr(account.address.length - 4, account.address.length - 1)
  }
  if (acc) {
    // acc = { name: name, address: account.address, encryptKey: encryptKey }
    acc.name = name
  } else {
    list.push({ name: name, address: account.address, encryptKey: encryptKey })
  }
  await setAccountList(list)
}

/** 获取账户列表 */
export async function getAccountList () {
  const acclist = await db.getLocal(ACCOUNTLIST)
  return acclist
}
export async function setAccountList (list) {
  await db.setLocal(ACCOUNTLIST, list)
}

/** 设置账户--使用localstorage */
export function setAccount2 (account, pwd) {
  let list = getAccountList2()
  if (list == null) {
    list = []
  }
  // {name,address,encryptKey}
  if (list && Array.isArray(list)) {
    let acc = list.find(x => x.address === account.address)
    const encryptKey = encrypt(account.privateKey, pwd)
    const name = account.address.substr(account.address.length - 4, account.address.length - 1)
    if (acc) {
      acc = { name: name, address: account.address, encryptKey: encryptKey }
    } else {
      list.push({ name: name, address: account.address, encryptKey: encryptKey })
    }
    setCurrentAccount({ name: name, address: account.address, encryptKey: encryptKey })
  }
  setAccountList2(list)
}

/** 获取账户列表--使用localstorage */
export function getAccountList2 () {
  const acclist = db.get(ACCOUNTLIST)
  return acclist
}
export function setAccountList2 (list) {
  db.set(ACCOUNTLIST, list)
}

export function setCurrentAccount (account) {
  return db.setLocal(CURRENTACCOUNT, account)
}

export function getCurrentAccount () {
  return db.getLocal(CURRENTACCOUNT)
}
