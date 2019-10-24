class QOSWallet {
  constructor () {

  }

  process (msg) {
    console.log(msg)
    window.postMessage({ type: msg.type || 'qosToPage', params: msg.data }, '*')
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
