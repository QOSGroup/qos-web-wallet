import { Res } from '@/common/Common'

const extensioner = require('extensionizer')

// 获取background window 对象
export function getBackground () {
  return extensioner.extension.getBackgroundPage()
}

// 通过background处理消息
export function processMsg (res, msgIndex) {
  const bg = getBackground()
  msgIndex = msgIndex || 0
  const msg = res || new Res(true, {
    message: 'ok'
  })

  bg.msgProcessed(msg, msgIndex)
}
