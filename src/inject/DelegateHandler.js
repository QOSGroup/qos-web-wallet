import MsgHandler from './BaseHandler'
import { InputParams } from '../common/Common'

class DelegateHandler extends MsgHandler {
  constructor (oMsg, callback) {
    super(oMsg, callback)
  }

  // 重写抽象类方法
  handler (callback) {
    console.log('handler DelegateHandler')
    console.log(this)
    const id = this.addCallBack(callback)
    window.postMessage(new InputParams('qosToPage', { pageName: 'delegate', params: this.oMsg }, id), '*')
  }
}

export default DelegateHandler
