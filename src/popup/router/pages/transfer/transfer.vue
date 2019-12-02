<template>
  <div class="transfer-wrap">
    <!-- <div>这是转账页面: {{inputParams}}</div>
    <div>
      <button @click="onProcess">processMsg</button>
    </div>-->
    <div class="header-wrap">
      <el-page-header @back="goBack" content="转账"></el-page-header>
    </div>

    <div class="row">
      <span>资产类型：{{ coin }}</span>
    </div>
    <div class="row">
      <span>资产余额：{{ balance }}</span>
    </div>
    <el-form :model="form" ref="form" v-bind:rules="rules">
      <el-form-item label="接收方地址:" prop="address" class="form-row">
        <el-input placeholder="请输入地址" v-model="form.address" clearable size="small" class="form-input"></el-input>
      </el-form-item>

      <el-form-item label="转账数量:" prop="tokens" class="form-row">
        <el-input placeholder="请输金额" v-model="form.tokens" clearable size="mini" class="form-number-input"></el-input>
        <el-button size="mini" @click="setMax">最大值</el-button>
      </el-form-item>

      <el-form-item v-if="false" label="最大手续费" prop="gas">
        <span>{{ form.gas }}</span>
        <el-slider v-model="form.gas"></el-slider>
      </el-form-item>
    </el-form>

    <div class="btn-confirm">
      <el-button type="primary" size="small" plain @click="confirm" :loading="onloading">确定</el-button>
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
import { numFor4Decimal, numForNoDecimal } from '@/utils/index'
export default {
  data () {
    const index = store.getters.accounts.findIndex(
      x => x.address === store.getters.currentAccount.address
    )
    var validateAddr = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入接收地址'))
      } else {
        const res = rpc.verifyBech32StringByAccAddress(this.form.address)
        console.log('res==addr verify==', res)
        callback(new Error('地址格式有误,请检查!'))
      }
    }
    return {
      rules: {
        address: [
          { validator: validateAddr, trigger: 'blur' },
          { required: true, message: '请输入接收地址', trigger: 'blur' }
        ],
        tokens: [{ required: true, message: '请输入转账数量', trigger: 'blur' }]
      },
      // 根据用户地址链上查询的数据
      // coins: [],
      // coin: this.$route.params.coin,
      coin: 'QOS',
      balance: 0,
      form: {
        address: '',
        tokens: '',
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
  mounted () {
    this.getAccount(this.currentAccount)
  },
  created () {},
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.push({
          name: 'homepage',
          params: { activeName: 'balance' }
        })
        : this.$router.push({ name: 'homepage' })
    },
    confirm () {
      let details =
        '<span style="word-break: break-all;"><span style="color:blue;">转出地址</span>:<br />' +
        this.currentAccount.address
      details +=
        '<br /><span style="color:green;">转入地址</span>:<br />' +
        this.form.address
      details +=
        '<br /><span style="color:red;">转账金额</span>:<br />' +
        this.form.tokens.toString() +
        this.coin +
        '</span>'
      this.$confirm(details, '交易确认', {
        customClass: 'message-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // type: 'warning',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.commitTx()
        })
        .catch(() => {})
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
        qos: numForNoDecimal(this.form.tokens).toString(),
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
            this.onloading = false
            this.error = '交易失败,请检查交易信息并重试!'
            this.dialogVisible = true
          }
        })
        .catch(error => {
          console.log(error)
          this.onloading = false
          this.error = '网络错误,请稍后重试!'
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
      const account = rpc.recoveryAccountByPrivateKey(
        currentAccount.privateKey
      )
      const res = account.queryAccount(currentAccount.address)
      res.then(result => {
        if (result.status === 200) {
          if (this.$data.coin === 'QOS') {
            this.balance = numFor4Decimal(result.data.value.qos)
          } else {
            const qcps = result.data.value.qcps
            if (qcps) {
              for (let qcp of qcps) {
                if (qcp.coin_name === this.coin) {
                  this.balance = numFor4Decimal(qcp.amount)
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
  span {
    word-break: break-all;
    word-wrap: break-word;
    font-size: 16px;
  }
  .row{
    margin: 20px 20px
  }
  .btn-confirm{
    text-align: center;
    margin-top: 20px;
  }
  .form-row{
    margin: 10px 20px;
  }
  .form-input{
    width:265px
  }
  .form-number-input{
    width:195px
  }
}
</style>
<style lang="scss">
.qos-dialog {
  .el-dialog__body {
    padding: 0 30px !important;
  }
}
