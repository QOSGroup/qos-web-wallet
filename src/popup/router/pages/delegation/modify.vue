<template>
  <div class="modify-wrap">
    <div class="header-wrap">
      <el-page-header @back="goBack" content="变更委托方式"></el-page-header>
    </div>

    <div class="div-contents">
      <div class="logo-div">
        <el-image class="logo-image" :src="validator.logo"></el-image>
      </div>
      <div>
        <div class="text-info">
          <span>{{ validator.moniker }}</span>
          <el-link :href="validator.validatorUrl" target="_blank">
            <i class="el-icon-link"></i>
          </el-link>
        </div>
        <div class="text-info">
          <span>{{ validator.address }}</span>
        </div>
      </div>
    </div>
    <div class="text-info">
      <span>当前委托：{{ delegation.delegate_amount }} QOS</span>
    </div>
    <div v-if="this.$route.params.is_compound == 'true'" class="text-info">
      <div class="div_modify">复投</div>
      <div class="div_modify">
        <i class="el-icon-right"></i>
      </div>
      <div class="div_modify">不复投</div>
    </div>
    <div v-else>
      <div class="div_modify">不复投</div>
      <div class="div_modify">
        <i class="el-icon-right"></i>
      </div>
      <div class="div_modify">复投</div>
    </div>

    <!-- <div>
      <span>最大手续费：{{ form.gas }}</span>
    </div>
    <div class="block">
      <el-slider v-model="form.gas" max="100"></el-slider>
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
export default {
  data () {
    const index = store.getters.accounts.findIndex(
      x => x.address === store.getters.currentAccount.address
    )
    return {
      // 用户信息
      amount: this.$route.params.amount,
      // 用户所选的validator信息
      validator: {
        logo: this.$route.params.delegation.logo,
        moniker: this.$route.params.delegation.moniker,
        address: this.$route.params.delegation.validator_address,
        validatorUrl: 'http://www.baidu.com'
      },
      // 用户在当前validator的委托信息
      delegation: {
        delegator_address: this.$route.params.delegation.validator_address,
        delegate_amount: this.$route.params.delegation.delegate_amount,
        is_compound: this.$route.params.delegation.is_compound
      },
      form: {
        gas: 0 // 支付的gas费用
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
    confirm () {
      let details =
        '<span style="word-break: break-all;"><span style="color:blue;">你的地址</span>:<br />' +
        this.currentAccount.address
      details +=
        '<br /><span style="color:green;">验证人地址:</span><br />' +
        this.validator.address
      if (this.$route.params.is_compound.toString() === 'true') {
        details +=
          '<br /><span style="color:red;">委托方式修改:</span>:<br />"复投"修改为"不复投"'
      } else {
        details +=
          '<br /><span style="color:red;">委托方式修改:</span>:<br />"不复投"修改为"复投"'
      }
      details += '</span>'
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
      // 点击完成确认按钮后,调用修改委托方式.
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
        is_compound: !(this.$route.params.is_compound.toString() === 'true'),
        base: myBase
      }
      const res = account.sendModifyDelegationTx(this.validator.address, data)
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
  computed: {}
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.modify-wrap {
  @include common-container;
  .div-contents {
    display: flex;
    margin: 10px 10px;
  }
  .logo-div {
    width: 100px;
    height: 100px;
  }
  .logo-image {
    width: 100px;
    height: 100px;
  }
  .text-info {
    margin: 10px 10px;
  }
}
span {
  word-break: break-all;
  word-wrap: break-word;
  font-size: 14px;
}
.div_modify {
  height: 50px;
  font-size: x-large;
  margin-top: 20px;
  float: left;
  width: 33.33%;
  text-align: center;
}
</style>
<style lang="scss">
.qos-dialog {
  .el-dialog__body {
    padding: 0 30px !important;
  }
}
