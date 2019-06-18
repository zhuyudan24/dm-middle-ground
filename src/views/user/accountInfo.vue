<template>
  <div class="index-content">
    <breadCrumbBtn :navpath="navpath" :navpathName="navpathName" :navtab="navtab" @getCurTab="getCurTab"></breadCrumbBtn>
    <div class="content-content-wrap">
      <div class="content-content">
        <div v-if="activeitem == 0" class="account-info-wrap">
          <div class="title">GIC账号信息</div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="ruleForm.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="性别：">
              <el-radio-group v-model="ruleForm.sex" disabled>
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="员工代码：" prop="code">
              <el-input v-model="ruleForm.code" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：" prop="phone">
              <el-input v-model="ruleForm.phone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="职位：" prop="role">
              <el-input v-model="ruleForm.role" disabled></el-input>
            </el-form-item>
            <div v-show="threeAccountList.length > 0" class="title" style="margin-bottom:20px">第三方账户信息</div>
            <div v-show="threeAccountList.length > 0" class="three-content-wrap">
              <div class="three-content clearfix" v-for="(itemList, index) in threeAccountList" :key="index">
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
                      手机号码<span>{{ item.phoneNumber }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- <div class="add-apply-btn" @click="addAccount">
              <p class="add">+</p>
              <p class="add-text">新增账号</p>
            </div> -->

            <!-- <div class="save-btn">
              <el-button type="primary">保 存</el-button>
            </div> -->
          </el-form>
        </div>
        <div v-if="activeitem == 1" class="account-limit-wrap">
          <div class="account-limit-title clearfix">
            <p class="fl">账号权限信息</p>
            <div class="select-right fr">
              选择应用：<el-select @change="changeApply" v-model="apply" placeholder="请选择">
                <el-option v-for="item in options2" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </div>
          </div>
          <div class="right-wrap account-limit-wrap" v-loading="loading">
            <elNewTree v-if="gicBool" :data="treeData1" :onlyShow="onlyShow" show-checkbox ref="tree1" node-key="rightId" :default-checked-keys="withoutParents1" default-expand-all :props="defaultProps"> </elNewTree>

            <elNewTree v-if="weiBool" :data="treeData2" :onlyShow="onlyShow" show-checkbox ref="tree2" node-key="rightId" :default-checked-keys="withoutParents2" default-expand-all :props="defaultProps"> </elNewTree>

            <elNewTree v-if="wxyBool" :data="treeData3" :onlyShow="onlyShow" show-checkbox ref="tree3" node-key="rightId" :default-checked-keys="withoutParents3" default-expand-all :props="defaultProps"> </elNewTree>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增第三方应用账号 -->
    <el-dialog title="新增第三方应用账号" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" width="520px">
      <div class="add-account-wrap">
        <ul>
          <li @click="selectedApply(list, index)" v-for="(list, index) in applyList" :key="index">
            <div class="img"><img width="60" :src="list.img" alt="" /><i v-show="curIndex == index" class="iconfont el-icon-circle-check selected-img"></i></div>
            <p>{{ list.name }}</p>
          </li>
        </ul>
        <div class="apply-title wei-wrap clearfix">
          <p class="fl">填写账号信息-{{ applyName }}</p>
          <div v-show="applyCode == 'wm-mall'" class="select-store-wrap fr">
            门店选择：<el-select @change="changeStore" v-model="ruleForm2.store" placeholder="请选择门店">
              <el-option v-for="item in options" :key="item.wmStoreId" :label="item.name" :value="item.wmStoreId"> </el-option>
            </el-select>
            <div v-show="errorStoreBool" class="el-form-item__error">{{ errorStoreMsg }}</div>
          </div>
        </div>
        <div class="phone-wrap">
          <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="phone-ruleForm">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="ruleForm2.phone" type="number"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAccountSave('ruleForm2')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import breadCrumbBtn from '../../components/breadCrumbBtn';
import elNewTree from '../../components/tree/src/tree';
import { isvalidPhone } from '../../../static/js/validate';
import { getRequest, postRequest } from '@/api/api';
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
export default {
  name: 'index',
  data() {
    return {
      defaultProps: {
        children: 'childList',
        label: 'rightName'
      },
      navpath: [],
      navpathName: '账号信息',
      navtab: [
        {
          name: '账号信息',
          tab: 0
        },
        {
          name: '我的账号权限',
          tab: 1
        }
      ],
      activeitem: 0,
      ruleForm: {
        name: '',
        sex: 0,
        code: '4545',
        phone: '13148377788',
        role: '',
        weiPhone: '13148377788'
      },
      rules: {
        // name: [
        //   { required: true, message: '请输入姓名', trigger: 'blur' },
        // ],
        // role: [
        //   { required: true, message: '请输入职位', trigger: 'blur' },
        // ],
      },

      treeData: [],
      treeData1: [],
      treeData2: [],
      treeData3: [],
      ids: [],
      withoutParents: [],
      ids1: [], //包含父节点
      withoutParents1: [], //不包含父节点
      ids2: [], //包含父节点
      withoutParents2: [], //不包含父节点
      ids3: [], //包含父节点
      withoutParents3: [], //不包含父节点
      treeOptions: {
        withParents: false //是否包含父节点，如果为false,则要添加withoutParents这个参数，如果为true则不需要添加
      },

      options2: [], // 应用
      options3: [], // 门店
      apply: 'gic', // 选择应用

      threeAccountList: [],
      loading: false,

      dialogVisible: false,
      ruleForm2: {
        phone: '',
        store: ''
      },
      rules2: {
        phone: [{ required: true, trigger: 'blur', validator: validPhone }]
      },
      options: [],
      thirdProjectStoreId: '', // 微盟门店id
      thirdProjectStoreName: '', // 微盟门店名称
      clerkId: '',
      gicPhone: '',
      weiApplyList: [], // 微盟账号列表
      applyList: [],
      // eslint-disable-next-line
      weiImg: require('../../../static/img/marking.png'),
      applyName: '', // 应用名称  是否是微盟
      applyCode: '', // 应用code
      curIndex: 0,
      errorStoreMsg: '请选择门店',
      errorStoreBool: false,

      weiBool: false,
      gicBool: true,
      wxyBool: false,

      onlyShow: true
    };
  },
  computed: {},
  mounted() {
    this.getAccountInfo();
    this.getAllThree();
    this.getThreeApply();
  },
  methods: {
    getCurTab(val) {
      // 账号信息、我的账号权限的切换
      this.activeitem = val;
      if (val == 0) {
        // 账号信息
      }
      if (val == 1) {
        // 我的账号权限
        // this.getThreeApply();
      }
    },
    getAccountInfo() {
      // 获取账号信息
      postRequest('/api-admin/user-info', {})
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            let userInfo = data.result;
            this.ruleForm.name = userInfo.realName;
            this.ruleForm.sex = Number(userInfo.clerkGender);
            this.ruleForm.code = userInfo.clerkCode;
            this.ruleForm.phone = userInfo.phoneNumber;
            this.ruleForm.role = userInfo.positionName;
            // this.ruleForm.weiPhone = userInfo.realName;
            this.threeAccountList = userInfo.users ? userInfo.users : [];
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    addAccount() {
      // 新增账号
      this.dialogVisible = true;
    },
    selectedApply(item, index) {
      // 选择应用
      this.curIndex = index;
      this.applyName = item.name;
      this.applyCode = item.code;
    },
    getAllThree() {
      // 获取所有的第三方应用
      let para = {};
      postRequest('/api-admin/list-all-project', para)
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.applyList = data.result;
            this.applyList.forEach(item => {
              item.img = this.weiImg;
              if (item.code == 'wm_mall') {
                // 微盟
                this.thirdProjectStoreId = item.thirdProjectId;
                this.thirdProjectStoreName = item.name;
              }
            });
            this.applyName = this.applyList[0].name;
            this.applyCode = this.applyList[0].code;
            // log(this.applyCode);
            this.getWeiStore();
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    getWeiStore() {
      // 获取微盟的门店
      let para = {};
      getRequest('/api-admin/list-wm-store', para)
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.options = data.result;
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
          this.$message.error(error.message);
        });
    },
    changeStore(val) {
      // 改变微盟  门店
      this.errorStoreBool = false;
      this.thirdProjectStoreId = val;
      let obj = {};
      obj = this.options.find(item => {
        return item.wmStoreId === val; // 筛选出匹配数据  signageCode与选中的相等
      });
      this.thirdProjectStoreName = obj.name;
    },
    getThreeApply() {
      // 获取第三方应用
      this.options2 = [];
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
            this.getAccountRight();
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
          this.$message.error(error.message);
        });
    },
    changeApply(val) {
      // 切换第三方应用
      this.getAccountRight();
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
    getAccountRight() {
      // 获取账号权限
      this.loading = true;
      postRequest('/api-admin/user-right', {
        projectCode: this.apply
      })
        .then(res => {
          let data = res.data;
          this.loading = false;
          if (data.errorCode == 0) {
            let dataArr;
            dataArr = data.result.length > 0 ? data.result[0].rightList : [];
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
            this.ids.splice(0, this.ids.length);
            if (this.apply == 'gic') {
              this.treeData1 = this.getDisabledTree(dataArr);
              this.ids1.splice(0, this.ids1.length);
              this.withoutParents1.splice(0, this.withoutParents1.length);
              let ids = this.getRightIds(this.treeData1);
              ids.forEach(el => {
                this.withoutParents1.push(el);
                this.ids1.push(el);
              });
              this.gicBool = false;
              this.weiBool = false;
              this.wxyBool = false;
              this.$nextTick(_ => {
                this.gicBool = true;
              });
            } else if (this.apply == 'wm-mall') {
              let arr = this.getWeiBtnRight(dataArr);
              // log(arr);
              this.treeData2 = this.getDisabledTree(arr);
              this.ids2.splice(0, this.ids2.length);
              this.withoutParents2.splice(0, this.withoutParents2.length);
              let ids = this.getRightIds(this.treeData2);
              ids.forEach(el => {
                this.withoutParents2.push(el);
                this.ids2.push(el);
              });
              this.gicBool = false;
              this.weiBool = false;
              this.wxyBool = false;
              this.$nextTick(_ => {
                this.weiBool = true;
              });
            } else if (this.apply == 'yh-bi') {
              this.treeData3 = this.getDisabledTree(dataArr);
              this.ids3.splice(0, this.ids3.length);
              this.withoutParents3.splice(0, this.withoutParents3.length);
              let ids = this.getRightIds(this.treeData3);
              ids.forEach(el => {
                this.withoutParents3.push(el);
                this.ids3.push(el);
              });
              this.gicBool = false;
              this.weiBool = false;
              this.wxyBool = false;
              this.$nextTick(_ => {
                this.wxyBool = true;
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
    getDisabledTree(arr) {
      // 为每一项添加 disabled:true
      arr.forEach(item => {
        item.childList = item.childList ? item.childList : [];
        item.disabled = true;
        if (item.childList) {
          this.getDisabledTree(item.childList);
        }
      });
      return arr;
    },
    foldToggle(item, index) {
      // 手风琴的点击事件
      item.show = !item.show;
      this.rightList.forEach((list, i) => {
        if (item.show && i != index) {
          list.show = false;
        }
      });
    }
  },
  components: {
    breadCrumbBtn,
    elNewTree
  }
};
</script>

<style lang="less" scoped>
.content-content {
  padding: 0 20px 12px;
  // min-height: 620px;
}
.account-info-wrap {
  .title {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    color: #262626;
    font-weight: 500;
    border-bottom: 1px solid #dcdfe6;
  }
  .demo-ruleForm {
    padding: 30px 0 0 0;
  }
  .wei-form-item {
    padding-top: 40px;
  }
  .save-btn {
    margin: 35px 0 40px 0;
    text-align: center;
  }
}
.account-limit-wrap {
  padding-bottom: 24px;
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
.account-limit-title {
  line-height: 50px;
  color: #262626;
  font-weight: 500;
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
    }
    .second {
      padding: 10px 20px;
      p {
        line-height: 22px;
        margin-bottom: 8px;
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
      span {
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
.add-apply-btn {
  cursor: pointer;
  width: 60px;
  height: 60px;
  color: #bfbfbf;
  border: 1px dashed #bfbfbf;
  border-radius: 20px;
  text-align: center;
  &:hover {
    border-color: #1890ff;
  }
  .add {
    font-size: 20px;
    padding-top: 8px;
  }
  .add-text {
    font-size: 12px;
  }
}
.add-account-wrap {
  font-size: 13px;
  li {
    width: 80px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    p {
      color: #595959;
    }
    .img {
      position: relative;
      .selected-img {
        position: absolute;
        top: -3px;
        right: 4px;
        color: #1890ff;
        font-size: 20px;
        background: #fff;
        border-radius: 50%;
      }
    }
  }
  .apply-title {
    color: #262626;
    line-height: 32px;
    height: 32px;
    margin: 17px 0 20px 0;
    font-weight: 500;
  }
  .phone-wrap {
    background: rgb(247, 247, 247);
    border: 1px solid #dcdfe6;
    margin-bottom: 18px;
    border-radius: 4px;
  }
  .phone-ruleForm {
    padding-top: 18px;
  }
}
.select-store-wrap {
  position: relative;
  .el-form-item__error {
    left: 65px;
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
.content-content /deep/ .el-input__inner {
  width: 360px;
}
.content-content .select-right /deep/ .el-input__inner {
  width: 180px;
}
.phone-ruleForm /deep/ .el-input__inner {
  width: 240px;
}
.wei-wrap /deep/ .el-select .el-input__inner {
  width: 125px;
}

.content-content .account-limit-wrap /deep/ .el-tree-node__content > .el-checkbox {
  display: none;
}
</style>
