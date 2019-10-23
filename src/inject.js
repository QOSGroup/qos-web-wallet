class QOSWallet {
  constructor () {

  }

  test () {
    console.log(2)
  }
}
console.log(111)

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
