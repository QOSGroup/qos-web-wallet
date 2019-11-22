import BaseMsgHandler from './BaseMsgHandler'
import {
  getAccountList2
} from './auth'
import {
  Res
} from '../common/Common'
import store from '../store'
import NotificationManager from '../utils/NotificationManager'

export class EnableHandler extends BaseMsgHandler {
  constructor (oMsg) {
    super(oMsg)
  }

  async handler () {
    // 先判断是否有账户
    let acclist = await getAccountList2()
    // 本地无账户信息
    if (!acclist || acclist.length === 0) {
      this.oMsg.sendResponse(new Res(true, {
        flag: 'unregister'
      }, this.oMsg.callbackId))

      // 跳转注册页, 做store消息预存储，待popup获取跳转注册页
      const noti = new NotificationManager()
      noti.showPopup()
      return
    }
    // 判断store中是否已有登录账户
    acclist = store.getters.accounts
    // 未登录
    if (!acclist || acclist.length === 0) {
      this.oMsg.sendResponse(new Res(true, {
        flag: 'unlogin'
      }, this.oMsg.callbackId))

      // 跳转登录页, 做store消息预存储，待popup获取跳转登录页
      const noti = new NotificationManager()
      noti.showPopup()
      return
    }
    // 已有账户且已登录,删除type:qosEnable消息
    this.oMsg.sendResponse(new Res(true, {
      flag: 'haslogin'
    }, this.oMsg.callbackId))
  }
}
