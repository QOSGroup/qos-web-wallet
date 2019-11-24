
import store from '@/store'
import { encrypt } from '@/utils/crypt'
import { getCurrentAccount } from '@/business/auth'

export const currentIndex = store.getters.accounts.findIndex(x => x.address === getCurrentAccount().address)
export const currentAccount = store.getters.accounts[currentIndex]

// 注册成功、登录成功、账户切换:完成持久化存储当前账户信息
export async function setCurrentAccount (accountList, pwd) {
  // 设置当前登录账户:默认所有登录成功账户中的第一个
  const currentAcc = await getCurrentAccount()
  const encryptKey = encrypt(accountList[0].privateKey, pwd)
  const address = accountList[0].address
  const name = address.substr(address.length - 4, address.length - 1)
  const accCurrent = { name: name, address: address, encryptKey: encryptKey }
  // 当前登录账户为空
  if (currentAcc === null || currentAcc === 'undefined') {
    await setCurrentAccount(accCurrent)
  } else {
    // 当前登录的账户存在,判断是否在accountList中,不在其中,重新设置为accountList第一个
    let acc = accountList.find(x => x.address === currentAcc.address)
    if (!acc) {
      await setCurrentAccount(accCurrent)
    }
  }
}
