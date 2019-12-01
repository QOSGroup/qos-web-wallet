/**
 * 工具类
 * {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }
 */
import CryptoJS from 'crypto-js'
// 加密
export function encrypt (word, keyStr) {
  // keyStr = keyStr || '12345678'
  // var key = CryptoJS.enc.Utf8.parse(keyStr) // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  // var srcs = CryptoJS.enc.Utf8.parse(word)
  try {
    var encrypted = CryptoJS.AES.encrypt(word, keyStr)
    return encrypted.toString()
  } catch (error) {
    console.log('encrypt error: ', error)
    return null
  }
}

// 解密
export function decrypt (word, keyStr) {
  // keyStr = keyStr || '12345678'
  // var key = CryptoJS.enc.Utf8.parse(keyStr) // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  try {
    var decrypt = CryptoJS.AES.decrypt(word, keyStr)
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  } catch (error) {
    console.log('decrypt error: ', error)
    return null
  }
}
