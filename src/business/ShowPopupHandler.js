import NotificationManager from '../utils/NotificationManager'
import BaseMsgHandler, { Res } from './BaseMsgHandler'

export class ShowPopupHandler extends BaseMsgHandler {
  constructor (params, callback) {
    super(params, callback)
  }

  handler () {
    console.log('handler showPopup')
    const noti = new NotificationManager()
    noti.showPopup()
    this.callback(new Res(true, {}))
  }
}
