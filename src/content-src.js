const extension = require('extensionizer')

const inpageContent = '<neeinject></neeinject>'
const inpageSuffix = '//# sourceURL=' + extension.runtime.getURL('inpage.js') + '\n'
const inpageBundle = inpageContent + inpageSuffix

function injectScript () {
  try {
    const container = document.head || document.documentElement
    const scriptTag = document.createElement('script')
    scriptTag.setAttribute('async', false)
    scriptTag.textContent = inpageBundle
    container.insertBefore(scriptTag, container.children[0])
    container.removeChild(scriptTag)
  } catch (e) {
    console.error('QOSWallet script injection failed', e)
  }
}

injectScript()

window.addEventListener('message', function (event) {
  if (event.source !== window) {
    return
  }
  if (event && event.data.type === 'toPage') {
    console.log('--------event.data------')
    console.log(event.data)

    chrome.runtime.sendMessage({ type: 'toPage', params: event.data.params }, function (response) {
      console.log(response.farewell)
    })
  }
}, false)

// var targetExtensionId = 'ondkcjelonjcbodjobfhchkgndkekobn' // 插件的ID
// chrome.runtime.sendMessage(targetExtensionId, { type: 'MsgFromPage', msg: 'Hello, I am page~' }, function (response) {
//   console.log(response)
// })
// chrome.browserAction.enable()

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
