<template>
  <div class="delegateorunbond-wrap">
    <el-page-header @back="goBack" content="变更委托方式"></el-page-header>
    <el-divider></el-divider>

    <div>
      <div style="float:left;width:100px;">
        <el-image style="width: 100px; height: 100px" :src="validator.url"></el-image>
      </div>
      <div style="float:right;width:200px;">
        <div style="text-align:left;">
          <span>
            <br />
            {{ validator.name }}
          </span>
          <i class="el-icon-link"></i>
        </div>
        <div style="text-align:left;">
          <span>
            <br />
            {{ validator.address }}
          </span>
          <i class="el-icon-link"></i>
        </div>
      </div>
    </div>

    <div>
      <span>当前委托：{{ delegation.amount }} QOS</span>
    </div>
    <div v-if="this.$route.params.isCompound == 'true'">
      <div class="div_modify" >复投</div>
      <div class="div_modify">
        <i class="el-icon-right"></i>
      </div>
      <div class="div_modify" >不复投</div>
    </div>
    <div v-else>
      <div class="div_modify">不复投</div>
      <div class="div_modify">
        <i class="el-icon-right"></i>
      </div>
      <div class="div_modify">复投</div>
    </div>
    <div>
      <span>最大手续费：{{ form.gas }}</span>
    </div>
    <div class="block">
      <el-slider v-model="form.gas" max="100"></el-slider>
    </div>

    <div style="text-align:center;">
      <el-button type="primary" size="small" plain @click="commitTx">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //用户信息
      userName: "wangkuan",
      address: "qosacc1g24jk70w086h88hs0akmum9azkh49pa0gjn7uc",
      amount: 1234.56,
      //用户所选的validator信息
      validator: {
        url:
          "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        name: "Compass1",
        address: "qosval1zvcvwekjamvak4xefnucv6nkrf4age6n7wj7pc"
      },
      //用户在当前validator的委托信息
      delegation: {
        address: "qosval1zvcvwekjamvak4xefnucv6nkrf4age6n7wj7pc",
        amount: "1000",
        isCompound: true
      },
      form: {
        gas: 10 //支付的gas费用
      }
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    commitTx() {
      this.$router.push("/txresult");
    }
  },
  computed: {
  }
};
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.delegateorunbond-wrap {
  @include common-container;
  width: 308px;
  height: 500px;
  padding: 30px 20px;
}
div {
  text-align: left;
  overflow: hidden;
  overflow-y: auto;
  margin: 1% 0 2% 0;
  vertical-align: middle;
}
span {
  word-break: break-all;
  word-wrap: break-word;
  font-size: 14px;
}
.div_modify {
  height: 50px;
  font-size: x-large;
  margin-top: 20px;
  float: left;
  width: 33.33%;
  text-align: center;
}
</style>
