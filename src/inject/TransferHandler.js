import MsgHandler from './BaseHandler'

class TransferHandler extends MsgHandler {
  constructor (params, callback) {
    super(params, callback)
  }

  // 重写抽象类方法
  handler () {
    console.log('handler TransferHandler')
    console.log(this.params)
    this.callback()
  }
}

export default TransferHandler
