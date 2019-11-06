import db from '../utils/db'

const TOKEN_KEY = 'qos-web-wallet-token'
const ACCOUNTLIST = 'qos-account-list'
const CURRENTACCOUNT = 'qos-current-account'

export function setToken (token) {
  return db.set(TOKEN_KEY, token)
}

export function getToken () {
  return db.get(TOKEN_KEY)
}

/** 获取账户列表 */
export function getAccountList () {
  return db.get(ACCOUNTLIST)
}
export function setAccountList (list) {
  return db.set(ACCOUNTLIST, list)
}

// /** 设置账户 */
// export function setAccount (account) {
//   const list = getAccountList()
//   if (list && Array.isArray(list)) {
//     let acc = list.find(x => x.address === account.address)
//     if (acc) {
//       acc = account
//       return
//     }
//     list.push(account)
//   }
// }

// export function getAccountByName(accountName){
//     const list = getAccountList()
//     if (list && Array.isArray(list)) {
//       let acc = list.find(x => x.name === accountName)
//       if (acc) {
//         return acc
//       }
//     }
//     return null
// }

// export function setCurrentAccount(accountName){
//   const acc = getAccountByName(accountName)
//   if (acc) {
//       return db.set(CURRENTACCOUNT, acc)
//   }
//   return null
// }

export function setCurrentAccount(account) {
  return db.set(CURRENTACCOUNT, account)
}

export function getCurrentAcount() {
  return db.get(CURRENTACCOUNT)
}
