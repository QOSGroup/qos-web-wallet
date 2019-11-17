import MsgHandler from './BaseHandler'
import { InputParams } from './Common'

class EnableHandler extends MsgHandler {
  constructor (callback) {
    super(callback)
  }

  // 重写抽象类方法
  async handler (callback) {
    const id = this.addCallBack(callback)
    window.postMessage(new InputParams('qosEnable', {}, id), '*')
  }
}

export default EnableHandler
