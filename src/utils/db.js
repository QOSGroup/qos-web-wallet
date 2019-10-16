import { getJSON } from '.'

const db = {
  get (key) {
    const value = localStorage.getItem(key)
    const { flag, obj } = getJSON(value)
    if (flag) {
      return obj
    }
    return value
  },
  set (key, value) {
    if (value instanceof Object) {
      value = JSON.stringify(value)
    }
    return localStorage.setItem(key, value)
  }
}

export default db
