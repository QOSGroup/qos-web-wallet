<template>
  <div class="login-wrap">
    <img class="logo" src="/icons/qos.png" alt="qos logo" />
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label prop="pwd">
        <el-input v-model="ruleForm.pwd" placeholder="请输入登录密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn btn-login" type="primary" @click="submitForm('ruleForm')">进入我的钱包</el-button>
      </el-form-item>
    </el-form>
    <div style="text-align:left;height:30px;">
      <el-link target="_blank" @click="forgetPassword">忘记密码？</el-link>
    </div>
    <div style="text-align:left;height:30px;">
      <el-link target="_blank" @click="noWallet">没有钱包？</el-link>
    </div>
  </div>
</template>

<script>
import { setToken } from "@/business/auth";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      // todo 验证密码是否正确
      if (value === "password") {
        // 设置登陆token
        setToken("wangkuan");
        this.$router.push({ name: "homepage" });
      } else {
        callback(alert("密码不匹配,请重新输入!"));
      }
    };
    return {
      ruleForm: {
        pwd: ""
      },
      rules: {
        pwd: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 30,
            message: "长度在 6 到 30 个字符",
            trigger: "blur"
          },
          { validator: validatePass, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    forgetPassword() {
      this.$router.push({ name: "walletimport" });
    },
    noWallet() {
      this.$router.push({ name: "walletcreate" });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          console.log("error submit!!");
          return false;
        }
      });
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
