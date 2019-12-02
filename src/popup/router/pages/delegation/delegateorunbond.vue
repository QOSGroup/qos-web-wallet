<template>
  <div class="delegateorunbond-wrap">
    <div class="header-wrap">
      <el-page-header @back="goBack" :content="title"></el-page-header>
    </div>

    <div>
      <div style="float:left;width:100px;">
        <el-image style="width: 100px; height: 100px" :src="validator.logo"></el-image>
      </div>
      <div style="float:right;width:200px;">
        <div style="text-align:left;">
          <div style="float:left;font-size: medium;">{{ validator.moniker }}</div>
          <div style="float:left;">
            <el-link :href="validator.validatorUrl" target="_blank">
              <i class="el-icon-link"></i>
            </el-link>
          </div>
        </div>
        <div style="text-align:left;">
          <span>
            <br />
            {{ validator.address }}
          </span>
        </div>
      </div>
    </div>

    <div>
      <span>当前委托：{{ delegation.delegate_amount }} QOS</span>
    </div>
    <div>
      <span>{{operation == "delegate" ? "追加" : "撤回"}}数量：</span>
    </div>
    <div>
      <el-input type="input" v-model="form.tokens" clearable size="small" style="width:75%;"></el-input>
      <el-button size="mini" style="float:right;height:38px;" @click="setMax">最大值</el-button>
    </div>
    <div>
      <span>账户余额：{{ amount }}QOS</span>
    </div>
    <div v-if="delegation.delegate_amount == 0">
      <el-radio v-model="form.compound" label="0">不复投</el-radio>
      <el-radio v-model="form.compound" label="1">复投</el-radio>
    </div>

    <!-- <div>
      <span>最大手续费：{{ form.gas }}</span>
    </div>
    <div class="block">
      <el-slider v-model="form.gas"></el-slider>
    </div>-->

    <div style="text-align:center;">
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
import store from '@/store'
import { rpc } from '@/utils/rpc'
import { numForNoDecimal } from '@/utils/index'
export default {
  data () {
    const index = store.getters.accounts.findIndex(x => x.address === store.getters.currentAccount.address)
    return {
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
      onloading: false,
      // 弹出提示框数据
      dialogVisible: false,
      error: '',
      currentAccount: store.getters.accounts[index]
    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.push({
          name: 'homepage',
          params: { activeName: 'delegation' }
        })
        : this.$router.push({ name: 'homepage' })
    },
    setMax () {
      this.$data.form.tokens = this.$data.amount
    },
    confirm () {
      let details = '<span style="word-break: break-all;"><span style="color:blue;">你的地址</span>:<br />' + this.currentAccount.address
      details += '<br /><span style="color:green;">验证人地址:</span><br />' + this.validator.address
      details += '<br /><span style="color:red;">操作金额</span>:<br />' + this.form.tokens.toString() + 'QOS</span>'
      this.$confirm(details, '交易确认', {
        customClass: 'message-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.commitTx()
      }).catch(() => {

      })
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
          this.error = '网络错误,请稍后重试!'
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
}
div {
  text-align: left;
  overflow: hidden;
  overflow-y: auto;
  margin: 1% 0 2% 0;
  vertical-align: middle;
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
