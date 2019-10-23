// import store from './store'
import { ShowPopupHandler } from './business/ShowPopupHandler'
global.browser = require('webextension-polyfill')

// alert(`Hello ${store.getters.foo}!`)

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
  let msgHandler
  if (request.greeting === 'hello') {
    // const noti = new NotificationManager()
    // noti.showPopup()
    // sendResponse({ farewell: 'goodbye' })
    msgHandler = new ShowPopupHandler()
  }
  msgHandler.handler()
})

chrome.runtime.onInstalled.addListener(function () {

})

// chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
//   // 可以针对sender做一些白名单检查
//   // sendResponse返回响应
//   if (request.type === 'MsgFromPage') {
//     sendResponse({ tyep: 'MsgFromChrome', msg: 'Hello, I am chrome extension~' })
//   }
// })
