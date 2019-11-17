import TransferHandler from './inject/TransferHandler'
import { CallBackMap } from './inject/BaseHandler'
import EnableHandler from './inject/EnableHandler'

class QOSWallet {
  constructor () {
    window.addEventListener('message', function (event) {
      if (event.source !== window) {
        return
      }
      // console.log('event.data', event.data)
      if (event && event.data.type === 'qosProcessCallback' && event.data.flag === 'qos_res') {
        console.log(CallBackMap, '这里==========qosProcessCallback')
        const cb = CallBackMap.get(event.data.callbackId)
        cb && cb(event.data)
        CallBackMap.delete(event.data.callbackId)
      }
    }, false)
  }

  enable () {
    const promise = new Promise((resolve) => {
      const hanler = new EnableHandler()
      hanler.handler(function (res) {
        // console.log('enable.handler', res)
        resolve(res)
      })
    })
    return promise
  }

  process (msg) {
    console.log('process', msg)
    const promise = new Promise((resolve) => {
      let handler
      if (msg.type === 'transfer') {
        handler = new TransferHandler(msg.data)
      }
      if (handler) {
        handler.handler(function (res) {
          // console.log('process.handler', res)
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
