import NotificationManager from '../utils/NotificationManager'
import BaseMsgHandler from './BaseMsgHandler'
import store from '@/store'
import * as types from '@/store/mutation-types.js'
import { ToPage } from './types'

export class ShowPopupHandler extends BaseMsgHandler {
  constructor (params, callback) {
    super(params, callback)
  }

  handler () {
    store.commit(types.INPUT_TOPAGE_PARAMS, new ToPage(this.params))
    store.commit(types.ADD_ACTIONNUM)
    console.log(this.params)
    console.log('handler showPopup')
    setTimeout(() => {
      const noti = new NotificationManager()
      noti.showPopup()
      // this.callback(new Res(true, {}))
    }, 0)
  }
}
