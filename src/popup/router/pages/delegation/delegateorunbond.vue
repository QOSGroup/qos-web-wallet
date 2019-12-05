<template>
  <div class="delegateorunbond-wrap">
    <div class="header-wrap">
      <el-page-header @back="goBack" :content="title"></el-page-header>
    </div>

    <div class="div-contents">
      <div>
        <el-image class="logo-image" :src="validator.logo"></el-image>
      </div>
      <div>
        <div class="text-row">
          <span>{{ validator.moniker }}</span>
          <el-link :href="validator.validatorUrl" target="_blank">
            <i class="el-icon-link"></i>
          </el-link>
        </div>
        <div class="text-row">
          <span>{{ validator.address }}</span>
        </div>
      </div>
    </div>
    <div class="text-row">
      <span>当前委托：{{ delegation.delegate_amount }} QOS</span>
    </div>
    <div class="text-row">
      <span>账户余额：{{ amount }}QOS</span>
    </div>
    <el-form :model="form" ref="form" v-bind:rules="rules">
      <el-form-item :label="operation == 'delegate' ? '追加数量:' : '撤回数量:'" prop="tokens" class="text-row">
        <el-input @input="oninput" placeholder="0" v-model="form.tokens" clearable size="small" class="btn-tokens"></el-input>
        <el-button size="mini" @click="setMax">最大值</el-button>
      </el-form-item>
      <el-form-item v-if="false" label="最大手续费:" prop="gas" class="text-row">
        <span>{{ form.gas }}</span>
        <el-slider v-model="form.gas"></el-slider>
      </el-form-item>
      <el-form-item class="btn-confirm">
        <el-button type="primary" size="small" plain @click="confirm" :loading="onloading" :disabled="isDisabled">确定</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="300px"
      :before-close="handleClose"
      custom-class="qos-dialog"
    >
      <span>{{ this.error }}</span>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false, onloading = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { rpc } from '@/utils/rpc'
import { numForNoDecimal } from '@/utils/index'
export default {
  data () {
    const index = store.getters.accounts.findIndex(
      x => x.address === store.getters.currentAccount.address
    )
    var validateTokens = (rule, value, callback) => {
      if (parseFloat(value) === 0) {
        this.isDisabled = true
        callback(new Error('委托数量不可为0'))
        return false
      } else if (this.operation === 'delegate') {
        if (parseFloat(value) > parseFloat(this.amount)) {
          this.isDisabled = true
          callback(new Error('追加数量不可大于账户余额'))
          return false
        }
      } else if (this.operation === 'unbond') {
        if (parseFloat(value) > parseFloat(this.delegation.delegate_amount)) {
          this.isDisabled = true
          callback(new Error('撤回数量不可大于当前委托'))
          return false
        }
      }
      this.isDisabled = false
      return true
    }
    return {
      rules: {
        tokens: [
          { required: true, message: '请输入转账数量,限制最多4位小数', trigger: 'change' },
          { validator: validateTokens, trigger: 'change' }
        ]
      },
      title:
        this.$route.params.operation === 'delegate' ? '追加委托' : '撤回委托',
      // 用户信息
      amount: this.$route.params.amount,
      // 用户选择的操作：委托deleagte / 解除委托unbond web页面传递
      operation: this.$route.params.operation,
      // 用户所选的validator信息
      validator: {
        logo: this.$route.params.delegation.logo,
        moniker: this.$route.params.delegation.moniker,
        address: this.$route.params.delegation.validator_address,
        validatorUrl: 'https://www.baidu.com'
      },
      // 用户在当前validator的委托信息
      delegation: {
        delegator_address: this.$route.params.delegation.validator_address,
        delegate_amount: this.$route.params.delegation.delegate_amount,
        is_compound: this.$route.params.delegation.is_compound
      },
      form: {
        tokens: '', // 追加或撤回的token数量
        gas: 0, // 支付的gas费用
        compound: '0' // 页面选择是否复投
      },
      isDisabled: true,
      onloading: false,
      // 弹出提示框数据
      dialogVisible: false,
      error: '',
      currentAccount: store.getters.accounts[index]
    }
  },
  methods: {
    oninput (e) {
      // 通过正则过滤小数点后两位
      e = (e.match(/^\d*(\.?\d{0,4})/g)[0]) || null
      this.form.tokens = e
    },
    goBack () {
      window.history.length > 1
        ? this.$router.push({
          name: 'homepage',
          params: { activeName: 'delegation' }
        })
        : this.$router.push({ name: 'homepage' })
    },
    setMax () {
      if (this.operation === 'delegate') {
        this.$data.form.tokens = this.$data.amount
      } else if (this.operation === 'unbond') {
        this.$data.form.tokens = this.$data.delegation.delegate_amount
      } else {
        this.$data.form.tokens = 0
      }
    },
    confirm () {
      let details =
        '<span style="word-break: break-all;"><span style="color:blue;">你的地址</span>:<br />' +
        this.currentAccount.address
      details +=
        '<br /><span style="color:green;">验证人地址:</span><br />' +
        this.validator.address
      details +=
        '<br /><span style="color:red;">操作金额</span>:<br />' +
        parseFloat(this.form.tokens).toString() +
        'QOS</span>'
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
      // 创建基础数据结构
      const myBase = {
        from: this.currentAccount.address
        // chain_id: "qos-test",
        // max_gas: this.form.gas.toString()
      }
      // 组装data数据,调用rpc接口,提交交易
      let data, res
      if (this.operation === 'delegate') {
        data = {
          amount: numForNoDecimal(this.form.tokens).toString(),
          base: myBase
        }
        if (this.delegation.delegate_amount.toString() === '0') {
          data.is_compound = this.form.compound === '1'
        }
        res = account.sendCreateDelegateTx(this.validator.address, data)
      } else {
        data = {
          unbond_amount: numForNoDecimal(this.form.tokens).toString(),
          base: myBase
        }
        res = account.sendUnbondDelegationTx(this.validator.address, data)
      }
      // 得到返回值处理
      res
        .then(result => {
          if (result.status === 200) {
            this.$router.push({
              name: 'txresult',
              params: { hash: result.data.hash }
            })
          } else {
            this.error = '交易失败,请检查交易信息并重试!'
            this.dialogVisible = true
          }
        })
        .catch(error => {
          console.log(error)
          this.error = '交易失败,请检查交易信息并重试!'
          this.dialogVisible = true
        })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  },
  computed: {
    // operation: ''
  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.delegateorunbond-wrap {
  @include common-container;
  .div-contents {
    display: flex;
    margin: 10px;
  }
  .logo-image {
    width: 100px;
    height: 100px;
  }
  .btn-confirm{
    text-align: center;
    margin: 20px;
  }
  .text-row{
    margin: 15px 10px
  }
  .btn-tokens{
    width: 260px;
  }
}
span {
  word-break: break-all;
  word-wrap: break-word;
  font-size: 14px;
}
</style>
<style lang="scss">
.qos-dialog {
  .el-dialog__body {
    padding: 0 30px !important;
  }
}
