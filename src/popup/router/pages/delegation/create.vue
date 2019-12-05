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
      <span>账户余额：{{ amount }}QOS</span>
    </div>
    <div class="text-row">
      <span>当前委托：{{ delegation.delegate_amount }} QOS</span>
    </div>
    <el-form :model="form" ref="form" v-bind:rules="rules">
      <el-form-item label="委托数量:" prop="tokens" class="text-row">
        <el-input @input="oninput" placeholder="0" v-model="form.tokens" clearable size="small" class="btn-tokens"></el-input>
        <el-button size="mini" @click="setMax">最大值</el-button>
      </el-form-item>
      <el-form-item label="委托方式:" prop="compound" class="text-row">
        <el-radio-group v-model="form.compound" size="mini">
          <el-radio label="0" border>不复投</el-radio>
          <el-radio label="1" border>复投</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="false" label="最大手续费:" prop="gas" class="text-row">
        <span>{{ form.gas }}</span>
        <el-slider v-model="form.gas"></el-slider>
      </el-form-item>
      <el-form-item class="btn-confirm">
        <el-button type="primary" size="small" plain @click="confirm" :loading="onloading" :disabled="isDisabled">确定</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="300px" custom-class="qos-dialog">
      <span>{{ this.error }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false, onloading = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { rpc } from '@/utils/rpc'
import { numFor4Decimal, numForNoDecimal } from '@/utils/index'
export default {
  data () {
    const index = store.getters.accounts.findIndex(
      x => x.address === store.getters.currentAccount.address
    )
    var validateTokens = (rule, value, callback) => {
      if (parseFloat(value) === 0) {
        callback(new Error('委托数量不可为0'))
        this.isDisabled = true
        return false
      } else if (parseFloat(value) > parseFloat(this.amount)) {
        callback(new Error('委托数量不可大于账户余额'))
        this.isDisabled = true
        return false
      }
      this.isDisabled = false
      return true
    }
    return {
      rules: {
        tokens: [
          { required: true, message: '请输入转账数量,限制最多4位小数', trigger: 'change' },
          { validator: validateTokens, trigger: 'change' }
        ],
        compound: [
          { required: true, message: '请选择委托方式', trigger: 'blur' }
        ]
      },
      title: '新建委托',
      // 用户信息
      amount: '0',
      // 用户所选的validator信息
      validator: {
        logo: this.$route.params.description.logo,
        moniker: this.$route.params.description.moniker,
        address: this.$route.params.validator,
        validatorUrl: this.$route.params.validator
      },
      // 用户在当前validator的委托信息
      delegation: {
        delegator_address: this.$route.params.validator,
        delegate_amount: 0,
        is_compound: false
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
  created () {
    // this.getAccount(this.currentAccount.address)
  },
  mounted () {
    this.getAccount(this.currentAccount.address)
  },
  methods: {
    oninput (e) {
      // 通过正则过滤小数点后两位
      e = (e.match(/^\d*(\.?\d{0,4})/g)[0]) || null
      this.form.tokens = e
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({
          name: 'homepage',
          params: { activeName: 'delegation' }
        })
    },
    setMax () {
      this.$data.form.tokens = this.$data.amount
    },
    confirm () {
      let details =
        '<span style="word-break: break-all;"><span style="color:blue;">委托人地址:</span><br />' +
        this.currentAccount.address
      details +=
        '<br /><span style="color:green;">验证人地址:</span><br />' +
        this.validator.address
      details +=
        '<br /><span style="color:red;">委托金额:</span><br />' +
        parseFloat(this.form.tokens).toString() +
        'QOS'
      details += '<br /><span style="color:red;">委托方式:</span><br />'
      details += this.form.compound === '1' ? '复投' : '不复投' + '</span>'
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
      const data = {
        base: myBase,
        amount: numForNoDecimal(this.form.tokens).toString(),
        is_compound: this.form.compound === '1'
      }
      const res = account.sendCreateDelegateTx(this.validator.address, data)
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
    getAccount (address) {
      const account = rpc.recoveryAccountByPrivateKey(
        this.currentAccount.privateKey
      )
      const res = account.queryAccount(address)
      res
        .then(result => {
          if (result.status === 200) {
            this.$data.amount = numFor4Decimal(result.data.value.qos)
          } else {
            this.$message({
              showClose: true,
              message: result.statusText,
              type: 'warning'
            })
          }
        })
        .catch(error => {
          console.log(error)
          // this.$message({
          //   showClose: true,
          //   message: '该账户在链上的‘账户信息’查询失败!',
          //   type: 'warning'
          // })
        })
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
  .btn-confirm {
    text-align: center;
    margin: 20px;
  }
  .text-row {
    margin: 15px 10px;
  }
  .btn-tokens {
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
