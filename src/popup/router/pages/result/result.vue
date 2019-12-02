<template>
  <div class="txresult-wrap">
    <div class="header-wrap">
      <el-page-header @back="goBack" content="交易结果"></el-page-header>
    </div>
    <div class="row">
      <div class="text-info"><span>交易已提交，上链中...</span></div>
      <div class="text-info">
        <span>交易hash：{{ txhash }}</span>
      </div>
    </div>
    <div class="row">
      <el-button type="primary" size="small" plain @click="detailInWeb">在浏览器中查看</el-button>
    </div>
    <div class="btn-confirm">
      <el-button type="primary" size="small" plain @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      txhash: this.$route.params.hash
    }
  },
  methods: {
    goBack () {
      // console.log("goBack !");
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push({ name: 'homepage' })
    },
    confirm () {
      this.$router.push({ name: 'homepage' })
    },
    detailInWeb () {
      window.open('http://www.baidu.com', '_blank')
    }
  },
  computed: {},
  mounted () {}
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.txresult-wrap {
  @include common-container;
  span {
    word-break: break-all;
    word-wrap: break-word;
  }
  .row{
    margin: 20px;
    text-align: center;
  }
  .btn-confirm{
    text-align: center
  }
  .text-info{
    margin-top: 10px;
  }
}
</style>
