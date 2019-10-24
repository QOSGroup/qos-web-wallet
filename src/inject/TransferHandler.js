import MsgHandler from './BaseHandler'

class TransferHandler extends MsgHandler {
  constructor (params, callback) {
    super(params, callback)
  }

  // 重写抽象类方法
  async handler () {
    console.log('handler TransferHandler')
    console.log(this.params)
    const params = this.params
    window.postMessage({
      type: 'qosToPage',
      params: {
        pageName: 'transfer',
        params: params.data
      }
    }, '*')
    this.callback()
  }
}

export default TransferHandler
