<template>
  <div class="register-wrap">
    <img class="logo" src="/icons/qos.png" alt="qos logo" />
    <div>{{testName}}</div>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <!-- <el-form-item label prop="name">
        <el-input v-model="ruleForm.pwd" placeholder="请输入登录密码"></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-button class="btn btn-register" type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="btn btn-register" type="primary" @click="submitForm('ruleForm')">立即导入</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      ruleForm: {
        pwd: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    testName () {
      return this.$store.state.toPage.pageName
    }
  },
  mounted () {
    console.log(this.$store.state.toPage.pageName)
  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.register-wrap {
  @include common-container;
  .logo {
    width: 20%;
    display: block;
    margin: 0 auto;
    margin-bottom: 50px;
  }
  .btn-register {
    width: 100%;
  }
}
</style>
