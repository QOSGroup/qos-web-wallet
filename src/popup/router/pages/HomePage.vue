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
        <span style="font-size:18px;">{{ address }}</span>
        <i class="el-icon-document-copy" style="font-size:18px;"></i>
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
import QOSRpc from "qosWeb/build/main/core/QOSRpc";
import SecretKey from "qosWeb/build/main/core/SecretKey"

export default {
  data() {
    return {
      activeName:
        this.$route.params.activeName == null
          ? "balance"
          : this.$route.params.activeName,
      userName: "wangkuan",
      address: "qosacc1x6d58mx3hssq6ksaftfwvdskaz35pumrd4hywk",
      qos: "",
      qcps: [],
      delegations: []
    };
  },
  created() {
    //打开页面默认加载我的资产导航栏
    this.getAccount(this.$data.address);
    this.getDelegations(this.$data.address);
  },
  methods: {
    getAccount(address) {
      //  todo 调用js-for-qos-httprpc的方法,根据用户地址获取用户信息
      const rpc = new QOSRpc({ baseUrl: "http://47.100.168.251:9876" });
      const skey = new SecretKey();
      const Mn = skey.generateMnemonic()
      alert("rpc.config.baseUrl=="+rpc.config.baseUrl+"\nMn=="+Mn);
      
      axios
        .get("http://47.98.253.9:9876/accounts/" + address)
        .then(res => {
          this.$data.qos = res.data.value.qos;
          this.$data.qcps = [];
          //联盟链和联盟币为假数据,因为现在不支持
          // this.$data.qcps.push({
          //   coin_name: "ZZU",
          //   amount: "10000000000"
          // });
          // this.$data.qcps.push({
          //   coin_name: "STAR",
          //   amount: "10000000000"
          // });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDelegations(address) {
      axios
        .get(
          "http://47.98.253.9:9876/stake/delegators/" + address + "/delegations"
        )
        .then(res => {
          // 获取到委托信息后进行循环:拆分出其中字段:validator_address,delegate_amount,is_compound
          // 每次循环中,根据validator_address查询出该validator的详细信息,拆分字段:description.moniker  description.logo
          this.delegations = [];
          for (var i = 0; i <= res.data.length; i++) {
            this.getValidator(res.data, i);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getValidator(delegation, i) {
      axios
        .get(
          "http://47.98.253.9:9876/stake/validators/" +
            delegation[i].validator_address
        )
        .then(res => {
          this.delegations.push({
            logo: res.data.description.logo,
            moniker: res.data.description.moniker,
            validator_address: delegation[i].validator_address,
            delegate_amount: delegation[i].delegate_amount,
            is_compound: delegation[i].is_compound
          });
        })
        .catch(error => {
          console.log(error);
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
      alert("该功能暂未开发!");
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
  margin-bottom: 2%;
  margin-top: 1%;
  vertical-align: middle;
}
span {
  word-break: break-all;
  word-wrap: break-word;
}
</style>
