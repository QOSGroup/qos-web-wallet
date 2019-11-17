<template>
  <div class="accountlist-wrap">
    <div style="float:left">
      <el-page-header @back="goBack" content="账户列表"></el-page-header>
    </div>
    <div style="float:right">
      <el-button type="primary" icon="el-icon-switch-button" size="mini" @click="exit">注销</el-button>
    </div>
    <el-divider></el-divider>
    <div>
      <el-button type="primary" plain @click="addAccount" size="medium" style="width:46%;">
        <i class="el-icon-plus"></i>新建账户
      </el-button>
      <el-button type="success" plain @click="importAccount" size="medium" style="width:46%;">
        <i class="el-icon-download"></i>导入账户
      </el-button>
    </div>
    <div>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <div>
              <span>{{ userName }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>{{ address }}</span>
            </div>
            <div>
              <span
                v-for="coin in coins"
                :key="coin"
              >&nbsp;&nbsp;{{ coin.cointype }}: {{ coin.amount }}&nbsp;&nbsp;</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <div>
              <span>{{ userName }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>{{ address }}</span>
            </div>
            <div>
              <span
                v-for="coin in coins"
                :key="coin"
              >&nbsp;&nbsp;{{ coin.cointype }}: {{ coin.amount }}&nbsp;&nbsp;</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { setToken } from "@/business/auth";
export default {
  data() {
    return {
      userName: "账户名",
      address: "qosacc1g24jk70w086h88hs0akmum9azkh49pa0gjn7uc",
      coins: [
        {
          amount: 123,
          cointype: "QOS"
        },
        {
          amount: 456,
          cointype: "STAR"
        },
        {
          amount: 789,
          cointype: "ZZU"
        }
      ]
    };
  },
  computed: {},
  mounted() {},
  methods: {
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({name: homepage});
    },
    addAccount() {
      this.$router.push({name: "walletcreate"});
    },
    importAccount() {
      this.$router.push({name: "walletimport"});
    },
    exit() {
      setToken("");
      this.$router.push({name: "login"});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.accountlist-wrap {
  @include common-container;
  div {
    text-align: left;
    overflow: hidden;
    overflow-y: auto;
    margin: 3% 0 2% 0;
    vertical-align: middle;
  }
  span {
    word-break: break-all;
    word-wrap: break-word;
    font-size: 14px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 80px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
}
</style>
