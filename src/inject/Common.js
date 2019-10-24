// 输出类型
export class Res {
  constructor (isSuccess, msg) {
    this.isSuccess = isSuccess
    this.msg = msg
  }
}

// 输入类型
export class InputParams {
  constructor (type, data) {
    this.type = type
    this.data = data
  }
}
