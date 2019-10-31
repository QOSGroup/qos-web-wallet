<template>
  <div class="txresult-wrap">
    <el-page-header @back="goBack" content="交易结果"></el-page-header>
    <el-divider></el-divider>
    <div>
      <div><span>交易已提交，上链中...</span></div>
      <div>
        <span>交易hash：{{ txhash }}</span>
        <i class="el-icon-link"></i>
      </div>
    </div>
    <div>
      <el-button type="primary" size="small" plain>在浏览器中查看</el-button>
    </div>
    <div>
      <el-button type="primary" size="mini" plain @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      txhash: "nbvfrtyujnbvcdthjuytfiuytfvbnjytfvbvbnbvfjnhgfcvb"
    };
  },
  methods: {
    goBack() {
      console.log("goBack !");
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/homepage')
    }
  },
  computed: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.txresult-wrap {
  @include common-container;
  width: 308px;
  height: 500px;
  padding: 30px 20px;
  div {
    text-align: center;
    overflow: hidden;
    overflow-y: auto;
    margin-bottom: 10%;
    vertical-align: middle;
  }
  span {
    word-break: break-all;
    word-wrap: break-word;
  }
}
</style>
