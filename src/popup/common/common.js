
import {
  setToken,
  setCurrentAccount,
  setCurrentAccountCipher,
  setAccountName,
  setPrivateKey
} from '@/business/auth'
import { encrypt } from '@/utils/crypt'
// 本地存储
export function setLoaclStorage (account, password) {
  // 设置accountName
  setAccountName('账户名')
  // 设置setCurrentAccount
  setCurrentAccount(account.address)

  setCurrentAccountCipher(encrypt(account.address, password))
  // 设置登陆token,使用密码(this.form.password)加密address,暂时存储成明文.
  // todo 加密操作
  // setToken(encrypt(account.address, password))
  console.log(account)
  setToken(account)

  // 存储私钥密文=使用特殊加密方式加密私钥,暂时存储成明文.
  // todo 加密操作
  setPrivateKey(encrypt(account.privateKey, password))
}
