import MsgHandler from './BaseHandler'
import { InputParams } from './Common'

class TransferHandler extends MsgHandler {
  constructor (oMsg, callback) {
    super(oMsg, callback)
  }

  // 重写抽象类方法
  async handler (callback) {
    console.log('handler TransferHandler')
    console.log(this.params)
    const id = this.addCallBack(callback)
    window.postMessage(new InputParams('qosToPage', { pageName: 'transfer', params: this.oMsg }, id), '*')
  }
}

export default TransferHandler
