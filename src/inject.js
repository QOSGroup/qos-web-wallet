import TransferHandler from './inject/TransferHandler'
import { InputParams } from './inject/Common'

class QOSWallet {
  constructor () {
    this.a = 1
  }

  process (msg) {
    console.log(this.a)
    console.log(msg)
    // window.postMessage({ type: msg.type || 'qosToPage', params: msg.data }, '*')
    let handler
    if (msg.type === 'transfer') {
      handler = new TransferHandler(new InputParams(msg.type, msg.data))
    }
    if (handler) {
      console.log('handler.handler()')
      handler.handler()
    }
  }
}
console.log(222)

window.qosApi = function () {
  return new Promise(function (resolve, reject) {
    try {
      const qoswallet = new QOSWallet()
      resolve(qoswallet)
    } catch (error) {
      reject(error)
    }
  })
}

// window.qosApi = 2
