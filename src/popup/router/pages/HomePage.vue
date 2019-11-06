<template>
  <div class="homepage-wrap">
    <div style="background:#409EFF;height:25%;">
      <div>
        <br />
        <div style="float:left;width:90%;text-align:left;">
          <span style="font-size:24px;">{{ userName }}</span>
        </div>
        <div style="float:right;width:10%;" @click="showAccountList" >
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
          <div v-for="coin in coins" :key="coin">
            <div>
              <div>{{ coin.type }}</div>
              <div>
                {{ coin.amount }}
                <i class="el-icon-link"></i>
              </div>
              <div>
                <el-button type="primary" size="small" plain @click="transfer([coin.type])">转账</el-button>
                <el-button type="primary" size="small" plain @click="approve([coin.type])">预授权</el-button>
              </div>
              <el-divider width="80%"></el-divider>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的委托" name="delegation">
          <div v-for="delegation in delegations" :key="delegation">
            <div>
              <div style="float:left;width:100px;">
                <el-image style="width: 100px; height: 100px" :src="delegation.url"></el-image>
              </div>
              <div style="float:right;width:200px;">
                <div style="text-align:left;">
                  <span>
                    <br />
                    {{ delegation.name }}
                  </span>
                  <i class="el-icon-link"></i>
                </div>
                <div style="text-align:left;">
                  <span>
                    <br />
                    {{ delegation.valaddress }}
                  </span>
                  <i class="el-icon-link"></i>
                </div>
              </div>
            </div>
            <div>
              <div style="text-align:left;float:left;">
                <span>委托金额：{{ delegation.amount }}</span>
              </div>
              <div style="float:right;">
                <el-button type="primary" size="mini" plain @click="delegateorunbond('delegate')">追加</el-button>
                <el-button type="primary" size="mini" plain @click="delegateorunbond('unbond')">撤回</el-button>
              </div>
            </div>
            <div>
              <div style="vertical-align:middle;text-align:left;float:left;">
                <span>复投方式：{{ delegation.isCompound ? "已复投" : "未复投" }}</span>
              </div>
              <div style="float:right;">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="modifyCompound([ delegation.isCompound ])"
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
export default {
  data() {
    return {
      stu: {
        name: 'test'
      },
      activeName: this.$route.params.activeName == null ? "balance" : this.$route.params.activeName,
      userName: "wangkuan",
      address: "qosacc1g24jk70w086h88hs0akmum9azkh49pa0gjn7uc",

      coins: [
        {
          type: "QOS",
          amount: "23456.765"
        },
        {
          type: "STAR",
          amount: "23456.765"
        },
        {
          type: "ZZU",
          amount: "23456.765"
        }
      ],

      delegations: [
        {
          url:
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          name: "Compass1",
          valaddress: "qosval1zvcvwekjamvak4xefnucv6nkrf4age6n7wj7pc",
          amount: "4567.76",
          isCompound: true
        },
        {
          url:
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          name: "Compass2",
          valaddress: "qosval1zvcvwekjamvak4xefnucv6nkrf4age6n7wj7pc",
          amount: "8765456.87",
          isCompound: false
        },
        {
          url:
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          name: "Compass3",
          valaddress: "qosval1zvcvwekjamvak4xefnucv6nkrf4age6n7wj7pc",
          amount: "654345.87",
          isCompound: true
        }
      ]
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tag, event);
    },
    showAccountList() {
      //console.log("showAccountList!");
      this.$router.push("/accountlist");
    },
    transfer(coinType) {
      if (!coinType) {
        coinType = "QOS";
      }
      this.$router.push("/transfer?coinTYpe=" + coinType);
    },
    approve(coinType) {
      if (!coinType) {
        coinType = "QOS";
      }
      alert("该功能暂未开发!");
    },
    delegateorunbond(operation) {
      this.$router.push({name:'delegateorunbond', params:{operation:operation}});
    },
    modifyCompound(isCompound) {
      this.$router.push({name:'modifycompound', params:{isCompound:isCompound}});
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
