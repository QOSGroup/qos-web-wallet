<template>
  <div class="register-wrap">
    <img class="logo" src="/icons/qos.png" alt="qos logo" />
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item>
        <el-button class="btn btn-register" type="primary" @click="newWallet">立即创建</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="btn btn-register" type="primary" @click="importWallet">立即导入</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {},
      rules: {}
    }
  },
  computed: {
  },
  mounted () {
    console.log(this.$store.state.toPage.pageName)
  },
  methods: {
    newWallet () {
      this.$router.push({ name: 'walletcreate' })
    },
    importWallet () {
      this.$router.push({ name: 'walletimport' })
    }
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
    margin: 50px auto;
  }
  .btn-register {
    width: 100%;
  }
  .el-form-item{
    margin: 20px 20px 20px 20px;
  }
}
</style>
