<template>
  <div class="index-content">
    <bread-crumb :navpath="navpath" :navpathName="navpathName"></bread-crumb>
    <div class="content-content-wrap">
      <div class="content-content">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="姓名：" prop="name">
            <div class="edit-input">
              <el-input class="input-input" v-model="ruleForm.name" @keyup.native="toInput1(ruleForm.name, $event)"></el-input>
              <span class="tag-name-num">{{ inputNum1 }}/{{ inputLength1 }}</span>
            </div>
          </el-form-item>
          <el-form-item label="性别：">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="员工代码：" prop="code">
            <div class="edit-input">
              <el-input class="input-input" v-model="ruleForm.code" @keyup.native="toInput2(ruleForm.code, $event)"></el-input>
              <span class="tag-name-num">{{ inputNum2 }}/{{ inputLength2 }}</span>
            </div>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="职位：" prop="role">
            <div class="edit-input">
              <el-input class="input-input" v-model="ruleForm.role" @keyup.native="toInput3(ruleForm.role, $event)"></el-input>
              <span class="tag-name-num">{{ inputNum3 }}/{{ inputLength3 }}</span>
            </div>
          </el-form-item>
          <el-form-item label="登录密码：" prop="paw">
            <el-input v-model="ruleForm.paw"></el-input>
          </el-form-item>
          <el-form-item label="管辖门店：" prop="store" class="is-required store-wrap">
            <selectShopTree :msg="sendChildData" ref="selectStoreTree" @sendSelectGroupData="getSelectGroupData"></selectShopTree>
            <div v-if="errorStoreBool" class="el-form-item__error">{{ errorStoreMsg }}</div>
          </el-form-item>
          <el-form-item label="数据权限：" class="store-wrap">
            <selectRightTree :msg="sendChildData2" ref="selectRightDataTree" @sendSelectGroupData="getSelectGroupData2"></selectRightTree>
            <div v-if="errorRightBool" class="el-form-item__error">{{ errorRightMsg }}</div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="save-btn" @click="saveUserBtn('ruleForm')">新 建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 保存成功 -->
    <el-dialog title="提示" class="dialog-save-wrap" :close-on-click-modal="false" :visible.sync="dialogVisible" width="480px">
      <div>
        <div class="img">
          <img src="../../../static/img/create-icon.png" alt="" />
        </div>
        <p>恭喜，用户创建成功</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn">取 消</el-button>
        <el-button type="primary" @click="addThreeCount">新增第三方应用账号</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import breadCrumb from 'components/breadCrumb';
import selectShopTree from 'components/selectShopTreeMany';
import selectRightTree from 'components/selectShopTreeMany2';
import { isvalidPhone, isCommonCode } from '../../../static/js/validate';
import strLength from '../../../static/js/strlen';
import { log } from '@/utils/index.js';
let validPhone = (rule, value, callback) => {
  //定义一个全局的变量  手机号验证
  if (!value) {
    callback(new Error('请输入手机号码'));
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'));
  } else {
    callback();
  }
};
let validCode = (rule, value, callback) => {
  //定义一个全局的变量  员工代码 验证
  if (!value) {
    callback(new Error('请输入员工代码'));
  } else if (!isCommonCode(value)) {
    callback(new Error('员工代码不能有特殊字符'));
  } else {
    callback();
  }
};

