<template>
  <div class="newaccount-wrap">
    <el-page-header @back="goBack" content="新建账户"></el-page-header>
    <el-divider></el-divider>
    <div>
      <span>账户名称:</span>
    </div>
    <div>
      <el-input type="input" v-model="form.name" clearable style="width:80%;"></el-input>
      <el-input
            type="text"
            name="accountName"
            v-model="accountName"
            placeholder="Name for new Account"
            v-validate="isValidateAccountName"
            ref="accountName"
            @blur="onBlur"
          >
    </div>
    <div>
      <el-button type="primary" plain @click="onCreateAccount">新建</el-button>
    </div>
  </div>
</template>

<script>
import {getAccountList} from '../../../business/auth';
import Account from 'qosWeb/build/main/core/Account';
import { isNotEmpty } from 'qosWeb/build/main/core/utils';
import { Validator } from 'vee-validate';
const isValidateAccountName = (value) => {
  if (!value || value === '') {
    return false;
  }
};

Validator.extend('isValidateAccountName', {
  getMessage: (field) => `请输入新建账户名称`,
  validate: (value) => isValidateAccountName(value)
});

export default {
  data() {
    return {
      form: {
        name: "新账户名"
      }
    };
  },
  computed: {},
  mounted() {},
  methods: {
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push("/homepage");
    },
    onCreateAccount() {
      if (!isNotEmpty(accountName)) {
        console.log('account name empty');
        return
      }
      const accountList = getAccountList();
      console.log(accountList);
      if (accountList && len(accountList) > 0) { 
        accountList.forEach(acc => {
          if (Account(acc).name ===accountName){
            console.log('dup account name');
            return 
          }
          console.log(acc)
        }); 
      }
      console.log("新建账户...");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.newaccount-wrap {
  @include common-container;
  width: 308px;
  height: 500px;
  padding: 30px 20px;
  div {
    text-align: left;
    overflow: hidden;
    overflow-y: auto;
    margin-bottom: 2%;
    margin-top: 3%;
    vertical-align: middle;
  }
  span {
    word-break: break-all;
    word-wrap: break-word;
    font-size: 14px;
  }
}
</style>
