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
  keyStr = keyStr || '12345678'
  // var key = CryptoJS.enc.Utf8.parse(keyStr) // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  // var srcs = CryptoJS.enc.Utf8.parse(word)
  var encrypted = CryptoJS.AES.encrypt(word, keyStr)
  return encrypted.toString()
}

// 解密
export function decrypt (word, keyStr) {
  keyStr = keyStr || '12345678'
  // var key = CryptoJS.enc.Utf8.parse(keyStr) // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var decrypt = CryptoJS.AES.decrypt(word, keyStr)
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
