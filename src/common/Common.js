// 输出类型
export class Res {
  constructor (isSuccess, data, callbackId) {
    this.isSuccess = isSuccess
    this.data = data
    this.callbackId = callbackId
  }
}

// 输入类型
export class InputParams {
  constructor (type, params, callbackId) {
    this.flag = 'qos_msg'
    this.type = type
    this.params = params
    this.callbackId = callbackId
  }
}
