// chrome.runtime.onConnect.addListener(function (port) {
//   console.assert(port.name === 'qos-web-wallet')
//   port.onMessage.addListener(function (msg) {
//     if (msg.joke === '敲门') {
//       port.postMessage({ question: '是谁？' })
//     } else if (msg.answer === '女士') {
//       port.postMessage({ question: '哪位女士？' })
//     } else if (msg.answer === 'Bovary 女士') {
//       port.postMessage({ question: '我没听清楚。' })
//     }
//   })
// })
window.addEventListener('message', function (event) {
  if (event.source !== window) {
    return
  }
  if (event && event.data.type === 'MsgFromPage') {
    console.log('--------event.data------')
    console.log(event.data)
    // var targetExtensionId = 'ondkcjelonjcbodjobfhchkgndkekobn' // 插件的ID
    // chrome.runtime.sendMessage(targetExtensionId, { type: 'MsgFromPage', msg: 'Hello, I am page~' }, function (response) {
    //   console.log(response)
    // })
    // chrome.browserAction.enable()
    chrome.runtime.sendMessage({ greeting: 'hello' }, function (response) {
      console.log(response.farewell)
    })
  }
}, false)
