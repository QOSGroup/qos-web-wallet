<template>
  <div class="delegateorunbond-wrap">
    <div class="header-wrap">
      <el-page-header @back="goBack" content="验证人列表"></el-page-header>
    </div>

    <div>
      <div v-for="(validator, index) in validators" :key="index" class="row">
        <div class="logo-addr-contents">
          <div class="logo-div">
            <el-image class="logo-image" :src="validator.description.logo"></el-image>
          </div>
          <div class="text-detail">
            <div class="logo-addr-contents">
              <div class="text-moniker text-validator">
                <span>{{ validator.description.moniker }}</span>
                <el-link :href="qoschain + '/validators/detail?addr=' + validator.validator + '&validators=' + validator.description.moniker" target="_blank" class="link-wrap">
                  <i class="el-icon-link"></i>
                </el-link>
              </div>
              <div
                v-if="delegations.findIndex(x => x.validator_address === validator.validator) < 0"
                class="text-validator"
              >
                <el-button type="primary" size="mini" @click="setValidator(validator)">新建委托</el-button>
              </div>
              <div class="text-validator" v-else>
                <el-button type="primary" size="mini" @click="toHomepage(validator)">已有委托</el-button>
              </div>
            </div>
            <div class="text-validator">
              <span>{{ validator.validator }}</span>
            </div>
            <div class="text-validator">
              <span>总委托：{{ validator.bondTokens / 10000 }}</span>
            </div>
          </div>
        </div>

        <div class="text-validator">
          <span>验证状态：{{ validator.status === 'active' ? '活跃' : '非活跃' }}</span>
        </div>
        <div class="text-validator">
          <span>佣&nbsp;&nbsp;金&nbsp;&nbsp;率：{{ validator.commission.commission_rates.rate }}</span>
        </div>
        <div class="text-validator">
          <span>官方网址: {{ validator.description.website }}</span>
        </div>
        <div class="text-validator">
          <span>详细信息: {{ validator.description.details }}</span>
        </div>
        <el-divider width="80%"></el-divider>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="300px"
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
import { rpc, qoschain } from '@/utils/rpc'
export default {
  data () {
    const index = store.getters.accounts.findIndex(
      x => x.address === store.getters.currentAccount.address
    )
    return {
      address: store.getters.currentAccount.address,
      // 当前账户的所有委托
      delegations: [],
      // 所有validators
      validators: [],
      // 弹出提示框数据
      dialogVisible: false,
      error: '',
      currentAccount: store.getters.accounts[index],
      qoschain: qoschain
    }
  },
  created () {
    this.getDelegations(this.$data.address)
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
    toHomepage (validator) {
      this.$router.push({
        name: 'homepage',
        params: { validator, activeName: 'delegation' }
      })
    },
    setValidator (validator) {
      this.$router.push({ name: 'delegationcreate', params: validator })
    },
    getDelegations (address) {
      // 刷新委托信息
      this.delegations = []
      const account = rpc.recoveryAccountByPrivateKey(
        this.currentAccount.privateKey
      )
      const res = account.queryDelagationAll(address)
      res
        .then(async result => {
          if (result.status === 200) {
            this.delegations = result.data
          } else {
            this.$message({
              showClose: true,
              message: '系统查询数据失败,请稍后重试!',
              type: 'warning'
            })
          }
        })
        .catch(error => {
          console.log('您访问的信息不存在!  error:', error)
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
              message: '系统发生错误,请稍后再试!',
              type: 'warning'
            })
          }
        })
        .catch(error => {
          console.log('您访问的信息不存在!  error:', error)
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
  .row {
    margin: 10px;
  }
  .logo-addr-contents {
    display: flex;
  }
  .logo-div{
    width: 100px;
    height: 100px;
    align-items: center;
  }
  .logo-image {
    width: 100px;
    // height: 100px;
    margin: 25% 0;
  }
  .text-moniker {
    width: 140px;
    align-items: center;
  }
  .text-detail {
    width: 240px;
    height: 100px;
    align-items: center;
  }
  .link-wrap {
    cursor: pointer;
  }
  .text-validator {
    margin: 5px 5px;
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
