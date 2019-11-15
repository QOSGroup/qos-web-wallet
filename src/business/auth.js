import db from '../utils/db'

const TOKEN_KEY = 'qos-web-wallet-token'
const ACCOUNTLIST = 'qos-account-list'
const CURRENTACCOUNT = 'qos-current-account'
const CURRENTACCOUNTCIPHER = 'qos-current-account-cipher'
const ACCOUNTNAME = 'qos-current-account-name'
const PRIVATEKEY = 'qos-current-privatekey'

export function setToken (token) {
  // return db.setLocal(TOKEN_KEY, token)
  return db.set(TOKEN_KEY, token)
}

export function getToken () {
  // return db.getLocal(TOKEN_KEY)
  return db.get(TOKEN_KEY)
}

/** 设置账户 */
export function setAccount (account) {
  const list = getAccountList()
  if (list && Array.isArray(list)) {
    let acc = list.find(x => x.address === account.address)
    if (acc) {
      acc = account
      return
    }
    list.push(account)
  }
}

/** 获取账户列表 */
export function getAccountList () {
  // return db.getLocal(ACCOUNTLIST)
  return db.get(ACCOUNTLIST)
}
export function setAccountList (list) {
  // return db.setLocal(ACCOUNTLIST, list)
  return db.set(ACCOUNTLIST, list)
}

export function setCurrentAccount (account) {
  // return db.setLocal(CURRENTACCOUNT,account)
  return db.set(CURRENTACCOUNT, account)
}

export function getCurrentAccount () {
  // return db.getLocal(CURRENTACCOUNT)
  return db.get(CURRENTACCOUNT)
}

export function setCurrentAccountCipher (accountCipher) {
  // return db.setLocal(CURRENTACCOUNT,account)
  return db.set(CURRENTACCOUNTCIPHER, accountCipher)
}

export function getCurrentAccountCipher () {
  // return db.getLocal(CURRENTACCOUNT)
  return db.get(CURRENTACCOUNTCIPHER)
}

export function setAccountName (name) {
  // return db.setLocal(CURRENTACCOUNT,account)
  return db.set(ACCOUNTNAME, name)
}

export function getAccountName () {
  // return db.getLocal(CURRENTACCOUNT)
  return db.get(ACCOUNTNAME)
}

export function setPrivateKey (name) {
  // return db.setLocal(CURRENTACCOUNT,account)
  return db.set(PRIVATEKEY, name)
}

export function getPrivateKey () {
  // return db.getLocal(CURRENTACCOUNT)
  return db.get(PRIVATEKEY)
}
