<template>
  <div class="newwallet-wrap">
    <div class="header-wrap">
      <el-page-header @back="goBack" content="创建钱包"></el-page-header>
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="账户名称" prop="name" class="form-row">
        <el-input placeholder="请输入名称" v-model="form.name" ></el-input>
      </el-form-item>
      <el-form-item class="btn-create">
        <el-button type="primary" :loading="isBtnLoading" @click="conifrm">立即创建</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { rpc } from '@/utils/rpc'
import { getBackground } from '../../../common/bgcontact'
import store from '@/store'
import * as types from '@/store/mutation-types'
import { getCurrentAccount } from '@/business/auth'
import { sleeping } from '@/utils'
export default {
  data () {
    return {
      form: {
        name: '',
        password: store.getters.passCheck
      },
      isBtnLoading: false
    }
  },
  methods: {
    async conifrm () {
      this.isBtnLoading = true
      await sleeping(500)
      const mn = await this.commit()
      // 账户新建后,默认跳转newwalletresult页面
      this.$router.push({
        name: 'walletresult',
        params: { mnemonic: mn }
      })
    },
    async commit () {
      return new Promise(async (resolve) => {
      // 设置按钮loading
        this.isBtnLoading = true
        // 随机创建助记词
        const mn = rpc.generateMnemonic()
        // // 调用背景页函数
        const bg = getBackground()
        await bg.saveAccount({ mnemonic: mn, pwd: this.form.password, name: this.form.name })
        // popup store中存储currentAccount, 数据来源与持久化存储的当前账户
        const currentAccount = await getCurrentAccount()
        store.commit(types.SET_CURRENT_ACCOUNT, currentAccount)
        // 创建账户成功,拷贝bg store中的accounts到popup store中
        const bgState = bg.getBgState()
        store.commit(types.CLONE_STATE, { keyArr: ['accounts'], bgState })

        return resolve(mn)
      })
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ name: 'homepage' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.newwallet-wrap {
  @include common-container;
  .form-row{
        margin: 20px 10px;
  }
  .btn-create{
    margin-left: 10px;
  }
}
</style>
