<template>
  <div class="accountlist-wrap">
    <div class="header-wrap">
      <el-page-header @back="goBack" content="账户列表"></el-page-header>
      <div>
        <el-button
          class="logout"
          type="primary"
          icon="el-icon-switch-button"
          size="mini"
          @click="exit"
        >注销</el-button>
      </div>
    </div>
    <div class="btns-wrap">
      <el-button type="primary" plain @click="addAccount" size="mini" class="btn-list">
        <i class="el-icon-plus"></i>新建账户
      </el-button>
      <el-button type="success" plain @click="importAccount" size="mini" class="btn-list">
        <i class="el-icon-download"></i>导入账户
      </el-button>
      <el-button type="warning" plain @click="exportAccount" size="mini" class="btn-list">
        <i class="el-icon-upload2"></i>导出私钥
      </el-button>
    </div>
    <div v-for="(account, index) in accounts" :key="index">
      <el-row class="row-wrap">
        <el-col :span="24">
          <div
            class="row-content"
            :class="currentAccount.address === account.address ? 'grid-content bg-purple-dark' : 'grid-content bg-purple-light'"
            @click="changeAccount(account.address)"
          >
            <div class="top-wrap">
              <span>{{ account.name }}&nbsp;&nbsp;</span>
            </div>
            <div class="span-point">{{ account.address }}</div>
            <div>
              <div class="cont-wrap">
                <span
                  v-for="(coin, index) in account.coins"
                  :key="index"
                >{{ coin.cointype }}: {{ coin.amount }}&nbsp;&nbsp;</span>
              </div>
              <div class="current" v-if="currentAccount.address === account.address">当前账户</div>
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
import { setCurrentAccount, getAccountList } from '@/business/auth'
import { rpc } from '@/utils/rpc'
import { numFor4Decimal } from '@/utils/index'

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
      this.$router.push({ name: 'walletcreate2' })
    },
    importAccount () {
      this.$router.push({ name: 'walletimport2' })
    },
    exportAccount () {
      this.$router.push({ name: 'accountexport' })
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
      // 移除popup和bg store中的当前账户信息
      bg.accountCurrentDelete()
      store.commit(types.SET_CURRENT_ACCOUNT)
      // 跳转登录
      this.$router.push({ name: 'login' })
    },
    async getAccountList (accountList) {
      const localAccountList = await getAccountList()
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
                amount: numFor4Decimal(result.data.value.qos)
              })
              qcps = result.data.value.qcps
              if (qcps) {
                for (let qcp of qcps) {
                  list.push({
                    cointype: qcp.coin_name,
                    amount: numFor4Decimal(qcp.amount)
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
            console.log(error)
            localAcc = localAccountList.find(x => x.address === acc.address)
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
      // 切换账户,首先获取到本地存储的账户列表
      const accountList = await getAccountList()
      // 要切换的账户在其中,返回account对象
      const changeAcc = accountList.find(x => x.address === address)

      // 本地local storage中设置账户
      await setCurrentAccount(changeAcc)
      // bg store和popup store中的currentAccount.
      store.commit(types.SET_CURRENT_ACCOUNT, changeAcc)
      const bg = getBackground()
      await bg.setCurrentAccount(changeAcc)

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
    background: #69c976;
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
  .span-point {
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    font-size: 14px;
  }
  .btns-wrap {
    margin: 15px 10px;
    text-align: center;
  }
  .row-wrap {
    margin: 0 15px 15px !important;
    .row-content {
      padding: 10px;
    }
    .top-wrap {
      display: flex;
      align-items: center;
      line-height: 30px;
    }
    .current{
      text-align: right;
      color: #ffffff;
    }
    .cont-wrap {
      line-height: 28px;
    }
  }
  .btn-list{
    width: 30%;
  }
}
</style>
<style lang="scss">
.qos-dialog {
  .el-dialog__body {
    padding: 0 30px !important;
  }
}
</style>
