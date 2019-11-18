import BaseMsgHandler from './BaseMsgHandler'
import { getAccountList } from './auth'
import { Res } from '../common/Common'
import store from '../store'
import NotificationManager from '../utils/NotificationManager'

export class EnableHandler extends BaseMsgHandler {
  constructor (oMsg) {
    super(oMsg)
  }

  async handler () {
    // 先判断是否有账户
    let acclist = await getAccountList()
    // 本地无账户信息
    if (!acclist || acclist.length === 0) {
      this.oMsg.sendResponse(new Res(true, { flag: 'unregister' }, this.oMsg.callbackId))
      // 跳转注册页, 做store消息预存储，待popup获取跳转注册页
      return
    }
    // 判断store中是否已有登录账户
    acclist = store.getters.accounts
    // 未登录
    if (!acclist || acclist.length === 0) {
      // 跳转登录页, 做store消息预存储，待popup获取跳转登录页

      const noti = new NotificationManager()
      noti.showPopup()
    }
  }
}
