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
import { setLoaclStorage } from "../../../common/common";
import QOSRpc from "js-for-qos-httprpc";

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
          { min: 8, max: 8, message: "密码位数8位!", trigger: "blur" }
        ],
        repassword: [{ validator: validatePass2, trigger: "blur" }]
      },
      rpc: new QOSRpc({ baseUrl: "http://47.98.253.9:9876" })
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 数据合法,创建账户 todo
          // 随机创建地址
          const mn = this.rpc.generateMnemonic();
          const account = this.rpc.importAccount(mn);
          // 私钥方式得到account对象
          // const prikey = "UEUXfiOwd+dIsqWEdRtE/S5RfLKMmeaFemZIupgENTg4u4yGzEaHNqFPtxzdkQ58duoL5QYv7yBT16Vd/B/o4w==";
          // const account = this.rpc.recoveryAccountByPrivateKey(prikey);
          console.log(account.mnemonic);
          setLoaclStorage(account, this.form.password);

          // 账户新建后,默认跳转newwalletresult页面
          this.$router.push({
            name: "walletresult",
            params: { mnemonic: account.mnemonic }
          });
        } else {
          console.log("error newwallet!!");
          return false;
        }
      });
    },
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ name: "homepage" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.newwallet-wrap {
  @include common-container;
}
</style>
