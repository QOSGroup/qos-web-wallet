<template>
  <div class="transfer-wrap">
    <div>这是转账页面: {{inputParams}}</div>
    <div>
      <button @click="onProcess">processMsg</button>
    </div>

    <el-page-header @back="goBack" content="转账"></el-page-header>
    <el-divider></el-divider>
    <div>
      <span>
        资产类型：
        <el-select v-model="value" placeholder="请选择" size="mini" @change="setCoinBalance">
          <el-option
            v-for="coin in cointypes"
            :key="coin.value"
            :label="coin.label"
            :value="coin.value"
          ></el-option>
        </el-select>
      </span>
    </div>
    <div>
      <span>资产余额：{{ balance }}</span>
    </div>
    <div></div>
    <div>
      <span>接收方地址：</span>
    </div>
    <div>
      <el-input type="input" v-model="form.address" clearable size="small"></el-input>
    </div>
    <div>
      <span>转账数量：</span>
    </div>
    <div>
      <el-input type="input" v-model="form.tokens" clearable size="mini" style="width:75%;"></el-input>
      <el-button size="mini" style="float:right;height:38px;" @click="setMax">最大值</el-button>
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
// import QOSRpc from 'js-for-qos-httprpc'
import { processMsg } from "../../common/bgcontact";

export default {
  data() {
    return {
      // 根据用户地址链上查询的数据
      cointypes: [
        {
          value: "QOS",
          label: "QOS",
          balance: 10000
        },
        {
          value: "STAR",
          label: "STAR",
          balance: 20000
        },
        {
          value: "ZZU",
          label: "ZZU",
          balance: 30000
        }
      ],
      value: "",
      balance: 0,
      form: {
        address: "gyukjcuejbdjsiuwenjxudksuhudrtdeduycxunjusfdsfdkjbcuw",
        tokens: 100,
        gas: 10
      }
    };
  },
  computed: {
    inputParams() {
      return JSON.stringify(this.$store.getters.firstMsg);
    }
  },
  mounted() {
    this.getAccount();
  },
  methods: {
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push("/homepage");
    },
    commitTx() {
      this.$router.push("/txresult");
    },
    setCoinBalance() {
      const choose = this.$data.value;
      const cointypes = this.$data.cointypes;
      for (let index = 0; index < cointypes.length; index++) {
        if (choose == cointypes[index].value) {
          this.$data.balance = cointypes[index].balance;
        }
      }
    },
    setMax(){
      this.$data.form.tokens=this.$data.balance
    },
    onProcess() {
      processMsg();
    },
    getAccount() {
      // Promise((resolve, reject) => {
      //   const rpc = new QOSRpc({ baseUrl: 'http://192.168.1.37:9876' })
      //   try {
      //     const account = rpc.newAccount(
      //       'fury flavor subway start spare hospital tag chief word start pencil borrow town mandate detect pencil cook bridge right scout remain this differ leader'
      //     )
      //     console.log(account)
      //     resolve()
      //   } catch (error) {
      //     console.log(error)
      //   }
      // })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.transfer-wrap {
  @include common-container;
  width: 308px;
  height: 500px;
  padding: 30px 20px;
  div {
    text-align: left;
    overflow: hidden;
    overflow-y: auto;
    margin: 2% 0 2% 0;
    vertical-align: middle;
  }
  span {
    word-break: break-all;
    word-wrap: break-word;
    font-size: 14px;
  }
}
</style>
