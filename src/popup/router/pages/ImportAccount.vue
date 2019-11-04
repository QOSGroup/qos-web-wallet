<template>
  <div class="importaccount-wrap">
    <el-page-header @back="goBack" content="导入账户"></el-page-header>
    <el-divider></el-divider>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="导入类型" prop="type">
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
      <el-form-item label="输入私钥" prop="pri" v-if="flag_pri">
        <el-input v-model="ruleForm.pri" autocomplete="off" size="mini"></el-input>
      </el-form-item>

      <el-form-item label="导入JSON文件" prop="jsonFile" v-if="flag_json">
        <el-upload
          class="upload-demo"
          action
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="ruleForm.fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传文本文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="验证钱包密码" prop="walletPass" v-if="flag_json">
        <el-input v-model="ruleForm.walletPass" autocomplete="off" size="mini"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">导入</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var checkPri = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("私钥不能为空"));
      }
    };
    var checkImportType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("导入类型不能为空"));
      }
    };
    return {
      ruleForm: {
        pri: "",
        value: "",
        importtypes: [
          {
            value: "0",
            label: "私钥"
          },
          {
            value: "1",
            label: "JSON文件"
          }
        ],
        fileList: "",
        flag_pri: false,
        flag_json: false
      },
      rules: {
        pri: [{ validator: checkPri, trigger: "blur" }],
        type: [{ validator: checkImportType, trigger: "blur" }]
      },
      
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
    setImportTypes() {
      console.log("设置页面显示隐藏");
      const type = this.ruleForm.value;
      if (type == "0") {
        this.flag_pri= true
        this.flag_json= false
      } else {
        this.flag_pri= false
        this.flag_json= true
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.importaccount-wrap {
  @include common-container;
}
</style>
