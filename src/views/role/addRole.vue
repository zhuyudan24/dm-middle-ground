<template>
  <div class="index-content">
    <bread-crumb :navpath="navpath" :navpathName="!naveditBool ? navpathName : navpathNameedit"></bread-crumb>
    <div class="content-content-wrap">
      <div class="content-content">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名称：" prop="name">
            <div class="edit-input">
              <el-input v-model="ruleForm.name" @keyup.native="toInput(ruleForm.name, $event)"></el-input>
              <span class="tag-name-num">{{ inputNum }}/{{ inputLength }}</span>
            </div>
          </el-form-item>
        </el-form>
        <div class="right-config">
          <div class="title clearfix">
            <p class="fl">权限设置</p>
            <div class="select-right fr">
              选择应用：<el-select :disabled="roleId ? true : false" @change="changeApply" v-model="apply" placeholder="请选择">
                <el-option v-for="item in options2" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
              <div v-show="apply == 'wm-mall'" style="margin-left:10px;display:inline-block">
                <el-select :disabled="roleId ? true : false" @change="changeWeiStore" v-model="store" placeholder="请选择">
                  <el-option v-for="item in options3" :key="item.wmStoreId" :label="item.name" :value="item.wmStoreId"> </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="right-wrap account-limit-wrap" v-loading="loading">
            <elNewTree v-if="apply == 'gic'" :data="treeData1" show-checkbox ref="tree1" node-key="rightId" :default-checked-keys="withoutParents1" default-expand-all :props="defaultProps"> </elNewTree>

            <elNewTree v-if="apply == 'wm-mall'" :data="treeData2" show-checkbox ref="tree2" node-key="rightId" :default-checked-keys="withoutParents2" default-expand-all :props="defaultProps"> </elNewTree>

            <elNewTree v-if="apply == 'yh-bi'" :data="treeData3" show-checkbox ref="tree3" node-key="rightId" :default-checked-keys="withoutParents3" default-expand-all :props="defaultProps"> </elNewTree>
          </div>
        </div>
      </div>
    </div>
    <div class="save-btn">
      <el-button type="primary" @click="saveBtn('ruleForm')">{{ roleId ? '保 存' : '新 建' }}</el-button>
    </div>
  </div>
</template>

