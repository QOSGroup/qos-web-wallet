<template>
  <div class="accountmodify-wrap">
    <div class="header-wrap">
      <el-page-header @back="goBack" content="账户名称修改"></el-page-header>
    </div>

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="账户名称" prop="name" class="form-row">
        <el-input v-model="form.name" :placeholder="this.$route.params.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">确定</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getBackground } from '../../../common/bgcontact'
import store from '@/store'
import * as types from '@/store/mutation-types'
import { getCurrentAccount } from '@/business/auth'
export default {
  data () {
    const index = store.getters.accounts.findIndex(
      x => x.address === store.getters.currentAccount.address
    )
    return {
      form: {
        name: '',
        password: store.getters.passCheck
      },
      currentAccount: store.getters.accounts[index]
    }
  },
  computed: {
  },
  methods: {
    async onSubmit (formName) {
      // 调用背景页函数
      const bg = getBackground()
      await bg.saveAccount({ privateKey: this.currentAccount.privateKey, pwd: this.form.password, name: this.form.name })
      // popup store中存储currentAccount, 数据来源与持久化存储的当前账户
      const currentAccount = await getCurrentAccount()
      store.commit(types.SET_CURRENT_ACCOUNT, currentAccount)
      // 创建账户成功,拷贝bg store中的accounts到popup store中
      const bgState = bg.getBgState()
      store.commit(types.CLONE_STATE, { keyArr: ['accounts', 'currentAccount'], bgState })
      // 账户新建后,默认跳转newwalletresult页面
      this.$router.push({
        name: 'homepage'
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
.accountmodify-wrap {
  @include common-container;
  .form-row{
    margin: 20px 10px
  }
}
</style>
