// 输出类型
export class Res {
  constructor (isSuccess, msg) {
    this.isSuccess = isSuccess
    this.msg = msg
  }
}

// 输入类型
export class InputParams {
  constructor (flag, data) {
    this.flag = flag
    this.data = data
  }
}
