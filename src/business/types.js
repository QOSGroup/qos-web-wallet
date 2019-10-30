export class ToPage {
  constructor (params) {
    this.pageName = params.pageName
    this.params = params.params
  }
}

export class Asset {
  constructor (name, amount) {
    this.name = name
    this.amount = amount
  }
}

export class Account {
  constructor (name, address) {
    this.name = name
    this.adress = address
    this.qos = new Asset('QOS', 0)
    this.qscs = {}
  }

  getQOS () {
    return this.qos.amount
  }

  getAsset (name) {
    if (name === 'QOS') {
      return this.qos.amount
    } else if (this.qscs.hasOwnProperty(name)) {
      return this.qscs[name].amount
    }
    return null
  }
}
