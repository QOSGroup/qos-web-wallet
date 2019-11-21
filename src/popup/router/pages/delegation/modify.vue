<template>
  <div class="modify-wrap">
    <el-page-header @back="goBack" content="变更委托方式"></el-page-header>
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
          <!-- <div><el-button type="primary" size="mini" plain @click="selectValidator()">选择委托对象</el-button></div> -->
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
      <span>当前委托：{{ delegation.delegate_amount }} QOS</span>
    </div>
    <div v-if="this.$route.params.is_compound == 'true'">
      <div class="div_modify">复投</div>
      <div class="div_modify">
        <i class="el-icon-right"></i>
      </div>
      <div class="div_modify">不复投</div>
    </div>
    <div v-else>
      <div class="div_modify">不复投</div>
      <div class="div_modify">
        <i class="el-icon-right"></i>
      </div>
      <div class="div_modify">复投</div>
    </div>

    <!-- <div>
      <span>最大手续费：{{ form.gas }}</span>
    </div>
    <div class="block">
      <el-slider v-model="form.gas" max="100"></el-slider>
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
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
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
      //用户信息
      amount: this.$route.params.amount,
      //用户所选的validator信息
      validator: {
        logo: this.$route.params.delegation.logo,
        moniker: this.$route.params.delegation.moniker,
        address: this.$route.params.delegation.validator_address,
        validatorUrl: "http://www.baidu.com"
      },
      //用户在当前validator的委托信息
      delegation: {
        delegator_address: this.$route.params.delegation.validator_address,
        delegate_amount: this.$route.params.delegation.delegate_amount,
        is_compound: this.$route.params.delegation.is_compound
      },
      form: {
        gas: 0 //支付的gas费用
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
        is_compound: !(this.$route.params.is_compound == 'true'),
        base: myBase
      };
      const res = account.sendModifyDelegationTx(this.validator.address, data);
      // 得到返回值处理
      res
        .then(result => {
          if (result.status === 200) {
            this.$router.push({
              name: "txresult",
              params: { hash: result.data.hash }
            });
          } else {
            console.log(result);
            this.error = result;
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
  computed: {}
};
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.modify-wrap {
  @include common-container;
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
<style lang="scss">
.qos-dialog {
  .el-dialog__body {
    padding: 0 30px !important;
  }
}
