export function getJSON (str) {
  const ret = { flag: false, value: null }
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        ret.flag = true
        ret.value = obj
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e)
    }
    return ret
  }

  return ret
}
