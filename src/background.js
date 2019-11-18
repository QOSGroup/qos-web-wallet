import store from './store'
import * as types from './store/mutation-types'
import { ShowPopupHandler } from './business/ShowPopupHandler'
import { registerGloablFunction } from './background/index'
import { EnableHandler } from './business/EnableHandler'
global.browser = require('webextension-polyfill')
const extension = require('extensionizer')

// alert(`Hello ${store.getters.foo}!`)

extension.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension')

  // typeof request === InputParams
  if (request.flag === 'qos_msg') {
    request.sendResponse = sendResponse
    store.commit(types.ADD_MSG_QUEUE, request)
  }
  let msgHandler
  if (request.type === 'qosToPage') {
    msgHandler = new ShowPopupHandler(request)
  } else if (request.type === 'qosEnable') {
    msgHandler = new EnableHandler(request)
  }
  if (!msgHandler) { sendResponse('qos wallet connected'); return false }
  await msgHandler.handler()
  return true
})

chrome.runtime.onInstalled.addListener(function () {
  registerGloablFunction(window)
})

// chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
//   // 可以针对sender做一些白名单检查
//   // sendResponse返回响应
//   if (request.type === 'MsgFromPage') {
//     sendResponse({ tyep: 'MsgFromChrome', msg: 'Hello, I am chrome extension~' })
//   }
// })
