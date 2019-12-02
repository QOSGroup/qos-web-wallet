<template>
  <div class="homepage-wrap">
    <div class="home-top-info">
      <div>
        <br />
        <div style="float:left;width:90%;text-align:left;" @click="accNameModify" class="link-wrap">
          <span style="font-size:24px;">{{ userName }}</span>
        </div>
        <div style="float:right;width:10%;" @click="showAccountList">
          <i class="el-icon-more" style="font-size:24px;" title="更多"></i>
        </div>
      </div>
      <div>
        <div style="width:88%;float:left;font-size:medium;text-align:left">
          <span>{{ address }}</span>
        </div>
        <div>
          <i class="el-icon-document-copy btn" :data-clipboard-text="address" title="复制"></i>
        </div>
      </div>
    </div>
    <div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" stretch>
        <el-tab-pane label="我的资产" name="balance">
          <div>
            <div class="text-wrap">
              <div class="text-title">QOS</div>
              <div class="link-wrap">
                <span class="number-style">{{ qos }}</span>
                <i class="el-icon-link"></i>
              </div>
              <div class="btn-wrap">
                <el-button type="primary" size="small" plain @click="transfer('QOS')">转账</el-button>
                <el-button type="primary" size="small" plain @click="approve('QOS')">预授权</el-button>
              </div>
              <el-divider width="80%"></el-divider>
            </div>
          </div>

          <div v-for="qcp in qcps" :key="qcp">
            <div class="text-wrap">
              <div class="text-title">{{ qcp.coin_name }}</div>
              <div class="link-wrap">
                <span class="number-style">{{ qcp.amount }}</span>
                <i class="el-icon-link"></i>
              </div>
              <div class="btn-wrap">
                <el-button type="primary" size="small" plain @click="transfer([qcp.coin_name])">转账</el-button>
                <el-button type="primary" size="small" plain @click="approve([qcp.coin_name])">预授权</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="我的委托" name="delegation">
          <div v-for="(delegation, index) in delegations" :key="index">
            <div class="div_contents">
              <div>
                <el-image class="logo-image" :src="delegation.logo"></el-image>
              </div>
              <div class="text-detail">
                <div class="div_contents">
                  <div class="text-moniker">{{ delegation.moniker }}</div>
                  <div class="link-wrap text-link">
                    <el-link :href="delegation.validatorUrl" target="_blank">
                      <i class="el-icon-link"></i>
                    </el-link>
                  </div>
                </div>
                <div style="text-align:left;">
                  <span>
                    <br />
                    {{ delegation.validator_address }}
                  </span>
                </div>
              </div>
            </div>

            <div class="text-row">
              <span>委托金额：{{ delegation.delegate_amount }}</span>
            </div>
            <div class="btn-operate">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="delegateorunbond('delegate', qos.toString(), delegation)"
              >追加</el-button>
              <el-button
                type="primary"
                size="mini"
                plain
                @click="delegateorunbond('unbond', qos.toString(), delegation)"
              >撤回</el-button>
            </div>

            <div class="text-row">
              <span>复投方式：{{ delegation.is_compound ? "已复投" : "未复投" }}</span>
            </div>
            <div class="btn-operate">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="modifyCompound([ delegation.is_compound ], qos.toString(), delegation)"
              >更改</el-button>
            </div>

            <el-divider class="line-divider"></el-divider>
          </div>

          <div class="text-wrap">
            <el-button icon="el-icon-plus" circle @click="createDelegation" title="新增委托"></el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的授权" name="approve" class="tab-info">暂不支持该功能！</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { rpc } from '@/utils/rpc'
import { mapState } from 'vuex'
import store from '@/store'
import { numFor4Decimal } from '@/utils/index'
import ClipboardJS from 'clipboard'

