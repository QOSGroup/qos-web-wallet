<template>
  <div class="homepage-wrap">
    <div style="background:#409EFF;height:25%;">
      <div>
        <br />
        <div style="float:left;width:90%;text-align:left;">
          <span style="font-size:24px;">{{ userName }}</span>
        </div>
        <div style="float:right;width:10%;" @click="showAccountList">
          <i class="el-icon-more" style="font-size:24px;"></i>
        </div>
      </div>
      <div>
        <span class="span_account">{{ address }}</span>
        <i class="el-icon-document-copy" style="font-size:18px;float:right;"></i>
      </div>
    </div>
    <el-divider></el-divider>
    <div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="我的资产" name="balance">
          <div>
            <div>
              <div>QOS</div>
              <div>
                {{ qos }}
                <i class="el-icon-link"></i>
              </div>
              <div>
                <el-button type="primary" size="small" plain @click="transfer('QOS')">转账</el-button>
                <el-button type="primary" size="small" plain @click="approve('QOS')">预授权</el-button>
              </div>
              <el-divider width="80%"></el-divider>
            </div>
          </div>

          <div v-for="qcp in qcps" :key="qcp">
            <div>
              <div>{{ qcp.coin_name }}</div>
              <div>
                {{ qcp.amount }}
                <i class="el-icon-link"></i>
              </div>
              <div>
                <el-button type="primary" size="small" plain @click="transfer([qcp.coin_name])">转账</el-button>
                <el-button type="primary" size="small" plain @click="approve([qcp.coin_name])">预授权</el-button>
              </div>
              <el-divider width="80%"></el-divider>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的委托" name="delegation">
          <div v-for="delegation in delegations" :key="delegation">
            <div>
              <div style="float:left;width:100px;">
                <el-image style="width: 100px; height: 100px" :src="delegation.logo"></el-image>
              </div>
              <div style="float:right;width:200px;">
                <div style="text-align:left;">
                  <span>
                    <br />
                    {{ delegation.moniker }}
                  </span>
                  <i class="el-icon-link"></i>
                </div>
                <div style="text-align:left;">
                  <span>
                    <br />
                    {{ delegation.validator_address }}
                  </span>
                  <i class="el-icon-link"></i>
                </div>
              </div>
            </div>
            <div>
              <div style="text-align:left;float:left;">
                <span>委托金额：{{ delegation.delegate_amount }}</span>
              </div>
              <div style="float:right;">
                <el-button type="primary" size="mini" plain @click="delegateorunbond('delegate')">追加</el-button>
                <el-button type="primary" size="mini" plain @click="delegateorunbond('unbond')">撤回</el-button>
              </div>
            </div>
            <div>
              <div style="vertical-align:middle;text-align:left;float:left;">
                <span>复投方式：{{ delegation.is_compound ? "已复投" : "未复投" }}</span>
              </div>
              <div style="float:right;">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="modifyCompound([ delegation.is_compound ])"
                >更改</el-button>
              </div>
            </div>
            <el-divider width="80%"></el-divider>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的预授权" name="approve">该功能暂未开发！</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import store from "@/store"
import QOSRpc from "js-for-qos-httprpc";

export default {
  data() {
    return {
      activeName:
        this.$route.params.activeName == null
          ? "balance"
          : this.$route.params.activeName,
      currentAccount: store.getters.accounts[0],
      userName: store.getters.accounts[0].address.substr(store.getters.accounts[0].address.length-4,store.getters.accounts[0].address.length-1),
      address: store.getters.accounts[0].address,
      qos: 0,
      qcps: [],
      delegations: [],
      rpc: new QOSRpc({ baseUrl: "http://47.98.253.9:9876" })
    };
  },
  created() {
    //打开页面默认加载我的资产导航栏
    this.getAccount(this.$data.address);
    this.getDelegations(this.$data.address);
  },
  methods: {
    getAccount(address) {
      const account = this.rpc.recoveryAccountByPrivateKey(this.currentAccount.privateKey)
      const res = account.queryAccount(address);
      res.then(result => {
        if (result.status === 200) {
          this.$data.qos = result.data.value.qos;
          this.$data.qcps = result.data.value.qcps;
        } else {
          // alert(result.statusText);
        }
      });
    },
    getDelegations(address) {
      //刷新委托信息
      this.delegations = [];
      const account = this.rpc.recoveryAccountByPrivateKey(this.currentAccount.privateKey)
      const res = account.queryDelagationAll(address);
      res.then(result => {
        if (result.status == 200) {
          for (var i = 0; i <= result.data.length; i++) {
            this.getValidator(result.data, i);
          }
        } else {
          // alert(result.statusText);
        }
      });
    },
    getValidator(delegation, i) {
      const account = this.rpc.recoveryAccountByPrivateKey(this.currentAccount.privateKey)
      const res = account.queryValidatorOne(
        delegation[i].validator_address
      );
      res.then(result => {
        if (result.status == 200) {
          this.delegations.push({
            logo: result.data.description.logo,
            moniker: result.data.description.moniker,
            validator_address: delegation[i].validator_address,
            delegate_amount: delegation[i].delegate_amount,
            is_compound: delegation[i].is_compound
          });
        } else {
          alert(result.statusText);
        }
      });
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (tab.name == "delegation") {
        this.getDelegations(this.$data.address);
      } else if (tab.name == "balance") {
        this.getAccount(this.$data.address);
      } else {
        console.log("other tab !");
      }
    },
    showAccountList() {
      //console.log("showAccountList!");
      this.$router.push({ name: "accountlist" });
    },
    transfer(coin_name) {
      if (!coin_name) {
        coin_name = "QOS";
      }
      this.$router.push({ name: "transfer" });
    },
    approve(coinType) {
      if (!coinType) {
        coinType = "QOS";
      }
      //alert("该功能暂未开发!");
    },
    delegateorunbond(operation) {
      this.$router.push({
        name: "delegateorunbond",
        params: { operation: operation }
      });
    },
    modifyCompound(is_compound) {
      this.$router.push({
        name: "modifycompound",
        params: { is_compound: is_compound }
      });
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.homepage-wrap {
  @include common-container;
}
div {
  text-align: center;
  overflow: hidden;
  overflow-y: auto;
  margin-bottom: 3%;
  margin-top: 1%;
  vertical-align: middle;
}
span {
  word-break: break-all;
  word-wrap: break-word;
}
.span_account {
  font-size: 16px;
  width: 280px;
  display: block;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  white-space: nowrap;
  float: left;
}
</style>