<script>
import breadCrumb from '../../components/breadCrumb';
import strLength from '../../../static/js/strlen';
import elNewTree from '../../components/tree/src/tree';
import { getRequest, postRequest } from '@/api/api';
import { log } from '@/utils/index.js';
export default {
  name: 'index',
  data() {
    return {
      defaultProps: {
        children: 'childList',
        label: 'rightName'
      },
      navpath: [
        {
          name: '用户管理',
          path: '/userManage'
        }
      ],
      navpathName: '新建角色',
      navpathNameedit: '编辑角色',
      naveditBool: false,
      ruleForm: {
        name: '',
        next: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      options2: [], // 应用
      options3: [], // 门店
      apply: 'gic', // 选择应用
      store: '',
      storeName: '',

      inputNum: 0,
      inputLength: 20,

      treeData: [],
      treeData1: [],
      treeData2: [],
      treeData3: [],
      ids: [],
      ids1: [], //包含父节点
      withoutParents1: [], //不包含父节点
      selectBtnIds1: [], // 选择的按钮的 id
      ids2: [], //包含父节点
      withoutParents2: [], //不包含父节点
      selectBtnIds2: [], // 选择的按钮的 id
      ids3: [], //包含父节点
      withoutParents3: [], //不包含父节点
      selectBtnIds3: [], // 选择的按钮的 id
      treeOptions: {
        withParents: false //是否包含父节点，如果为false,则要添加withoutParents这个参数，如果为true则不需要添加
      },
      gicWebObj: {},
      rightArr: [],
      btnArr: [],
      roleId: '',
      loading: false,
      allBtnArr: []
    };
  },
  computed: {},
  // activated() {
  //   this.getUrlData();
  // },
  mounted() {
    this.getUrlData();
  },
  methods: {
    getUrlData() {
      // 获取路由参数
      // Object.assign(this.$data, this.$options.data());  // 新进页面时清除 表单 的错误判断
      // this.$nextTick(_ => {
      //   this.$refs.ruleForm.resetFields();
      // })
      this.getThreeApply(); // 获取第三方应用
      this.roleId = this.$route.query.roleId ? this.$route.query.roleId : '';
      let type = this.$route.query.type; // 1角色
      this.navpath[0].path = '/userManage?type=' + type;
      if (this.roleId) {
        // 编辑
        this.naveditBool = true;
        this.getRoleDetail();
      } else {
        // 新增
        this.getGicRight();
      }
    },
    getRoleDetail() {
      // 获取角色详情
      postRequest('/api-admin/middle-role-detail', {
        roleId: this.roleId
      })
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            let roleDtl = data.result.role;
            this.ruleForm.name = roleDtl.roleName;
            this.apply = roleDtl.projectCode;
            this.inputNum = strLength.getZhLen(this.ruleForm.name);
            if (this.apply == 'gic') {
              this.treeData1 = data.result.rightList;
              this.treeData1.forEach((item, index) => {
                item.fold = false; // 是折叠还是打开
                item.childList = item.childList ? item.childList : [];
                item.childList.forEach((el, idx) => {
                  el.childList = el.childList ? el.childList : [];
                  if (el.childList.length > 0) {
                    el.foldBool = 1;
                  }
                });
                if (item.rightId == 'gic-web') {
                  // 隐藏商户后台 gic-web 若ids1不为空，则传
                  this.treeData1.splice(index, 1);
                  this.gicWebObj = {};
                  this.gicWebObj.rightId = item.rightId;
                  this.gicWebObj.rightCode = item.rightCode;
                  this.gicWebObj.rightType = item.rightType;
                }
              });
              let ids = this.getRightIds(this.treeData1);
              ids.forEach(el => {
                this.withoutParents1.push(el);
                // this.ids1.push(el)
              });
            } else if (this.apply == 'wm-mall') {
              this.storeName = roleDtl.thirdProjectStoreName;
              this.getWeiStore();
              this.$nextTick(_ => {
                this.store = Number(roleDtl.thirdProjectStoreId);
              });
              let dataArr = data.result.rightList;
              dataArr.forEach((item, index) => {
                item.fold = false; // 是折叠还是打开
                item.childList = item.childList ? item.childList : [];
                item.childList.forEach((el, idx) => {
                  el.childList = el.childList ? el.childList : [];
                  if (el.childList.length > 0) {
                    el.foldBool = 1;
                  }
                });
              });

              this.treeData2 = this.getWeiBtnRight(dataArr);
              // log(this.treeData2);
              let ids = this.getRightIds(this.treeData2);
              ids.forEach(el => {
                this.withoutParents2.push(el);
                // this.ids2.push(el)
              });
            } else if (this.apply == 'yh-bi') {
              this.treeData3 = data.result.rightList;
              this.treeData3.forEach((item, index) => {
                item.fold = false; // 是折叠还是打开
                item.childList = item.childList ? item.childList : [];
                item.childList.forEach((el, idx) => {
                  el.childList = el.childList ? el.childList : [];
                  if (el.childList.length > 0) {
                    el.foldBool = 1;
                  }
                });
              });
              let ids = this.getRightIds(this.treeData3);
              ids.forEach(el => {
                this.withoutParents3.push(el);
                // this.ids1.push(el)
              });
            }
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    changeApply(val) {
      // 选择应用
      if (val == 'gic') {
        this.getGicRight(val);
      } else if (val == 'wm-mall') {
        this.getWeiStore();
      } else if (val == 'yh-bi') {
        this.getYhRight(val);
      }
    },
    getWeiStore() {
      // 获取微盟的门店 并 若 不存在门店 默认第一个门店
      let para = {};
      getRequest('/api-admin/list-wm-store', para)
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.options3 = data.result ? data.result : [];
            if (!this.store) {
              if (this.options3.length > 0) {
                this.$nextTick(_ => {
                  this.store = this.options3[0].wmStoreId; // 默认选中第一个
                  let obj = {};
                  obj = this.options3.find(item => {
                    return item.wmStoreId === this.store; // 筛选出匹配数据  signageCode与选中的相等
                  });
                  this.storeName = obj.name;
                  this.getWeiRight();
                });
              }
            } else {
              if (!this.roleId) {
                // 如果存在门店  且是新增  编辑的时候直接获取详情的数据
                this.getWeiRight();
              }
            }
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
          this.$message.error(error.message);
        });
    },
    getThreeApply() {
      // 获取第三方应用
      postRequest('/api-admin/list-all-project', {})
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            let obj = {
              thirdProjectId: 0,
              code: 'gic',
              name: 'GIC商户后台'
            };
            this.options2.push(obj);
            data.result.forEach(item => {
              if (item.code != 'yueshi') {
                this.options2.push(item);
              }
            });
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
          this.$message.error(error.message);
        });
    },
    changeWeiStore(val) {
      // 选择 门店
      let obj = {};
      obj = this.options3.find(item => {
        return item.wmStoreId === val; // 筛选出匹配数据  signageCode与选中的相等
      });
      this.storeName = obj.name;
      this.getWeiRight();
    },
    getGicRight(code) {
      // 获取gic商户的权限
      this.loading = true;
      this.ids1.splice(0, this.ids1.length);
      this.withoutParents1.splice(0, this.withoutParents1.length);
      this.getOtherRight(code);
      // postRequest('/api-admin/get-gic-role-right',{
      //   roleId:this.roleId
      // })
      // .then((res) => {
      //   let data = res.data;
      //   this.loading = false;
      //   if (data.errorCode == 0) {
      //     this.treeData1 = data.result.rightList;
      //     this.treeData1.forEach((item,index)=>{
      //       item.fold = false; // 是折叠还是打开
      //       // item.foldBool = 1;
      //       // item.level = 1;  // 第一级的标识
      //       item.childList = item.childList?item.childList:[];
      //       item.childList.forEach((el,idx)=>{
      //         el.childList = el.childList?el.childList:[];
      //         if(el.childList.length>0) {
      //            el.foldBool = 1
      //         };
      //       })
      //       if(item.rightId=='gic-web'){  // 隐藏商户后台 gic-web 若ids1不为空，则传
      //         this.treeData1.splice(index,1);
      //         this.gicWebObj = {};
      //         this.gicWebObj.rightId = item.rightId;
      //         this.gicWebObj.rightCode = item.rightCode;
      //         this.gicWebObj.rightType = item.rightType;
      //       }
      //     })
      //     // log(this.treeData1);
      //   }else{
      //     this.$message.error(data.message)
      //   }
      // })
      // .catch(function (error) {
      //   log(error);
      // });
    },
    getWeiRight() {
      // 获取第三方的权限
      this.loading = true;
      this.ids2.splice(0, this.ids2.length);
      this.withoutParents2.splice(0, this.withoutParents2.length);
      postRequest('/api-admin/get-third-project-role-right', {
        projectCode: this.apply,
        roleId: this.roleId,
        thirdProjectStoreId: this.store
      })
        .then(res => {
          let data = res.data;
          this.loading = false;
          if (data.errorCode == 0) {
            let dataArr = data.result;
            dataArr.forEach((item, index) => {
              item.fold = false; // 是折叠还是打开
              item.childList = item.childList ? item.childList : [];
              item.childList.forEach((el, idx) => {
                el.childList = el.childList ? el.childList : [];
                if (el.childList.length > 0) {
                  el.foldBool = 1;
                }
              });
            });
            this.treeData2 = this.getWeiBtnRight(dataArr);
            // log(this.treeData2);
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    getYhRight(code) {
      // 获取永洪的权限
      this.loading = true;
      this.ids3.splice(0, this.ids3.length);
      this.withoutParents3.splice(0, this.withoutParents3.length);
      this.getOtherRight(code);
    },
    getOtherRight(code) {
      postRequest('/api-admin/get-gic-role-right', {
        roleId: this.roleId,
        projectCode: code
      })
        .then(res => {
          let data = res.data;
          this.loading = false;
          if (data.errorCode == 0) {
            let _result = data.result.rightList ? data.result.rightList : [];
            _result.forEach((item, index) => {
              item.fold = false; // 是折叠还是打开
              item.childList = item.childList ? item.childList : [];
              item.childList.forEach((el, idx) => {
                el.childList = el.childList ? el.childList : [];
                if (el.childList.length > 0) {
                  el.foldBool = 1;
                }
              });
            });
            if (code == 'yh-bi') {
              this.treeData3 = _result;
            } else {
              // 其他为gic
              this.treeData1 = _result;
              this.treeData1.forEach((item, index) => {
                if (item.rightId == 'gic-web') {
                  // 隐藏商户后台 gic-web, 若ids1不为空，则传
                  this.treeData1.splice(index, 1);
                  this.gicWebObj = {};
                  this.gicWebObj.rightId = item.rightId;
                  this.gicWebObj.rightCode = item.rightCode;
                  this.gicWebObj.rightType = item.rightType;
                }
              });
            }
            // log(this.treeData1);
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    getWeiBtnRight(arr) {
      // 微盟的 按钮 拼接到菜单上
      arr.forEach(item => {
        item.childList = item.childList ? item.childList : [];
        if (item.buttonList) {
          item.buttonList.forEach(el => {
            el.btn = 1;
            item.childList.unshift(el);
          });
        }
        if (item.childList) {
          this.getWeiBtnRight(item.childList);
        }
      });
      return arr;
    },
    toInput(value, e) {
      this.ruleForm.name = strLength.getByteVal(e.target.value, this.inputLength);
      this.inputNum = strLength.getZhLen(this.ruleForm.name);
    },
    getRightObj(arr, ids) {
      // 选择权限获取id之后 转为需要的对象
      ids.forEach(item => {
        arr.forEach(el => {
          if (item == el.rightId) {
            let obj = {};
            obj.rightId = el.rightId;
            obj.rightCode = el.rightCode;
            obj.rightType = el.rightType;
            this.rightArr.push(obj);
            if (el.childList) {
              this.getRightObj(el.childList, ids);
            }
          }
        });
      });
      return this.rightArr;
    },
    getRightIds(arr) {
      // 编辑时 hasRight为1 选中的权限 选中的权限的ids
      arr.forEach(item => {
        item.childList = item.childList ? item.childList : [];
        if (item.hasRight == 1) {
          if (item.childList.length < 1) {
            this.ids.push(item.rightId);
          }
          if (item.childList) {
            this.getRightIds(item.childList);
          }
        }
      });
      return this.ids;
    },
    saveBtn(formName) {
      // 保存
      if (!this.ruleForm.name) {
        this.$message.error('请输入角色名称');
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let rightArr = [];
          if (this.apply == 'gic') {
            this.ids1 = this.$refs.tree1.getCheckedKeys().concat(this.$refs.tree1.getHalfCheckedKeys());
            rightArr = this.getRightObj(this.treeData1, this.ids1);
            if (rightArr.length > 0) {
              rightArr.push(this.gicWebObj);
            }
          } else if (this.apply == 'wm-mall') {
            this.ids2 = this.$refs.tree2.getCheckedKeys().concat(this.$refs.tree2.getHalfCheckedKeys());
            rightArr = this.getRightObj(this.treeData2, this.ids2);
            if (rightArr.length < 1) {
              this.$message.error('请选择权限');
              return;
            }
          } else if (this.apply == 'yh-bi') {
            this.ids3 = this.$refs.tree3.getCheckedKeys().concat(this.$refs.tree3.getHalfCheckedKeys());
            rightArr = this.getRightObj(this.treeData3, this.ids3);
            if (rightArr.length < 1) {
              this.$message.error('请选择权限');
              return;
            }
          }
          let result = [];
          let obj = {};
          for (let i = 0; i < rightArr.length; i++) {
            if (!obj[rightArr[i].rightId]) {
              result.push(rightArr[i]);
              obj[rightArr[i].rightId] = true;
            }
          }
          this.axios
            .post(
              '/api-admin/save-middle-role?requestProject=gic-web',
              {
                roleId: this.roleId,
                roleName: this.ruleForm.name,
                roleType: '3',
                lowRoleId: '',
                rightList: result,
                projectCode: this.apply,
                thirdProjectStoreId: this.store,
                thirdProjectStoreName: this.storeName
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
            })
            .catch(function(error) {
              log(error);
            });
        } else {
          log('error submit!!');
          return false;
        }
      });
    }
  },
  components: {
    breadCrumb,
    elNewTree
  }
};
</script>

<style lang="less" scoped>
.index-content {
  position: relative;
}
.content-content {
  padding: 30px 20px;
}
.demo-ruleForm {
  padding-bottom: 12px;
  border-bottom: 1px solid #dcdfe6;
}
.right-config {
  font-size: 14px;
  .title {
    line-height: 50px;
    color: #262626;
    font-weight: 500;
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
/*  权限设置 */
.account-limit-wrap {
  font-size: 14px;
  .limit-item {
    display: flex;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-bottom: 10px;
    .fl-item {
      flex: 0 0 225px;
      width: 225px;
      background: rgb(246, 246, 246);
      border-right: 1px solid #dcdfe6;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
      .opr-icon {
        color: #919191;
        font-size: 13px;
        padding: 6px 3px 3px;
        margin-right: 12px;
        cursor: pointer;
      }
    }
    .fr-item {
      flex: 1;
      width: 100%;
      color: #595959;
      .item-title {
        height: 45px;
        line-height: 45px;
        padding-left: 20px;
        font-weight: 500;
        background: rgb(246, 246, 246);
      }
    }
  }
}
.item-wrap:not(:last-child) {
  border-bottom: 1px solid #dcdfe6;
}
.item-content {
  background: #fff;
  border-top: 1px solid #dcdfe6;
  padding: 0px 30px 0px 50px;
  .first {
    line-height: 22px;
    margin-bottom: 8px;
  }
  .has-second {
    padding-right: 30px;
    .first {
      line-height: 45px;
      height: 45px;
      border-bottom: 1px solid #dcdfe6;
      margin-bottom: 0;
      color: #262626;
    }
    .second {
      padding: 10px 20px;
      p {
        line-height: 22px;
        // margin-bottom: 8px;
        width: 140px;
        color: #595959;
        display: inline-block;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
.fr-item-fold {
  background: #f6f6f6;
  line-height: 45px;
  height: 45px;
  font-size: 14px;
  color: #595959;
  padding: 0 20px;
  span:not(:last-child) {
    padding-right: 35px;
  }
}
.item-content .item:last-child .first {
  margin-bottom: 13px;
}
.item-content .item:first-child .first {
  margin-top: 13px;
}
.item-content .item:last-child .has-second .first {
  margin-bottom: 0;
}
.item-content .item:first-child .has-second .first {
  margin-top: 0;
}
.save-btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #fff;
  z-index: 2;
  border-top: 1px solid #dcdfe6;
}
.edit-input /deep/ .el-input__inner {
  padding-right: 45px;
}
.second /deep/ .el-checkbox {
  display: block;
  margin-left: 0;
}
.content-content /deep/ .el-input__inner {
  width: 360px;
}
.content-content .select-right /deep/ .el-input__inner {
  width: 180px;
  height: 32px !important;
}
</style>
