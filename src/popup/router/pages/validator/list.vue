<template>
  <div class="delegateorunbond-wrap">
    <el-page-header @back="goBack" content="验证人列表"></el-page-header>
    <el-divider></el-divider>

    <div>
      <div v-for="(validator, index) in validators" :key="index">
        <div>
          <div style="float:left;width:100px;">
            <el-image style="width: 100px; height: 100px" :src="validator.description.logo"></el-image>
          </div>
          <div style="float:right;width:200px;">
            <div style="text-align:left;">
              <div style="float:left;font-size:x-large;">{{ validator.description.moniker }}</div>
              <div style="float:left;font-size:x-large;">
                <el-link :href="validator.validator" target="_blank">
                  <i class="el-icon-link"></i>
                </el-link>
              </div>
              <div style="float:right;">
                <el-button
                  type="primary"
                  size="mini"
                  @click="setValidator(validator)"
                >委 托</el-button>
              </div>
            </div>
            <div style="text-align:left;">
              <span>{{ validator.validator }}</span>
            </div>
            <div style="text-align:left;">
              <span>总委托：{{ validator.bondTokens / 10000 }}</span>
            </div>
          </div>
        </div>

        <div>
          <span>验证状态：{{ validator.status }}</span>
        </div>
        <div>
          <span>佣&nbsp;&nbsp;金&nbsp;&nbsp;率：{{ validator.commission.commission_rates.rate }}</span>
        </div>
        <div>
          <span>官方网址: {{ validator.description.website }}</span>
        </div>
        <div>
          <span>详细信息: {{ validator.description.details }}</span>
        </div>
        <el-divider width="80%"></el-divider>
      </div>
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
      // 所有validators
      validators: [],
      // 用户所选的validator信息
      validator: {
        logo: '',
        moniker: '',
        address: '',
        validatorUrl: ''
      },
      // 弹出提示框数据
      dialogVisible: false,
      error: '',
      currentAccount: store.getters.accounts[index]
    }
  },
  created () {
    this.getValidators()
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
    setValidator (validator) {
      const choose = validator.validator
      const account = rpc.recoveryAccountByPrivateKey(
        this.currentAccount.privateKey
      )
      const res = account.queryDelagationOne(
        this.currentAccount.address,
        choose
      )
      res
        .then(result => {
          this.$message({
            showClose: true,
            message: '已有委托,请从‘我的委托’中进行追加或撤回!',
            type: 'warning'
          })
        })
        .catch(error => {
          console.log(error)
          this.$router.push({ name: 'delegationcreate', params: validator })
        })
    },
    getValidators () {
      const account = rpc.recoveryAccountByPrivateKey(
        this.currentAccount.privateKey
      )
      const res = account.queryValidatorAll()
      res
        .then(result => {
          if (result.status === 200) {
            this.validators = result.data
          } else {
            this.$message({
              showClose: true,
              message: result.statusText,
              type: 'warning'
            })
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: 'error'
          })
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
  margin: 2% 0 3% 0;
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
