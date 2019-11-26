<template>
  <div class="transfer-wrap">
    <div>这是转账页面: {{inputParams}}</div>
    <div>
      <button @click="onProcess">processMsg</button>
    </div>

    <el-page-header @back="goBack" content="转账"></el-page-header>
    <el-divider></el-divider>
    <div>
      <span>资产类型：{{ coin }}</span>
    </div>
    <div>
      <span>资产余额：{{ balance }}</span>
    </div>
    <div></div>
    <div>
      <span>接收方地址：</span>
    </div>
    <div>
      <el-input type="input" v-model="form.address" clearable size="small"></el-input>
    </div>
    <div>
      <span>转账数量：</span>
    </div>
    <div>
      <el-input type="input" v-model="form.tokens" clearable size="mini" style="width:75%;"></el-input>
      <el-button size="mini" style="float:right;height:38px;" @click="setMax">最大值</el-button>
    </div>

    <div style="display:none;">
      <span>最大手续费：{{ form.gas }}</span>
    </div>
    <div class="block" style="display:none;">
      <el-slider v-model="form.gas"></el-slider>
    </div>

    <div style="text-align:center;">
      <el-button type="primary" size="small" plain @click="commitTx" :loading="onloading">确定</el-button>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      custom-class="qos-dialog"
    >
      <span>{{ this.error }}</span>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import QOSRpc from 'js-for-qos-httprpc'
import { processMsg } from '../../../common/bgcontact'
import store from '@/store'
import { rpc } from '@/utils/rpc'
export default {
  data () {
    const index = store.getters.accounts.findIndex(
      x => x.address === store.getters.currentAccount.address
    )
    return {
      // 根据用户地址链上查询的数据
      // coins: [],
      coin: this.$route.params.coin,
      balance: 0,
      form: {
        address: '',
        tokens: 0,
        gas: 0
      },
      // 确定按钮
      onloading: false,
      // 弹出提示框数据
      dialogVisible: false,
      error: '',
      currentAccount: store.getters.accounts[index]
    }
  },
  computed: {
    inputParams () {
      return JSON.stringify(this.$store.getters.firstMsg)
    }
  },
  mounted: {
  },
  created () {
    this.getAccount(this.currentAccount)
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.push({
          name: 'homepage',
          params: { activeName: 'balance' }
        })
        : this.$router.push({ name: 'homepage' })
    },
    commitTx () {
      this.onloading = true
      // 点击完成确认按钮后,首先调用转账接口,得到后台返回的json字符串
      const account = rpc.recoveryAccountByPrivateKey(
        this.currentAccount.privateKey
      )
      // 创建数据结构
      const myBase = {
        from: this.currentAccount.address
        // chain_id: "qos-test",
        // max_gas: this.form.gas.toString()
      }
      const data = {
        qos: this.form.tokens.toString(),
        base: myBase
      }
      const res = account.sendTransferTx(this.form.address, data)
      res
        .then(result => {
          if (result.status === 200) {
            this.$router.push({
              name: 'txresult',
              params: { hash: result.data.hash }
            })
          } else {
            this.error = result.statusText
            this.dialogVisible = true
          }
        })
        .catch(error => {
          this.error = error
          this.dialogVisible = true
        })
    },
    setMax () {
      this.$data.form.tokens = this.$data.balance
    },
    onProcess () {
      processMsg()
    },
    getAccount (currentAccount) {
      alert(this.coin)
      const account = rpc.recoveryAccountByPrivateKey(
        currentAccount.privateKey
      )
      const res = account.queryAccount(currentAccount.address)
      res.then(result => {
        if (result.status === 200) {
          if (this.$data.coin === 'QOS') {
            this.balance = result.data.value.qos
          } else {
            const qcps = result.data.value.qcps
            if (qcps) {
              for (let qcp of qcps) {
                if (qcp.coin_name === this.coin) {
                  this.balance = qcp.amount
                  break
                }
              }
            }
          }
        }
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.transfer-wrap {
  @include common-container;
  div {
    text-align: left;
    overflow: hidden;
    overflow-y: auto;
    margin: 2% 0 2% 0;
    vertical-align: middle;
  }
  span {
    word-break: break-all;
    word-wrap: break-word;
    font-size: 14px;
  }
}
</style>
<style lang="scss">
.qos-dialog {
  .el-dialog__body {
    padding: 0 30px !important;
  }
}
