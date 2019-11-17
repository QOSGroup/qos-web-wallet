import TransferHandler from './inject/TransferHandler'
import { InputParams } from './inject/Common'
import { CallBackMap } from './inject/BaseHandler'
import EnableHandler from './inject/EnableHandler'

class QOSWallet {
  constructor () {
    window.addEventListener('message', function (event) {
      if (event.source !== window) {
        return
      }
      if (event && event.data.type === 'qosProcessCallback') {
        console.log(CallBackMap, event.data.callbackId)
        const cb = CallBackMap.get(event.data.callbackId)
        cb && cb(event.data.res)
        CallBackMap.delete(event.data.callbackId)
      }
    }, false)
  }

  enable () {
    return new Promise(resolve => {
      const hanler = new EnableHandler()
      hanler.handler(function (res) {
        console.log('enable.handler', res)
        resolve(res)
      })
    })
  }

  process (msg) {
    console.log(msg)
    // window.postMessage({ type: msg.type || 'qosToPage', params: msg.data }, '*')
    const promise = new Promise((resolve, reject) => {
      let handler
      if (msg.type === 'transfer') {
        handler = new TransferHandler(msg.data)
      }
      if (handler) {
        handler.handler(function (res) {
          console.log('process.handler', res)
          resolve(res)
        })
      }
    })
    return promise
  }
}

window.QOSWallet = QOSWallet
// function () {
//   return new Promise(function (resolve, reject) {
//     try {
//       const qoswallet = new QOSWallet()
//       resolve(qoswallet)
//     } catch (error) {
//       reject(error)
//     }
//   })
// }

// window.qosApi = 2
