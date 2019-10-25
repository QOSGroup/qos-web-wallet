import MsgHandler, { ArrayCallBack } from './BaseHandler'
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
    const length = ArrayCallBack.push(callback)
    window.postMessage(
      new InputParams(
        'qosToPage',
        {
          pageName: 'transfer',
          params: params.params
        },
        length - 1
      ), '*')
  }
}

export default TransferHandler
