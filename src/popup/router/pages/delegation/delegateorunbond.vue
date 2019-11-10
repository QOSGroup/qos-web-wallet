<template>
  <div class="delegateorunbond-wrap">
    <el-page-header @back="goBack" content="变更委托数量"></el-page-header>
    <el-divider></el-divider>

    <div>
      <div style="float:left;width:100px;">
        <el-image style="width: 100px; height: 100px" :src="validator.logo"></el-image>
      </div>
      <div style="float:right;width:200px;">
        <div style="text-align:left;">
          <span>
            <br />
            {{ validator.moniker }}
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
      <span>当前委托：{{ delegation.delegate_amount }} QOS</span>
    </div>
    <div>
      <span>{{operation == "delegate" ? "追加" : "撤回"}}数量：</span>
    </div>
    <div>
      <el-input type="input" v-model="form.tokens" clearable size="small" style="width:75%;"></el-input>
      <el-button size="mini" style="float:right;height:38px;" @click="setMax">最大值</el-button>
    </div>
    <div>
      <span>账户余额：{{ amount }}QOS</span>
    </div>
    <div v-if="delegation.delegate_amount == 0">
      <el-radio v-model="form.compound" label="0">不复投</el-radio>
      <el-radio v-model="form.compound" label="1">复投</el-radio>
    </div>
    <div>
      <span>最大手续费：{{ form.gas }}</span>
    </div>
    <div class="block">
      <el-slider v-model="form.gas"></el-slider>
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
      //用户选择的操作：委托deleagte / 解除委托unbond web页面传递
      operation: this.$route.params.operation,
      //用户所选的validator信息
      validator: {
        logo:
          "http://img2.imgtn.bdimg.com/it/u=3293334768,2684434782&fm=26&gp=0.jpg",
        moniker: "Compass1",
        address: "qosval1zvcvwekjamvak4xefnucv6nkrf4age6n7wj7pc"
      },
      //用户在当前validator的委托信息
      delegation: {
        delegator_address: "qosval1zvcvwekjamvak4xefnucv6nkrf4age6n7wj7pc",
        delegate_amount: 100,
        is_compound: false
      },
      form: {
        tokens: "数量", //追加或撤回的token数量
        gas: 10, //支付的gas费用
        compound: "0" //页面选择是否复投
      }
    };
  },
  methods: {
    goBack() {
      window.history.length > 1
        ? this.$router.push({
            name: "homepage",
            params: { activeName: "delegation" }
          })
        : this.$router.push({ name: "homepage" });
    },
    setMax() {
      this.$data.form.tokens = this.$data.amount;
    },
    commitTx() {
      this.$router.push({ name: "txresult" });
    }
  },
  computed: {
    // operation: ''
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
</style>
