// import store from './store'
import NotificationManager from './utils/NotificationManager'
global.browser = require('webextension-polyfill')

// alert(`Hello ${store.getters.foo}!`)
chrome.runtime.onInstalled.addListener(function () {
  // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //   // alert(tabs[0].id)
  //   chrome.pageAction.show(tabs[0].id)
  // })
  // window.open('/popup/popup.html')
  // chrome.pageAction.setPopup({
  //   tabId: 'abx',
  //   popup: 'popup/popup.html'
  // })
  // chrome.browserAction.show('abx')
})

// chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
//   // 可以针对sender做一些白名单检查
//   // sendResponse返回响应
//   if (request.type === 'MsgFromPage') {
//     sendResponse({ tyep: 'MsgFromChrome', msg: 'Hello, I am chrome extension~' })
//   }
// })

chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  )
  if (request.greeting === 'hello') {
    const noti = new NotificationManager()
    noti.showPopup()
    sendResponse({ farewell: 'goodbye' })
  }
})
