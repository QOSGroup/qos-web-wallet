import MsgHandler from './BaseHandler'
import { InputParams } from './Common'

class TransferHandler extends MsgHandler {
  constructor (params, callback) {
    super(params, callback)
  }

  // 重写抽象类方法
  async handler (callback) {
    console.log('handler TransferHandler')
    console.log(this.params)
    const params = this.params
    const id = this.addCallBack(callback)
    window.postMessage(
      new InputParams(
        'qosToPage',
        {
          pageName: 'transfer',
          params: params.params
        },
        id
      ), '*')
  }
}

export default TransferHandler
