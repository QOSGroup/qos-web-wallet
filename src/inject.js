import TransferHandler from './inject/TransferHandler'
import { InputParams } from './inject/Common'
import { ArrayCallBack } from './inject/BaseHandler'

class QOSWallet {
  constructor () {
    window.addEventListener('message', function (event) {
      if (event.source !== window) {
        return
      }
      if (event && event.data.type === 'qosProcessCallback') {
        console.log(ArrayCallBack, event.data.callbackIndex)
        const cb = ArrayCallBack[event.data.callbackIndex]
        cb && cb(event.data.res)
      }
    }, false)
  }

  process (msg) {
    console.log(msg)
    // window.postMessage({ type: msg.type || 'qosToPage', params: msg.data }, '*')
    let handler
    if (msg.type === 'transfer') {
      handler = new TransferHandler(new InputParams(msg.type, msg.data))
    }
    if (handler) {
      handler.handler(function (res) {
        console.log('handler.handler', res)
      })
    }
  }
}

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
