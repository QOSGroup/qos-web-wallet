<template>
  <div class="newwallet-wrap">
    <el-page-header @back="goBack" content="创建钱包"></el-page-header>
    <el-divider></el-divider>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="输入密码">
        <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="重复密码">
        <el-input placeholder="请再次输入密码" v-model="form.repassword" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
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
        password: "",
        repassword: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    goBack() {
      console.log("goBack!");
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
