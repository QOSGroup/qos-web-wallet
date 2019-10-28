<template>
  <div class="importwalletwithseed-wrap">
    <el-page-header @back="goBack" content="使用助记词恢复钱包"></el-page-header>
    <el-divider></el-divider>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="助记词">
        <el-input placeholder="请输入12个单词的助记词" type="textarea" v-model="form.memwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="重复密码">
        <el-input placeholder="请再次输入密码" v-model="form.repassword" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="recoverWallet">恢复</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        memwd: "",
        password: "",
        repassword: ""
      }
    };
  },
  methods: {
    recoverWallet() {
      console.log("recoverWallet!");
    },
    goBack() {
      console.log("goBack!");
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
