import { Res, InputParams } from './Common'

// 存储回调函数数组
export const ArrayCallBack = []

// 抽象类
class MsgHandler {
  constructor (params, callback) {
    if (new.target === MsgHandler) {
      // 抽象类不可以直接实例化
      throw new Error('MsgHandler class can`t instantiate')
    }
    if (new.target !== MsgHandler) {
      if (!new.target.prototype.hasOwnProperty('handler')) {
        // 判断子实例是否重新handler方法
        throw new Error('please overwrite handler method')
      }
    }
    if (!(params instanceof InputParams)) {
      // 限制构造函数第一个参数输入类型为InputParams
      throw new Error('The type of the first parameter of the constructor is not InputParams')
    }
    this.params = params
    this.callback = this.callbackProcess(callback)
  }

  handler () { }

  // 回调函数前置切面（AOP编程思想）
  callbackProcess (callback) {
    if (typeof callback !== 'function') { return function () { } }
    return function (...args) {
      if (args.length === 0) {
        args = [new Res(true, {})]
      } else if (!(args[0] instanceof Res)) {
        // 限制回调输出参数类型为Res类
        throw new Error('arguments first parameters type is not Res')
      }
      return callback.apply(this, args)
    }
  }
}

export default MsgHandler
