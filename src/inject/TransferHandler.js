import MsgHandler from './BaseHandler'
import { InputParams } from './Common'

class TransferHandler extends MsgHandler {
  constructor (params, callback) {
    super(params, callback)
  }

  // 重写抽象类方法
  async handler () {
    console.log('handler TransferHandler')
    console.log(this.params)
    const params = this.params
    window.postMessage(
      new InputParams(
        'qosToPage',
        {
          pageName: 'transfer',
          params: params.params
        }
      ), '*')
    this.callback()
  }
}

export default TransferHandler
