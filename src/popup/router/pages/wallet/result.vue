<template>
  <div class="newwalletresult-wrap">
    <el-page-header @back="goBack" content="创建钱包"></el-page-header>
    <el-divider></el-divider>
    <div>
      <span>钱包创建成功，钱包助记词为：</span>
      <el-input type="textarea" v-model="form.memwd"></el-input>
      <span>助记词是您恢复钱包的唯一手段，请牢记助记词，并确保助记词的安全。</span>
    </div>
    <br />
    <div>
      <el-button type="primary" @click="exportMemwd">导出助记词</el-button>
      <span>请勿使用在线服务保存助记词</span>
    </div>
    <br />
    <div>
      <el-button type="primary" @click="confirm" plain>确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        memwd: this.$route.params.mnemonic
      }
    }
  },
  methods: {
    exportMemwd () {
      console.log('exportMemwd!')
    },
    goBack () {
      this.$router.push({ name: 'homepage' })
    },
    confirm () {
      this.$confirm('再次确认您已经妥善保存助记词!', '助记词确认', {
        customClass: 'message-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '您点击了确认,助记词不会再展示!'
        })
        this.$router.push({ name: 'homepage' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '您点击了取消,请妥善保存助记词!'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.newwalletresult-wrap {
  @include common-container;
}
</style>
<style lang="scss">
.message-confirm {
    width: 300px !important;
}
</style>
