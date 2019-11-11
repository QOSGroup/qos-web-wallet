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
            v-for="coin in coins"
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
import { processMsg, broadcastTX} from "../../../common/bgcontact";
import axios from "axios";

export default {
  data() {
    return {
      // 根据用户地址链上查询的数据
      coins: [
        {
          value: "QOS",
          label: "QOS",
          balance: 10000
        }
      ],
      value: "",
      balance: 0,
      form: {
        address: "qosacc163sy2vhsjjzwy7xfm5zkdchpvzpcqc68wf8fpy",
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
        ? this.$router.push({
            name: "homepage",
            params: { activeName: "balance" }
          })
        : this.$router.push({ name: "homepage" });
    },
    async commitTx() {
      //alert(this.form.address + "==" + this.form.tokens + "==" + this.form.gas);
      var flag = false;
      //点击完成确认按钮后,首先调用转账接口,得到后台返回的json字符串
      await axios
        .post(
          "http://47.98.253.9:9876/bank/accounts/" +
            this.form.address +
            "/transfers",
          {
            base: {
              from: "qosacc1x6d58mx3hssq6ksaftfwvdskaz35pumrd4hywk",
              chain_id: "qos-test",
              max_gas: this.form.gas.toString()
            },
            qos: this.form.tokens.toString(),
            qscs: null
          }
        )
        .then(function(res) {
          //console.log(res); //处理成功的函数 相当于success
          //得到返回的json字符串后,使用本地的私钥进行签名,而后将签名后的字符串调用广播上链接口,等待交易上线.
          alert("交易组装成功已经返回.等待本地私钥签名后,进行上链操作.");
          // todo 调用交易广播接口,进行上链操作
          flag = true;
        })
        .catch(function(error) {
          console.log(error); //错误处理 相当于error
        });

      if (flag) {
        this.$router.push({ name: "txresult" });
      } else {
        alert("转账失败! ");
      }
    },
    setCoinBalance() {
      const choose = this.$data.value;
      const coins = this.$data.coins;
      for (let index = 0; index < coins.length; index++) {
        if (choose == coins[index].value) {
          this.$data.balance = coins[index].balance;
        }
      }
    },
    setMax() {
      this.$data.form.tokens = this.$data.balance;
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
