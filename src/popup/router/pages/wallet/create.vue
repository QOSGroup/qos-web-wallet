<template>
  <div class="newwallet-wrap">
    <el-page-header @back="goBack" content="创建钱包"></el-page-header>
    <el-divider></el-divider>
    <el-form ref="form" :model="form" label-width="80px" v-bind:rules="rules">
      <el-form-item label="输入密码" prop="password">
        <el-input placeholder="请输入密码" v-model="form.password" show-password auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="repassword">
        <el-input placeholder="请再次输入密码" v-model="form.repassword" show-password auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setToken } from "@/business/auth";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.repassword !== "") {
          this.$refs.form.validateField("repassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        password: "",
        repassword: ""
      },
      rules: {
        password: [
          { validator: validatePass, trigger: "blur" },
          { min: 6, max: 12, message: "密码位数6~12位!" }
        ],
        repassword: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 数据合法,创建账户 todo

          // 设置登陆token
          setToken("wangkuan");
          // 添加账户至存储accountlist中
          // setAccountList();
          // 账户新建后,默认跳转newwalletresult页面
          this.$router.push({name: "walletresult"});
        } else {
          console.log("error newwallet!!");
          return false;
        }
      });
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push({name: "homepage"});
    }
  }
};
</script>

<style lang="scss" scoped>
.newwallet-wrap {
  width: 308px;
  padding: 30px 20px;
}
</style>
