// 输出类型
export class Res {
  constructor (isSuccess, msg) {
    this.isSuccess = isSuccess
    this.msg = msg
  }
}

// 输入类型
export class InputParams {
  constructor (type, params, callbackIndex) {
    this.flag = 'qos_msg'
    this.type = type
    this.params = params
    this.callbackIndex = callbackIndex
  }
}
