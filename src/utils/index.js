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
      // console.log('error：' + str + '!!!' + e)
    }
    return ret
  }

  return ret
}

/**
 * 是否合法数据
 * @param value any
 */
export function isNotEmpty (value) {
  if (value !== undefined && value !== '' && value != null) {
    return true
  }
  return false
}

/**
 * 是否非空对象
 * @param obj 对象
 */
export function isNotEmptyObject (obj) {
  if (obj !== undefined && obj !== '' && obj != null && Object.keys(obj).length > 0) {
    return true
  }
  return false
}

/**
 * 生成随机字符串
 */
export function createRandomId () {
  return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5)
}
