
export class Res {
  constructor (isSuccess, data) {
    this.isSuccess = isSuccess
    this.data = data
  }
}

class BaseMsgHandler {
  constructor (params, callback) {
    if (new.target === BaseMsgHandler) {
      throw new Error('MsgHandler class can`t instantiate')
    }
    if (new.target !== BaseMsgHandler) {
      if (!new.target.prototype.hasOwnProperty('handler')) {
        throw new Error('please overwrite handler method')
      }
    }
    this.params = params
    this.callback = this.callbackProcess(callback)
  }

  handler () { }

  callbackProcess (callback) {
    if (typeof callback !== 'function') { return function () { } }
    return function (...args) {
      if (args.length === 0) {
        args = [new Res(true, {})]
      } else if (!(args[0] instanceof Res)) {
        throw new Error('arguments first parameters type is not Res')
      }
      callback.apply(this, args)
    }
  }
}

export default BaseMsgHandler
