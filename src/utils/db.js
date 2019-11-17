import { getJSON } from '.'
const extension = require('extensionizer')

const db = {
  get (key) {
    const value = localStorage.getItem(key)
    const ret = getJSON(value)
    if (ret.flag) {
      return ret.value
    }
    return value
  },
  set (key, value) {
    if (value instanceof Object) {
      value = JSON.stringify(value)
    }
    return localStorage.setItem(key, value)
  },
  /**
   * 插件存储
   * @param {*} [key] key
   * @param {*} value value
   */
  setLocal (key, value) {
    return new Promise((resolve) => {
      if (value instanceof Object) {
        value = JSON.stringify(value)
      }
      extension.storage.local.set({ key, value }, function () {
        resolve()
      })
    })
  },
  getLocal (key) {
    return new Promise((resolve) => {
      extension.storage.local.get([key], function (result) {
        const ret = getJSON(result.key)
        if (ret.flag) {
          return resolve(ret.value)
        }
        resolve(result.key)
      })
    })
  }
}

export default db
