<template>
  <div class="login-wrap">
    <img class="logo" src="/icons/qos.png" alt="qos logo" />
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label prop="pwd">
        <el-input v-model="ruleForm.pwd" placeholder="请输入登录密码" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn btn-login" type="primary" @click="enterWallet">进入我的钱包</el-button>
      </el-form-item>
    </el-form>
    <div class="text-link">
      <el-link target="_blank" @click="forgetPassword">忘记密码？</el-link>
    </div>
    <div class="text-link">
      <el-link target="_blank" @click="noWallet">没有钱包？</el-link>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="80%"
      custom-class="qos-dialog"
    >
      <span>密码不匹配,请重新输入!</span>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBackground } from '../../../common/bgcontact'
import store from '../../../../store'
import * as types from '@/store/mutation-types'
import { getCurrentAccount } from '@/business/auth'
import { Res } from '../../../../common/Common'

export default {
  data () {
    return {
      ruleForm: {
        pwd: ''
      },
      rules: {
        pwd: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 8,
            max: 16,
            message: '长度8-16个字符',
            trigger: 'blur'
          }
        ]
      },
      dialogVisible: false
    }
  },
  methods: {
    forgetPassword () {
      this.$router.push({ name: 'walletimport' })
    },
    noWallet () {
      this.$router.push({ name: 'walletcreate' })
    },
    async enterWallet () {
      const bg = getBackground()
      const acclist = await bg.login(this.ruleForm.pwd)
      // 解密出账户列表
      if (acclist) {
        // popup store中存储currentAccount, 数据来源与持久化存储的当前账户
        const currentAccount = await getCurrentAccount()
        store.commit(types.SET_CURRENT_ACCOUNT, currentAccount)
        // 创建账户成功,拷贝bg store中的accounts到popup store中
        const bgState = bg.getBgState()
        store.commit(types.CLONE_STATE, { keyArr: ['accounts'], bgState })
        // process MSG  返回当前账户地址
        if (this.$store.getters.msgQueueLast && this.$store.getters.msgQueueLast.callbackId) {
          console.log(this.$store.getters.msgQueueLast.callbackId)
          bg.msgProcessed(new Res(true, { addr: store.getters.currentAccount.address }, this.$store.getters.msgQueueLast.callbackId))
        }
        // 跳转主页,如果有消息,自动跳转后续消息处理
        this.$router.push({ name: 'homepage' })
      } else {
        this.dialogVisible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.login-wrap {
  @include common-container;
  padding: 20px 30px;
  box-sizing: border-box;
  .logo {
    width: 20%;
    display: block;
    margin: 0 auto;
    margin-bottom: 20px;
  }
  .btn-login {
    width: 100%;
  }
  .text-link{
    text-align:left;
    height:30px;
  }
}
</style>
<style lang="scss">
.qos-dialog {
  .el-dialog__body {
    padding: 0 30px !important;
  }
}
</style>