export default {
  data () {
    return {
      activeName:
        this.$route.params.activeName == null
          ? 'balance'
          : this.$route.params.activeName,
      currentAccount: store.getters.currentAccount,
      userName: store.getters.currentAccount.name,
      address: store.getters.currentAccount.address,
      qos: 0,
      qcps: [],
      delegations: []
    }
  },
  computed: {
    ...mapState({
      // currentAccount: store.getters.currentAccount
    })
  },
  created () {},
  mounted () {
    console.log('store.getters.currentAccount:', store.getters.currentAccount)
    // 打开页面默认加载我的资产导航栏
    this.getAccount(this.$data.address)
    this.getDelegations(this.$data.address)

    var clipboard = new ClipboardJS('.btn')

    clipboard.on('success', function (e) {
      console.info('Action:', e.action)
      console.info('Text:', e.text)
      console.info('Trigger:', e.trigger)

      e.clearSelection()
    })
  },
  methods: {
    getAccount (address) {
      const account = rpc.recoveryAccountByPrivateKey(
        this.currentAccount.privateKey
      )
      const res = account.queryAccount(address)
      res
        .then(result => {
          if (result.status === 200) {
            this.$data.qos = numFor4Decimal(result.data.value.qos)
            this.$data.qcps = result.data.value.qcps
          } else {
            this.$message({
              showClose: true,
              message: result.statusText,
              type: 'warning'
            })
          }
        })
        .catch(error => {
          console.log(error)
          // this.$message({
          //   showClose: true,
          //   message: '该账户在链上的‘账户信息’查询失败!',
          //   type: 'warning'
          // })
        })
    },
    getDelegations (address) {
      // 刷新委托信息
      this.delegations = []
      const account = rpc.recoveryAccountByPrivateKey(
        this.currentAccount.privateKey
      )
      const res = account.queryDelagationAll(address)
      res
        .then(async result => {
          if (result.status === 200) {
            for (var i = 0; i < result.data.length; i++) {
              await this.getValidator(result.data, i)
            }
          } else {
            this.$message({
              showClose: true,
              message: result.statusText,
              type: 'warning'
            })
          }
        })
        .catch(error => {
          console.log(error)
          // this.$message({
          //   showClose: true,
          //   message: '该账户在链上的‘委托信息’查询失败!',
          //   type: 'warning'
          // })
        })
    },
    getValidator (delegation, i) {
      const account = rpc.recoveryAccountByPrivateKey(
        this.currentAccount.privateKey
      )
      const res = account.queryValidatorOne(delegation[i].validator_address)
      res
        .then(result => {
          if (result.status === 200) {
            this.delegations.push({
              logo: result.data.description.logo,
              moniker: result.data.description.moniker,
              validator_address: delegation[i].validator_address,
              delegate_amount: numFor4Decimal(delegation[i].delegate_amount),
              is_compound: delegation[i].is_compound,
              validatorUrl: 'http://www.baidu.com'
            })
          } else {
            this.$message({
              showClose: true,
              message: result.statusText,
              type: 'warning'
            })
          }
        })
        .catch(error => {
          console.log(error)
          // this.$message({
          //   showClose: true,
          //   message: error,
          //   type: 'warning'
          // })
        })
    },
    handleClick (tab, event) {
      // console.log(tab, event);
      if (tab.name === 'delegation') {
        this.getDelegations(this.$data.address)
      } else if (tab.name === 'balance') {
        this.getAccount(this.$data.address)
      } else {
        console.log('other tab !')
      }
    },
    showAccountList () {
      // console.log("showAccountList!");
      this.$router.push({ name: 'accountlist' })
    },
    transfer (coinName) {
      if (!coinName) {
        coinName = 'QOS'
      }
      this.$router.push({ name: 'transfer', params: { coin: coinName } })
    },
    approve (coinType) {
      if (!coinType) {
        coinType = 'QOS'
      }
      this.$message({
        showClose: true,
        message: '暂不支持该功能!',
        type: 'warning'
      })
    },
    createDelegation (qos) {
      this.$router.push({
        name: 'validatorlist'
      })
    },
    delegateorunbond (operation, qos, delegation) {
      this.$router.push({
        name: 'delegateorunbond',
        params: { amount: qos, operation: operation, delegation: delegation }
      })
    },
    modifyCompound (isCompound, qos, delegation) {
      this.$router.push({
        name: 'modifycompound',
        params: {
          amount: qos,
          is_compound: isCompound,
          delegation: delegation
        }
      })
    },
    accNameModify () {
      this.$router.push({
        name: 'accountmodify',
        params: {
          name: this.userName
        }
      })
    },
    copy () {
      var Url2 = document.getElementById('test')
      Url2.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.homepage-wrap {
  @include common-container;
  box-sizing: border-box;
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
.el-icon-document-copy {
  font-size: 22px;
  margin-top: 6px;
  cursor: pointer;
}
.el-icon-more {
  cursor: pointer;
}
.home-top-info {
  background: rgba(50, 115, 200, 1);
  height: 125px;
  color: #ffffff;
  // border-radius: 6px;
  padding: 0 8px;
}
.text-wrap {
  line-height: 1.5;
  text-align: center;
}
.text-title {
  font-size: 24px;
  font-weight: 300;
}
.btn-wrap {
  margin-top: 10px;
}
.link-wrap {
  cursor: pointer;
}
.number-style {
  font-size: 30px;
}
.logo-image {
  height: 100px;
  width: 100px;
}
.text-detail {
  width: 180px;
}
.div_contents {
  display: flex;
  margin: 10px 5px;
}
.text-row {
  float: left;
  margin: 10px 10px;
  width: 150px;
}
.btn-operate {
  float: right;
  margin: 0px 5px;
  height: 30px;
}
.line-divider {
  margin-top: 80px;
}
.tab-info{
  text-align: center;
}
</style>
