<template>
  <div class="importaccount-wrap">
    <div class="header-wrap">
      <el-page-header @back="goBack" content="导入账户"></el-page-header>
    </div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="导入类型" prop="type" class="form-row form-label">
        <el-select
          v-model="ruleForm.value"
          placeholder="请选择"
          autocomplete="off"
          size="mini"
          @change="setImportTypes"
        >
          <el-option
            v-for="its in ruleForm.importtypes"
            :key="its.value"
            :label="its.label"
            :value="its.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="输入私钥" prop="pri" v-if="flag_pri" class="form-row form-label">
        <el-input
          placeholder="请输入私钥"
          type="textarea"
          v-model="ruleForm.pri"
          auto-complete="off"
          :autosize="{ minRows: 2, maxRows: 8}"
        ></el-input>
      </el-form-item>
      <el-form-item label="输入助记词" prop="memwd" v-if="flag_zjc" class="form-row form-label">
        <el-input
          placeholder="请输入12个单词的助记词"
          type="textarea"
          v-model="ruleForm.memwd"
          auto-complete="off"
          :autosize="{ minRows: 2, maxRows: 8}"
        ></el-input>
      </el-form-item>

      <!-- <el-form-item label="新密码" prop="password">
        <el-input placeholder="请输入密码" v-model="ruleForm.password" show-password auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="repassword">
        <el-input
          placeholder="请再次输入密码"
          v-model="ruleForm.repassword"
          show-password
          auto-complete="off"
        ></el-input>
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">导入</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      custom-class="qos-dialog"
    >
      <span>导入类型有误,请重新选择!</span>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBackground } from '../../../common/bgcontact'
import store from '@/store'
import * as types from '@/store/mutation-types'
import { getCurrentAccount } from '@/business/auth'
export default {
  data () {
    var checkImportType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('导入类型不能为空'))
      }
    }
    var checkPri = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('私钥不能为空'))
      }
    }

    var checkMemwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('助记词不能为空'))
      }
    }

    // var validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入密码'))
    //   } else {
    //     if (this.ruleForm.repassword !== '') {
    //       this.$refs.ruleForm.validateField('repassword')
    //     }
    //     callback()
    //   }
    // }
    // var validatePass2 = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请再次输入密码'))
    //   } else if (value !== this.ruleForm.password) {
    //     callback(new Error('两次输入密码不一致!'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      ruleForm: {
        pri: '',
        memwd: '',
        password: store.getters.passCheck,
        // repassword: '',
        // 下拉框
        value: '',
        importtypes: [
          {
            value: '0',
            label: '私钥'
          },
          {
            value: '1',
            label: '助记词'
          }
        ]
      },
      // 控制显示隐藏
      flag_pri: false,
      flag_zjc: false,
      dialogVisible: false,
      rules: {
        type: [{ validator: checkImportType, trigger: 'blur' }],
        pri: [{ validator: checkPri, trigger: 'blur' }],
        memwd: [
          { validator: checkMemwd, trigger: 'blur' },
          { min: 12, message: '长度为 12 个单词', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  mounted () {},
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ name: 'homepage' })
    },
    setImportTypes () {
      console.log('设置页面显示隐藏')
      const type = this.ruleForm.value
      if (type === '0') {
        this.flag_pri = true
        this.flag_zjc = false
      } else {
        this.flag_pri = false
        this.flag_zjc = true
      }
    },
    async submitForm (formName) {
      let mn, prikey
      // 私钥或助记词方式导入账户 todo
      const selectType = this.ruleForm.value
      if (selectType === '1') {
        mn = this.ruleForm.memwd
      } else if (selectType === '0') {
        prikey = this.ruleForm.pri
      } else {
        this.dialogVisible = true
        return
      }
      const bg = getBackground()
      await bg.saveAccount({
        privateKey: prikey,
        mnemonic: mn,
        pwd: this.ruleForm.password
      })
      // popup store中存储currentAccount, 数据来源与持久化存储的当前账户
      const currentAccount = await getCurrentAccount()
      store.commit(types.SET_CURRENT_ACCOUNT, currentAccount)
      // 创建账户成功,拷贝bg store中的accounts到popup store中
      const bgState = bg.getBgState()
      store.commit(types.CLONE_STATE, { keyArr: ['accounts'], bgState })
      // 账户导入后,默认跳转homepage页面
      this.$router.push({ name: 'homepage' })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.importaccount-wrap {
  @include common-container;
  .form-row{
        margin: 20px 10px;
  }
}
</style>
<style lang="scss">
.qos-dialog {
  .el-dialog__body {
    padding: 0 30px !important;
  }
}
.form-label{
  .el-form-item__label{
    width: 90px !important;
  }
  .el-form-item__content{
    margin-left: 90px !important;
  }
}
</style>
