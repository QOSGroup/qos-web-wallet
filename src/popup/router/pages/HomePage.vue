<template>
  <div class="homepage-wrap">
    <div style="background:#426ab3;">
      <div>
        <span>{{ userName }}</span>
        <i @click="showAccountList" class="el-icon-more" style>更多</i>
      </div>
      <div>
        <span style="word-break:break-all;word-wrap:break-word;">{{ address }}</span>
        <i class="el-icon-document-copy"></i>
      </div>
    </div>
    <el-divider></el-divider>
    <div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="我的资产" name="balance">
          <div class="b_div">QOS</div>
          <div class="b_div">
            1234567.765
            <i class="el-icon-link"></i>
          </div>
          <div class="b_div">
            <el-button type="primary" plain>转账</el-button>
            <el-button type="primary" plain>预授权</el-button>
          </div>
          <el-divider style="dashed" width="80%"></el-divider>
          <div class="b_div">QOS</div>
          <div class="b_div">
            1234567.765
            <i class="el-icon-link"></i>
          </div>
          <div class="b_div">
            <el-button type="primary" plain>转账</el-button>
            <el-button type="primary" plain>预授权</el-button>
          </div>
          <el-divider style="dashed" width="80%"></el-divider>
          <div class="b_div">QOS</div>
          <div class="b_div">
            1234567.765
            <i class="el-icon-link"></i>
          </div>
          <div class="b_div">
            <el-button type="primary" plain>转账</el-button>
            <el-button type="primary" plain>预授权</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的委托" name="delegation"></el-tab-pane>
        <el-tab-pane label="我的预授权" name="approve">该功能暂未开发！</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "balance",
      userName: "数字钱包",
      address: "qwertyuiopasdfghjklzxcvbnmmnbvcxzasdfghjklpovbhgtrew"
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tag, event);
    },
    showAccountList() {
      console.log("showAccountList!");
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.homepage-wrap {
  @include common-container;
  width: 308px;
  height: 400px;
  padding: 30px 20px;
  .b_div {
    text-align: center;
  }
}
</style>
