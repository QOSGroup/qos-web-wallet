<template>
  <div class="accountexport-wrap">
    <div class="header-wrap">
      <el-page-header @back="goBack" content="导出私钥"></el-page-header>
    </div>

    <div class="row mt">
      <span>账户名称：{{ name }}</span>
    </div>
    <div class="row">
      <span>账户地址：{{ address }}</span>
    </div>
    <div class="row" v-if="flag_password">
      <span>输入密码：</span>
      <el-input placeholder="请输入密码" v-model="password" show-password auto-complete="off" class="pwd-input"></el-input>
    </div>
    <div v-if="flag_privateKey">
      <span>您的私钥：</span>
    </div>
    <div v-if="flag_privateKey">
      <el-input
        placeholder="私钥"
        type="textarea"
        v-model="prikey"
        auto-complete="off"
        :autosize="{ minRows: 2, maxRows: 6}"
      ></el-input>
    </div>
    <div class="row">
      <span style="color:red;">注意：永远不要公开这个私钥。任何拥有你的私钥的人都可以窃取你帐户中的任何资产。</span>
    </div>
    <div style="text-align:center;">
      <el-button type="primary" @click="exportPrikey">确定</el-button>
      <el-button @click="goBack">取消</el-button>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { getCurrentAccount } from '@/business/auth'
import { decrypt } from '@/utils/crypt'
import { isNotEmpty } from '@/utils'
export default {
  data () {
    const index = store.getters.accounts.findIndex(
      x => x.address === store.getters.currentAccount.address
    )
    return {
      name: store.getters.currentAccount.name,
      address: store.getters.currentAccount.address,
      password: '',
      prikey: '',
      flag_password: true,
      flag_privateKey: false,
      currentAccount: store.getters.accounts[index]
    }
  },
  computed: {},
  methods: {
    async exportPrikey () {
      // popup store中存储currentAccount, 数据来源与持久化存储的当前账户
      const currentAccount = await getCurrentAccount()
      // 密码解密
      const privateKey = decrypt(currentAccount.encryptKey, this.password)
      if (!isNotEmpty(privateKey)) {
        this.$message({
          showClose: true,
          message: '密码不匹配,请重新输入!',
          type: 'error'
        })
        return false
      }
      // 隐藏密码,显示私钥
      this.flag_password = false
      this.flag_privateKey = true
      this.prikey = privateKey
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ name: 'homepage' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.accountexport-wrap {
  @include common-container;
  span {
    word-break: break-all;
    word-wrap: break-word;
    font-size: 14px;
  }
  .row {
    margin: 0 15px 10px;
    display: flex;
    min-height: 25px;
    align-items: center;
    &.mt{
      margin-top: 10px;
    }
  }
  .pwd-input{
    flex: 1;
  }
}
</style>
