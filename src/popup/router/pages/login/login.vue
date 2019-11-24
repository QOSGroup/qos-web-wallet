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
    <div style="text-align:left;height:30px;">
      <el-link target="_blank" @click="forgetPassword">忘记密码？</el-link>
    </div>
    <div style="text-align:left;height:30px;">
      <el-link target="_blank" @click="noWallet">没有钱包？</el-link>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
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
import { getAccountList } from "@/business/auth"
import { encrypt, decrypt } from "@/utils/crypt";
import { getBackground } from '../../../common/bgcontact';
import store from '../../../../store'
import * as types from '@/store/mutation-types'
export default {
  data() {
    return {
      ruleForm: {
        pwd: ""
      },
      rules: {
        pwd: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "长度8-16个字符",
            trigger: "blur"
          }
        ]
      },
      dialogVisible: false
    };
  },
  methods: {
    forgetPassword() {
      this.$router.push({ name: "walletimport" });
    },
    noWallet() {
      this.$router.push({ name: "walletcreate" });
    },
    async enterWallet() {
      const bg = getBackground();
      const acclist = await bg.login(this.ruleForm.pwd);
      if (acclist) {
        for (const acc of acclist){
          store.commit(types.SET_ACCOUNT, acc)
        }
        this.$router.push({ name: "homepage" });
      } else {
        this.dialogVisible = true;
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.login-wrap {
  @include common-container;
  .logo {
    width: 20%;
    display: block;
    margin: 0 auto;
    margin-bottom: 20px;
  }
  .btn-login {
    width: 100%;
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
