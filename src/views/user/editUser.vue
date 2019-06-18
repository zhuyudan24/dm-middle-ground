<template>
  <div class="index-content">
    <bread-crumb :navpath="navpath" :navpathName="navpathName"></bread-crumb>
    <div class="content-content-wrap">
      <div class="content-content" v-loading="loading">
        <div class="gic-web-wrap module-wrap">
          <div class="module-title"><span>GIC商户后台</span></div>
          <div class="gic-web-content">
            <el-form :model="editGicForm" :rules="gicRules" ref="editGicForm" label-width="100px">
              <el-form-item label="姓名：" prop="name">
                <div class="edit-input">
                  <el-input class="input-input" v-model="editGicForm.name" @keyup.native="toInput1(editGicForm.name, $event)"></el-input>
                  <span class="tag-name-num">{{ inputNum1 }}/{{ inputLength1 }}</span>
                </div>
              </el-form-item>
              <el-form-item label="性别：">
                <el-radio-group v-model="editGicForm.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="员工代码：" prop="code">
                <div class="edit-input">
                  <el-input class="input-input" v-model="editGicForm.code" :disabled="true"></el-input>
                  <span class="tag-name-num">{{ inputNum2 }}/{{ inputLength2 }}</span>
                </div>
              </el-form-item>
              <el-form-item label="手机号码：" prop="phone">
                <el-input v-model="editGicForm.phone" type="number"></el-input>
              </el-form-item>
              <el-form-item label="职位：" prop="role">
                <div class="edit-input">
                  <el-input class="input-input" v-model="editGicForm.role" @keyup.native="toInput3(editGicForm.role, $event)"></el-input>
                  <span class="tag-name-num">{{ inputNum3 }}/{{ inputLength3 }}</span>
                </div>
              </el-form-item>
              <el-form-item label="管辖门店：" prop="store" class="is-required store-wrap">
                <selectShopTree :msg="sendChildData" ref="selectStoreTree" @sendSelectGroupData="getSelectGroupData"></selectShopTree>
                <div v-if="errorStoreBool" class="el-form-item__error">{{ errorStoreMsg }}</div>
              </el-form-item>
              <el-form-item label="数据权限：" class="store-wrap">
                <selectRightTree :msg="sendChildData2" ref="selectRightDataTree" @sendSelectGroupData="getSelectGroupData2"></selectRightTree>
                <div v-if="errorRightBool" class="el-form-item__error">{{ errorRightMsg }}</div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="three-wrap module-wrap">
          <div class="module-title"><span>应用服务</span><el-button @click="editApply" type="text">编辑</el-button></div>
          <div class="three-content clearfix">
            <div class="fl img">
              <img src="../../../static/img/gic.png" alt="" />
            </div>
            <div class="fl three-info">
              <div class="three-info-item fl">
                <!-- <h2>{{ roleName }}</h2> -->
                <h2>GIC商户后台</h2>
                <div class="phone-wrap">
                  手机号码<span class="phone-number">{{ editGicForm.phone }}</span
                  ><b>|</b> 账号角色：<el-select @change="changeGicRole" v-model="gicAccountRole" placeholder="请选择">
                    <el-option v-for="item in gicOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId"> </el-option>
                  </el-select>
                  <div v-if="errorGicBool" class="el-form-item__error error-msg">{{ errorGicMsg }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="thirdProjectUser.length > 0" class="three-content clearfix" v-for="(itemList, index) in thirdProjectUser" :key="index">
            <div class="fl img">
              <img v-show="itemList[0].projectCode == 'wm-mall'" src="../../../static/img/marking.png" alt="" />
              <img v-show="itemList[0].projectCode == 'yh-bi'" src="../../../static/img/wxy.png" alt="" />
              <img v-show="itemList[0].projectCode == 'yueshi'" src="../../../static/img/jfsc.png" alt="" />
            </div>
            <div class="fl three-info no-small-line">
              <div class="three-info-item fl" v-for="item in itemList" :key="item.createTime">
                <h2 v-show="item.projectCode == 'wm-mall'">{{ item.thirdProjectStoreName }}</h2>
                <h2 v-show="item.projectCode == 'yh-bi'">万象仪</h2>
                <h2 v-show="item.projectCode == 'yueshi'">福利中心</h2>
                <div class="phone-wrap">
                  手机号码<span class="phone-number">{{ item.phoneNumber }}</span
                  ><b v-show="item.projectCode != 'yueshi'">|</b>
                  <span v-show="item.projectCode != 'yueshi'"
                    >账号角色：<el-select @change="changeWeiRole(item.thirdProjectRoleId, item)" v-model="item.thirdProjectRoleId" placeholder="请选择">
                      <el-option v-for="item in item.roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"> </el-option>
                    </el-select>
                    <div v-if="errorWeiBool && !item.thirdProjectRoleId" class="el-form-item__error error-msg">请选择账号角色</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="two-btn">
          <el-row>
            <el-button @click="preBack">返 回</el-button>
            <el-button type="primary" @click="saveUserBtn('editGicForm')">保 存</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadCrumb from '../../components/breadCrumb';
import selectShopTree from 'components/selectShopTreeMany';
import selectRightTree from 'components/selectShopTreeMany2';
import strLength from '../../../static/js/strlen';
import { isvalidPhone } from '../../../static/js/validate';
import { postRequest } from '@/api/api';
import { log } from '@/utils/index.js';
// eslint-disable-next-line
let qs = require('qs');
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
export default {
  name: 'index',
  data() {
    return {
      navpath: [
        {
          name: '用户管理',
          path: '/userManage'
        }
      ],
      navpathName: '编辑用户',
      editGicForm: {
        name: '',
        sex: 1,
        code: '',
        phone: '',
        role: '',
        store: '',
        paw: ''
      },
      clerkId: '',
      gicRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        code: [{ required: true, message: '请输入员工代码', trigger: 'blur' }],
        phone: [{ required: true, trigger: 'blur', validator: validPhone }],
        role: [{ required: true, message: '请输入职位', trigger: 'blur' }]
      },

      thirdProjectUser: [], // 第三方账号信息
      gicOptions: [], // gic 角色
      weiOptions: [], // 微盟 角色
      gicAccountRole: '',
      weiAccountRole: '',
      thirdProjectStoreId: '',
      roleName: '',
      /* 门店 */
      sendChildData: {},
      storeType: '0',
      storeList: [],
      errorStoreMsg: '', // 门店的错误信息
      errorStoreBool: false, // 门店的错误提示是否存在
      errorGicMsg: '', // gic 角色的错误提示
      errorGicBool: false,
      errorWeiBool: false,
      // 数据权限
      sendChildData2: {},
      storeType2: '0',
      storeList2: [],
      errorRightMsg: '', // 数据权限的错误信息
      errorRightBool: false,

      loading: false,
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
  mounted() {
    // this.init();
    this.getUesrDetail();
  },
  methods: {
    // init(){
    //   Object.assign(this.$data, this.$options.data());  // 新进页面时清除 表单 的错误判断
    //   this.$nextTick(_ => {
    //     this.$refs.editGicForm.resetFields();
    //   })
    //   this.getUesrDetail();
    // },
    getUesrDetail() {
      // 获取用户详情
      this.loading = true;
      this.clerkId = this.$route.query.clerkId;
      let para = {
        clerkId: this.clerkId
      };
      postRequest('/api-admin/middle-user-detail', para)
        .then(res => {
          let data = res.data;
          this.loading = false;
          if (data.errorCode == 0) {
            let userDetail = data.result.clerkInfo;
            this.editGicForm.name = userDetail.clerkName;
            this.editGicForm.sex = Number(userDetail.clerkGender);
            this.editGicForm.code = userDetail.clerkCode;
            this.editGicForm.phone = userDetail.phoneNumber;
            this.editGicForm.role = userDetail.positionName;
            this.thirdProjectUser = data.result.thirdProjectUser ? data.result.thirdProjectUser : [];
            this.inputNum1 = strLength.getZhLen(this.editGicForm.name);
            this.inputNum2 = strLength.getZhLen(this.editGicForm.code);
            this.inputNum3 = strLength.getZhLen(this.editGicForm.role);
            if (data.result.role) {
              // gic 是否有角色
              this.gicAccountRole = data.result.role.roleId;
              this.roleName = data.result.role.roleName;
            }
            this.storeType = userDetail.storeMode; // 门店
            this.storeType2 = userDetail.cloudStoreMode; // 数据权限
            // let storeList1,storeList2;
            userDetail.storeList.forEach((item, index) => {
              if (item.type == 1) {
                this.storeList.push(item);
              } else if (item.type == 2) {
                this.storeList2.push(item);
              }
            });
            if (this.storeType == '1') {
              // 向门店子组件传递数据
              // this.storeList = userDetail.storeList;
              this.sendChildData = {};
              this.sendChildData.storeType = this.storeType;
              let storeGroupId = '';
              this.storeList.forEach(item => {
                storeGroupId += item.storeGroupId + ',';
              });
              this.sendChildData.storeList = this.storeList;
              this.sendChildData.storeGroupIds = storeGroupId.substring(0, storeGroupId.length - 1);
            } else if (this.storeType == '0') {
              // 向子组件传递数据
              this.sendChildData = {};
              this.sendChildData.storeType = this.storeType;
            } else if (this.storeType == '2') {
              // this.storeList = userDetail.storeList;
              this.sendChildData = {}; // 向子组件传递数据
              this.sendChildData.storeType = this.storeType;
              let storeIds = '';
              let storeNames = '';
              this.storeList.forEach(item => {
                storeIds += item.storeId + ',';
                storeNames += item.storeName + ',';
              });
              this.sendChildData.storeList = this.storeList;
              this.sendChildData.storeIds = storeIds.substring(0, storeIds.length - 1);
              this.sendChildData.storeName = storeNames.substring(0, storeNames.length - 1);
            }

            if (this.storeType2 == '1') {
              // 向数据权限子组件传递数据
              // this.storeList = userDetail.storeList;
              this.sendChildData2 = {};
              this.sendChildData2.storeType = this.storeType2;
              let storeGroupId = '';
              this.storeList2.forEach(item => {
                storeGroupId += item.storeGroupId + ',';
              });
              this.sendChildData2.storeList = this.storeList2;
              this.sendChildData2.storeGroupIds = storeGroupId.substring(0, storeGroupId.length - 1);
            } else if (this.storeType2 == '0') {
              // 向子组件传递数据
              this.sendChildData2 = {};
              this.sendChildData2.storeType = this.storeType2;
            } else if (this.storeType2 == '2') {
              // this.storeList = userDetail.storeList;
              this.sendChildData2 = {}; // 向子组件传递数据
              this.sendChildData2.storeType = this.storeType2;
              let storeIds = '';
              let storeNames = '';
              this.storeList2.forEach(item => {
                storeIds += item.storeId + ',';
                storeNames += item.storeName + ',';
              });
              this.sendChildData2.storeList = this.storeList2;
              this.sendChildData2.storeIds = storeIds.substring(0, storeIds.length - 1);
              this.sendChildData2.storeName = storeNames.substring(0, storeNames.length - 1);
            }

            this.getGicRole(); // 获取gic账号角色
            // 微盟的 账号角色
            // this.thirdProjectUser.forEach((item,index)=>{
            //   if(item.thirdProjectRoleId){
            //     this.getWeiRole(item.thirdProjectStoreId);
            //   }
            // })
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    getGicRole() {
      // 获取gic的账号角色
      let para = {};
      postRequest('/api-admin/list-right-role', para)
        .then(res => {
          let data = res.data;
          this.loading = false;
          if (data.errorCode == 0) {
            this.gicOptions = data.result;
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    getWeiRole(id) {
      // 通过微盟门店查询角色
      postRequest('/api-admin/list-middle-role-bystore', {
        thirdProjectStoreId: id
      })
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.weiOptions = data.result;
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
          this.$message.error(error.message);
        });
    },
    toInput1(value, e) {
      this.editGicForm.name = strLength.getByteVal(e.target.value, this.inputLength1);
      this.inputNum1 = strLength.getZhLen(this.editGicForm.name);
    },
    toInput2(value, e) {
      if (this.editGicForm.code) {
        this.editGicForm.code = strLength.getByteVal(e.target.value, this.inputLength2);
        this.inputNum2 = strLength.getZhLen(this.editGicForm.code);
      }
    },
    toInput3(value, e) {
      this.editGicForm.role = strLength.getByteVal(e.target.value, this.inputLength3);
      this.inputNum3 = strLength.getZhLen(this.editGicForm.role);
    },
    changeGicRole(val) {
      // gic 选择账号角色
      // log(val)
      this.gicAccountRole = val;
      if (this.gicAccountRole) {
        this.errorGicBool = false;
      }
      let obj = {};
      obj = this.gicOptions.find(item => {
        return item.roleId === val; // 筛选出匹配数据  signageCode与选中的相等
      });
      this.roleName = obj.roleName;
    },
    changeWeiRole(id, item) {
      // 选择微盟的角色
      let obj = {};
      obj = item.roleList.find(list => {
        return list.roleId === id; // 筛选出匹配数据  signageCode与选中的相等
      });
      item.thirdProjectRoleName = obj.roleName;
    },
    /* 选择门店 start*/
    // selectTreeHide(){   // 调用子组件 门店树级 结构的值  隐藏
    //   // log('klkl');
    //   // this.$refs.selectStoreTree.hideTree();
    //   this.$refs.selectRightDataTree.hideTree();
    // },
    getSelectGroupData(val) {
      // 获得子元素 门店 传递的数据
      // log(val);
      this.storeType = val.storeType.toString();
      this.storeList = val.storeList ? val.storeList : [];
      if (this.storeList.length > 0) {
        this.errorStoreBool = false;
      }
      if (this.storeType == '0') {
        this.errorStoreBool = false;
      }
    },
    /* 数据权限 start*/
    // selectTreeHide(){   // 调用子组件 门店树级 结构的值  隐藏
    //   log('klkl');
    //   // this.$refs.selectStoreTree.hideTree();
    //   this.$refs.selectRightDataTree.hideTree();
    // },
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
        // log(this.storeList);
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
      if (this.gicAccountRole == '') {
        // gic的账号角色
        this.errorGicBool = true;
        this.errorGicMsg = '请选择账号角色';
        flag = false;
      }
      this.thirdProjectUser.forEach(itemList => {
        // 微盟的 账号角色
        if (!itemList[0].thirdProjectRoleId && itemList[0].projectCode != 'yueshi') {
          this.errorWeiBool = true;
          flag = false;
        }
      });
      this.$refs[formName].validate(valid => {
        if (valid && flag) {
          let arrList = []; // 传递的 微盟账号角色 数据
          this.thirdProjectUser.forEach(itemList => {
            let arr = []; // 传递的 微盟账号角色 数据
            itemList.forEach(item => {
              let obj = {};
              obj.thirdProjectUserId = item.thirdProjectUserId;
              obj.projectCode = item.projectCode;
              obj.phoneNumber = item.phoneNumber;
              obj.status = item.status;
              obj.thirdProjectStoreId = item.thirdProjectStoreId;
              obj.thirdProjectStoreName = item.thirdProjectStoreName;
              obj.thirdProjectRoleId = item.thirdProjectRoleId;
              obj.thirdProjectRoleName = item.thirdProjectRoleName;
              arr.push(obj);
            });
            arrList.push(arr);
          });
          this.axios
            .post(
              '/api-admin/update-middle-user?requestProject=gic-web',
              {
                clerkId: this.clerkId,
                clerkType: 2,
                clerkName: this.editGicForm.name,
                clerkGender: this.editGicForm.sex,
                clerkCode: this.editGicForm.code,
                phoneNumber: this.editGicForm.phone,
                positionName: this.editGicForm.role,
                roleId: this.gicAccountRole,
                storeMode: this.storeType,
                storeList: this.storeList,
                cloudStoreMode: parseInt(this.storeType2),
                cloudStoreList: this.storeList2,
                resetPwd: this.editGicForm.paw,
                storeId: '',
                thirdProjectUser: JSON.stringify(arrList)
              },
              {
                headers: { 'Content-Type': 'application/json' }
              }
            )
            .then(res => {
              let data = res.data;
              if (data.errorCode == 0) {
                this.$message.success('保存成功');
                this.$router.push('/userManage');
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
    preBack() {
      this.$router.push('/userManage');
    },
    editApply() {
      // 编辑应用服务
      this.$router.push({
        path: '/threeApply',
        query: {
          type: 'edit',
          name: this.editGicForm.name,
          phone: this.editGicForm.phone,
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
  padding: 0 0 30px 0;
}
.module-wrap {
  margin-top: 17px;
  padding: 0 20px;
  .module-title {
    border-bottom: 1px solid #dcdfe6;
    padding-bottom: 17px;
    margin-bottom: 20px;
    span {
      padding-right: 15px;
      font-size: 14px;
      color: #262626;
      font-weight: 500;
      line-height: 18px;
    }
  }
}
.gic-web-content {
  font-size: 14px;
  margin-bottom: 35px;
  > span {
    display: inline-block;
    width: 80px;
    text-align: right;
    color: #919191;
  }
  p {
    line-height: 18px;
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.three-content {
  display: flex;
  color: #262626;
  font-size: 14px;
  margin-bottom: 10px;
  position: relative;
  .img {
    width: 60px;
    flex: 0 0 60px;
    margin-right: 20px;
    img {
      width: 100%;
    }
    p {
      text-align: center;
    }
  }
  .three-info {
    flex: 1;
    font-size: 14px;
    border-bottom: 1px solid #dcdfe6;
    display: inline-block;
    padding: 7px 0 0 0;
    margin-right: 50px;
    box-sizing: border-box;
    max-width: 1350px;
    h2 {
      color: #262626;
      padding-bottom: 3px;
      line-height: 18px;
    }
    .phone-wrap {
      color: #919191;
      line-height: 32px;
      position: relative;
      .phone-number {
        padding-left: 10px;
        display: inline-block;
        width: 100px;
      }
      b {
        padding-right: 10px;
        font-weight: normal;
        vertical-align: top;
        font-size: 10px;
      }
      .error-msg {
        top: 32px;
        left: 253px;
      }
    }
  }
}
.three-info-item {
  width: 365px;
  height: 55px;
  margin-right: 80px;
  margin-bottom: 20px;
}
.three-content .three-info.no-small-line {
  padding-bottom: 0;
  .three-info-item {
    border-bottom: none;
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
.two-btn {
  margin: 30px 20px 0 20px;
  text-align: center;
}
.el-button + .el-button {
  margin-left: 20px;
}
.content-content .store-wrap {
  height: 33px;
  overflow: hidden;
}
.content-content .store-wrap /deep/ .el-input__inner {
  width: 100%;
}
.content-content /deep/ .el-select .el-input__inner {
  // width: 210px;
}
.content-content /deep/ .el-input__inner {
  width: 360px;
}
.phone-wrap /deep/ .el-select .el-input__inner {
  width: 110px;
}
</style>
