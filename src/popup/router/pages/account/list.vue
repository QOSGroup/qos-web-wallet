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
    <div v-for="(account, index) in accounts" :key="index">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark" @click="changeAccount(account.address)">
            <div>
              <span>{{ account.name }}&nbsp;&nbsp;</span>
              <el-divider direction="vertical"></el-divider>
              <span>&nbsp;&nbsp;{{ account.address }}</span>
            </div>
            <div>
              <div style="float:left;">
                <span
                  v-for="(coin, index) in account.coins"
                  :key="index"
                >&nbsp;&nbsp;{{ coin.cointype }}: {{ coin.amount }}&nbsp;&nbsp;</span>
              </div>
              <div
                style="float:right;color:blue;"
                v-if="currentAccount.address === account.address"
              >当前账户</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      custom-class="qos-dialog"
    >
      <span>{{ error }}</span>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import * as types from '@/store/mutation-types'
import { getBackground } from '../../../common/bgcontact'
import clone from 'clone'
import {
  setCurrentAccount,
  getAccountList
} from '@/business/auth'
import { rpc } from '@/utils/rpc'

export default {
  data () {
    const index = store.getters.accounts.findIndex(
      x => x.address === store.getters.currentAccount.address
    )
    return {
      accounts: [],
      currentAccount: store.getters.accounts[index],
      // 设置弹出
      error: '',
      dialogVisible: false
    }
  },
  computed: {
    hasLogin: function () {
      return {}
    }
  },
  mounted () {},
  created () {
    this.getAccountList(store.getters.accounts)
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ name: 'homepage' })
    },
    addAccount () {
      this.$router.push({ name: 'walletcreate' })
    },
    importAccount () {
      this.$router.push({ name: 'walletimport' })
    },
    exit () {
      const bg = getBackground()
      const accountlist = clone(store.getters.accounts)
      for (var i = 0; i < accountlist.length; i++) {
        // 移除background  store中的账户
        bg.accountDelete(accountlist[i])
        // 移除popup store 中账户
        store.commit(types.DELETE_ACCOUNT, accountlist[i])
      }
      this.$router.push({ name: 'login' })
    },
    async getAccountList (accountList) {
      const localAccountList = await getAccountList()
      console.log(localAccountList)
      // 刷新页面,将页面账户列表置空
      this.accounts = []
      let account, res, qcps, localAcc, name
      for (let acc of accountList) {
        account = rpc.recoveryAccountByPrivateKey(acc.privateKey)
        res = account.queryAccount(acc.address)
        res
          .then(result => {
            if (result.status === 200) {
              let address = result.data.value.account_address
              localAcc = localAccountList.find(x => x.address === address)
              name = localAcc.name

              let list = []
              list.push({
                cointype: 'QOS',
                amount: result.data.value.qos
              })
              qcps = result.data.value.qcps
              if (qcps) {
                for (let qcp of qcps) {
                  list.push({
                    cointype: qcp.coin_name,
                    amount: qcp.amount
                  })
                }
              }
              this.accounts.push({ name: name, address: address, coins: list })
            } else {
              // alert(result.statusText);
              this.error = result.statusText
              this.dialogVisible = true
            }
          })
          .catch(error => {
            console.log(error.message)
            localAcc = localAccountList.find(x => x.address === acc.address)
            console.log('acc==', acc)
            console.log('localAcc==', localAcc)
            name = localAcc.name
            this.accounts.push({
              name: name,
              address: acc.address,
              coins: [{ cointype: 'QOS', amount: 0 }]
            })
            // this.$message({
            //   showClose: true,
            //   message:
            //     '链上‘账户信息’查询失败!账户地址后4位:' +
            //     acc.address.substr(
            //       acc.address.length - 4,
            //       acc.address.length - 1
            //     ),
            //   type: 'warning'
            // })
          })
      }
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    async changeAccount (address) {
      // 切换账户,首先获取到popup-store-accounts
      const accountList = store.getters.accounts
      // 要切换的账户在其中,返回整个account对象
      const changeAcc = accountList.find(x => x.address === address)
      // 调用设置当前账户
      await setCurrentAccount(changeAcc)
      // 调用popup的store 存储当前账户

      // 切换完成跳转主页
      this.$router.push({ name: 'homepage' })
    }
  }
}
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
<style lang="scss">
.qos-dialog {
  .el-dialog__body {
    padding: 0 30px !important;
  }
}
