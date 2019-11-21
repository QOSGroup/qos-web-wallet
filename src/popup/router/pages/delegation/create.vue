<template>
  <div class="delegateorunbond-wrap">
    <el-page-header @back="goBack" :content="title"></el-page-header>
    <el-divider></el-divider>

    <div>
      <div style="float:left;width:100px;">
        <el-image style="width: 100px; height: 100px" :src="validator.logo"></el-image>
      </div>
      <div style="float:right;width:200px;">
        <div style="text-align:left;">
          <div style="float:left;font-size: medium;">{{ validator.moniker }}</div>
          <div style="float:left;">
            <el-link :href="validator.validatorUrl" target="_blank">
              <i class="el-icon-link"></i>
            </el-link>
          </div>
        </div>
        <div style="text-align:left;">
          <span>
            <br />
            {{ validator.address }}
          </span>
        </div>
      </div>
    </div>
    <div>
      <span>账户余额：{{ amount }}QOS</span>
    </div>
    <div>
      <span>当前委托：{{ delegation.delegate_amount }} QOS</span>
    </div>
    <div>
      <span>委托数量：</span>
    </div>
    <div>
      <el-input type="input" v-model="form.tokens" clearable size="small" style="width:75%;"></el-input>
      <el-button size="mini" style="float:right;height:38px;" @click="setMax">最大值</el-button>
    </div>

    <div>
      <span>委托方式:</span>
      <el-radio v-model="form.compound" label="0">不复投</el-radio>
      <el-radio v-model="form.compound" label="1">复投</el-radio>
    </div>

    <!-- <div>
      <span>最大手续费：{{ form.gas }}</span>
    </div>
    <div class="block">
      <el-slider v-model="form.gas"></el-slider>
    </div>-->

    <div style="text-align:center;">
      <el-button type="primary" size="small" plain @click="commitTx">确定</el-button>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      custom-class="qos-dialog"
    >
      <span>{{ this.error }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import QOSRpc from "js-for-qos-httprpc";
import { getCurrentAccount } from "@/business/auth";
export default {
  data() {
    return {
      title: "新建委托",
      //用户信息
      amount: this.$route.params.amount,
      //用户所选的validator信息
      validator: {
        logo: "",
        moniker: "",
        address: "",
        validatorUrl: ""
      },
      //用户在当前validator的委托信息
      delegation: {
        delegator_address: "",
        delegate_amount: 0,
        is_compound: false
      },
      form: {
        tokens: "", //追加或撤回的token数量
        gas: 0, //支付的gas费用
        compound: "0" //页面选择是否复投
      },
      // 弹出提示框数据
      dialogVisible: false,
      error: "",
      currentAccount:
        store.getters.accounts[
          store.getters.accounts.findIndex(
            x => x.address === getCurrentAccount().address
          )
        ],
      rpc: new QOSRpc({ baseUrl: "http://47.98.253.9:9876" })
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
      //点击完成确认按钮后,首先调用转账接口,得到后台返回的json字符串
      const account = this.rpc.recoveryAccountByPrivateKey(
        this.currentAccount.privateKey
      );
      // 创建基础数据结构
      const myBase = {
        from: this.currentAccount.address
        // chain_id: "qos-test",
        // max_gas: this.form.gas.toString()
      };
      // 组装data数据,调用rpc接口,提交交易
      const data = {
        base: myBase,
        amount: this.form.tokens.toString(),
        is_compound: this.form.compound === "1" ? true : false
      };
      const res = account.sendCreateDelegateTx(this.validator.address, data);
      // 得到返回值处理
      res
        .then(result => {
          if (result.status === 200) {
            this.$router.push({
              name: "txresult",
              params: { hash: result.data.hash }
            });
          } else {
            this.error = result.statusText;
            this.dialogVisible = true;
          }
        })
        .catch(error => {
          this.error = error;
          this.dialogVisible = true;
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
}
div {
  text-align: left;
  overflow: hidden;
  overflow-y: auto;
  margin: 2% 0 3% 0;
  vertical-align: middle;
}
span {
  word-break: break-all;
  word-wrap: break-word;
  font-size: 14px;
}
</style>
<style lang="scss">
.qos-dialog {
  .el-dialog__body {
    padding: 0 30px !important;
  }
}
