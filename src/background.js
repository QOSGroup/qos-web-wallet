import store from './store'
import * as types from './store/mutation-types'
import { ShowPopupHandler } from './business/ShowPopupHandler'
import { ToPage } from './business/types'
global.browser = require('webextension-polyfill')
const extension = require('extensionizer')

// alert(`Hello ${store.getters.foo}!`)

extension.runtime.onMessage.addListener(function (
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
  if (request.type === 'qosToPage') {
    // console.log("extension.browserAction.setBadgeText({ text: '1' })")
    // extension.browserAction.setBadgeText({ text: '1' })

    msgHandler = new ShowPopupHandler(request.params, sendResponse)
    // sendResponse({ farewell: 'goodbye' })
    msgHandler.handler()
  }
})

// eslint-disable-next-line no-unused-vars
window.getBgState = function () {
  setTimeout(() => {
    store.commit(types.INPUT_TOPAGE_PARAMS, new ToPage({ pageName: '', params: {} }))
  }, 0)
  return Object.assign({}, store.state)
}

chrome.runtime.onInstalled.addListener(function () {

})

// chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
//   // 可以针对sender做一些白名单检查
//   // sendResponse返回响应
//   if (request.type === 'MsgFromPage') {
//     sendResponse({ tyep: 'MsgFromChrome', msg: 'Hello, I am chrome extension~' })
//   }
// })