export default {
  name: 'index',
  data() {
    return {
      repProjectName: 'middle-ground',
      navpath: [
        {
          name: '用户管理',
          path: '/userManage'
        }
      ],
      navpathName: '新建用户',
      ruleForm: {
        name: '',
        sex: 1,
        code: '',
        phone: '',
        role: '',
        paw: '',
        store: ''
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        code: [{ required: true, trigger: 'blur', validator: validCode }],
        phone: [{ required: true, trigger: 'blur', validator: validPhone }],
        role: [{ required: true, message: '请输入职位', trigger: 'blur' }],
        paw: [{ required: true, message: '请输入登录密码', trigger: 'blur' }]
      },
      /* 门店 */
      sendChildData: {},
      storeType: '0',
      storeList: [],
      errorStoreMsg: '', // 门店的错误信息
      errorStoreBool: false, // 门店的错误提示是否存在
      // 数据权限
      sendChildData2: {},
      storeType2: '0',
      storeList2: [],
      errorRightMsg: '', // 数据权限的错误信息
      errorRightBool: false,

      dialogVisible: false,
      clerkId: '', // 保存成功之后获取到

      inputNum1: 0,
      inputLength1: 10,
      inputNum2: 0,
      inputLength2: 20,
      inputNum3: 0,
      inputLength3: 20
    };
  },
  computed: {},
  // activated(){
  //   this.init();
  // },
  // mounted(){
  //   this.init();
  // },
  methods: {
    // init(){
    //   Object.assign(this.$data, this.$options.data());  // 重新调用data数据
    //   this.$nextTick(_ => {  // 新进页面时清除 表单 的错误判断
    //     this.$refs.ruleForm.resetFields();
    //   })
    // },
    /* 选择门店 start*/
    // selectTreeHide(){   // 调用子组件 门店树级 结构的值  隐藏
    //   this.$refs.selectTree.hideTree();
    // },
    getSelectGroupData(val) {
      // 获得子元素 门店 传递的数据
      this.storeType = val.storeType.toString();
      this.storeList = val.storeList ? val.storeList : [];
      if (this.storeList.length > 0) {
        this.errorStoreBool = false;
      }
      if (this.storeType == '0') {
        this.errorStoreBool = false;
      }
    },
    // 数据权限
    getSelectGroupData2(val) {
      // 获得子元素 门店 传递的数据
      // log(val);
      this.storeType2 = val.storeType.toString();
      this.storeList2 = val.storeList ? val.storeList : [];
      if (this.storeList2.length > 0) {
        this.errorRightBool = false;
      }
      if (this.storeType2 == '0') {
        this.errorRightBool = false;
      }
    },
    toInput1(value, e) {
      this.ruleForm.name = strLength.getByteVal(e.target.value, this.inputLength1);
      this.inputNum1 = strLength.getZhLen(this.ruleForm.name);
    },
    toInput2(value, e) {
      if (this.ruleForm.code) {
        this.ruleForm.code = strLength.getByteVal(e.target.value, this.inputLength2);
        this.inputNum2 = strLength.getZhLen(this.ruleForm.code);
      }
    },
    toInput3(value, e) {
      this.ruleForm.role = strLength.getByteVal(e.target.value, this.inputLength3);
      this.inputNum3 = strLength.getZhLen(this.ruleForm.role);
    },
    saveUserBtn(formName) {
      // 保存
      let flag = true;
      if (this.storeType == '1') {
        // 门店分组
        if (this.storeList.length < 1) {
          this.errorStoreBool = true;
          this.errorStoreMsg = '请选择门店分组';
          flag = false;
        }
      } else if (this.storeType == '2') {
        // 部分门店
        if (this.storeList.length < 1) {
          this.errorStoreBool = true;
          this.errorStoreMsg = '请选择部分门店';
          flag = false;
        }
      }
      // 数据权限
      if (this.storeType2 == '1') {
        // 门店分组
        if (this.storeList2.length < 1) {
          this.errorRightBool = true;
          this.errorRightMsg = '请选择门店分组';
          flag = false;
        }
      } else if (this.storeType2 == '2') {
        // 部分门店
        // log(this.storeList);
        if (this.storeList2.length < 1) {
          this.errorRightBool = true;
          this.errorRightMsg = '请选择部分门店';
          flag = false;
        }
      }
      this.$refs[formName].validate(valid => {
        if (valid && flag) {
          this.axios
            .post(
              '/api-admin/save-clerk-info?requestProject=gic-web',
              {
                clerkId: '',
                clerkType: 2,
                clerkName: this.ruleForm.name,
                clerkGender: this.ruleForm.sex,
                clerkCode: this.ruleForm.code,
                phoneNumber: this.ruleForm.phone,
                positionName: this.ruleForm.role,
                storeMode: this.storeType,
                storeList: this.storeList,
                cloudStoreMode: this.storeType2,
                cloudStoreList: this.storeList2,
                resetPwd: this.ruleForm.paw
              },
              {
                headers: { 'Content-Type': 'application/json' }
              }
            )
            .then(res => {
              let data = res.data;
              if (data.errorCode == 0) {
                this.dialogVisible = true;
                this.clerkId = data.result;
              } else {
                this.$message.error(data.message);
              }
            });
        } else {
          log('error submit!!');
          return false;
        }
      });
    },
    cancelBtn() {
      // 弹框的取消按钮  跳转到列表页
      this.dialogVisible = false;
      this.$router.push('/userManage');
    },
    addThreeCount() {
      // 新增第三方
      this.$router.push({
        path: '/threeApply',
        query: {
          type: 'add',
          name: this.ruleForm.name,
          clerkId: this.clerkId
        }
      });
    }
  },
  components: {
    breadCrumb,
    selectShopTree,
    selectRightTree
  }
};
</script>

<style lang="less" scoped>
.content-content {
  padding: 30px 0;
  .img-succ {
    text-align: center;
    padding-top: 120px;
  }
  p {
    font-size: 16px;
    color: #262626;
    line-height: 22px;
    text-align: center;
    margin: 23px 0 17px 0;
  }
  .el-row {
    text-align: center;
    padding-bottom: 352px;
    .el-button + .el-button {
      margin-left: 20px;
    }
  }
}
.dialog-save-wrap {
  .img {
    margin: 43px 0 35px 0;
    text-align: center;
  }
  p {
    font-size: 16px;
    color: #262626;
    text-align: center;
    margin-bottom: 15px;
  }
  .dialog-footer {
    padding-bottom: 50px;
  }
}
.edit-input {
  position: relative;
  display: inline-block;
  .tag-name-num {
    position: absolute;
    right: 10px;
    bottom: 1px;
    color: #c0c4cc;
    font-size: 12px;
    height: 30px;
    line-height: 32px;
    padding-left: 10px;
  }
}
.save-btn {
  margin: 22px 0 182px 0;
}
.content-content /deep/ .el-input__inner {
  width: 360px;
}
.content-content .store-wrap /deep/ .el-input__inner {
  width: 100%;
}
.dialog-save-wrap /deep/ .el-dialog__header {
  display: none;
}
</style>
