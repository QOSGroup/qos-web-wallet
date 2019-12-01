import BaseMsgHandler from './BaseMsgHandler'
import store from '@/store'
import * as types from '@/store/mutation-types.js'
import { ToPage } from './types'

export class ShowPopupHandler extends BaseMsgHandler {
  constructor (oMsg, noti) {
    super(oMsg, noti)
  }

  handler () {
    store.commit(types.INPUT_TOPAGE_PARAMS, new ToPage(this.oMsg.params))
    store.commit(types.ADD_ACTIONNUM)
    setTimeout(() => {
      // const noti = new NotificationManager()
      this.noti.showPopup()
    }, 0)
  }
}
