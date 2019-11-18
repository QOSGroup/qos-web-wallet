import NotificationManager from '../utils/NotificationManager'
import BaseMsgHandler from './BaseMsgHandler'
import store from '@/store'
import * as types from '@/store/mutation-types.js'
import { ToPage } from './types'

export class ShowPopupHandler extends BaseMsgHandler {
  constructor (oMsg) {
    super(oMsg)
  }

  handler () {
    store.commit(types.INPUT_TOPAGE_PARAMS, new ToPage(this.oMsg.params))
    store.commit(types.ADD_ACTIONNUM)
    console.log(this.oMsg)
    console.log('handler showPopup')
    setTimeout(() => {
      const noti = new NotificationManager()
      noti.showPopup()
    }, 0)
  }
}
