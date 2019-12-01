import BaseMsgHandler from './BaseMsgHandler'
import store from '@/store'
import * as types from '@/store/mutation-types.js'
import { ToPage } from './types'

export class ShowPopupHandler extends BaseMsgHandler {
  constructor (oMsg) {
    super(oMsg)
  }

  handler () {
    console.log('ShowPopupHandler handler')
    store.commit(types.INPUT_TOPAGE_PARAMS, new ToPage(this.oMsg.params))
    store.commit(types.ADD_ACTIONNUM)
    this.noti.showPopup()
  }
}
