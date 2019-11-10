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

export default {
  data() {
    return {
      activeName:
        this.$route.params.activeName == null
          ? "balance"
          : this.$route.params.activeName,
      userName: "wangkuan",
      address: "qosacc1e5tahz33c576cwqm3t22er22mtrj7a8jhxqzfe",
      qos: "",
      qcps: [],
      delegations: []
    };
  },
  created() {
    this.getAccount(this.$data.address);
    this.getDelegations();
  },
  methods: {
    getAccount(address) {
      axios
        .get(
          "http://www.baidu.com/"+address
        )
        .then(res => {
          // this.$data.qos = res.data.value.qos;
          this.$data.qos = "999999";

          this.$data.qcps.push({
            coin_name: "ZZU",
            amount: "10000000000"
          });
          this.$data.qcps.push({
            coin_name: "STAR",
            amount: "10000000000"
          });

        })
        .catch(error => {
          alert(error);
        });
    },
    getDelegations() {
      axios
        .get("http://www.baidu.com")
        .then(res => {
          // 获取到委托信息后进行循环:拆分出其中字段:validator_address,delegate_amount,is_compound
          // 每次循环中,根据validator_address查询出该validator的详细信息,拆分字段:description.moniker  description.logo
          for (var i = 0; i < 2; i++) {
            
            // get
            this.delegations.push({
              logo:
                "http://img2.imgtn.bdimg.com/it/u=3293334768,2684434782&fm=26&gp=0.jpg",
              moniker: "Compass1",
              validator_address:
                "qosval1zvcvwekjamvak4xefnucv6nkrf4age6n7wj7pc",
              delegate_amount: "4567.76",
              is_compound: true
            });

            this.delegations.push({
              logo:
                "http://img2.imgtn.bdimg.com/it/u=3293334768,2684434782&fm=26&gp=0.jpg",
              moniker: "Compass2",
              validator_address:
                "qosval1zvcvwekjamvak4xefnucv6nkrf4age6n7wj7pc",
              delegate_amount: "8765456.87",
              is_compound: false
            });
          }
        })
        .catch(error => {
          alert(error);
        });
    },
    getValidator(validator_address) {
      return null
    },
    handleClick(tab, event) {
      console.log(tag, event);
    },
    showAccountList() {
      //console.log("showAccountList!");
      this.$router.push({name: "accountlist"});
    },
    transfer(coin_name) {
      if (!coin_name) {
        coin_name = "QOS";
      }
      this.$router.push({name: "transfer"});
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
  width: 308px;
  height: 500px;
  padding: 30px 20px;
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
