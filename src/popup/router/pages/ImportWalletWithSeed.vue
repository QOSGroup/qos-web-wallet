<template>
  <div class="importwalletwithseed-wrap">
    <el-page-header @back="goBack" content="使用助记词恢复钱包"></el-page-header>
    <el-divider></el-divider>
    <el-form ref="form" :model="form" label-width="80px" v-bind:rules="rules" class="demo-ruleForm">
      <el-form-item label="助记词" prop="memwd">
        <el-input
          placeholder="请输入12个单词的助记词"
          type="textarea"
          v-model="form.memwd"
          auto-complete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input placeholder="请输入密码" v-model="form.password" show-password auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="repassword">
        <el-input placeholder="请再次输入密码" v-model="form.repassword" show-password auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="recoverWallet('form')">恢复</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setToken, setAccountList } from "@/business/auth";
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
        memwd: "",
        password: "",
        repassword: ""
      },
      rules: {
        memwd: [
          { required: true, message: "请输入助记词", trigger: "blur" },
          { min: 12, message: "长度为 12 个单词", trigger: "blur" }
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        repassword: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    recoverWallet(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 数据合法,创建账户 todo

          // 设置登陆token
          setToken("wangkuan");
          // 添加账户至存储accountlist中
          // setAccountList();
          // 跳转home主页
          this.$router.push("/");
          //alert("recoverWallet!");
        } else {
          console.log("error recoverWallet!!");
          return false;
        }
      });
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
.importwalletwithseed-wrap {
  width: 308px;
  padding: 30px 20px;
}
</style>
