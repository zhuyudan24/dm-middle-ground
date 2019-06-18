<template>
  <div class="index-content">
    <bread-crumb v-if="navAddBool" :navpath="navpathadd" :navpathName="navpathNameadd"></bread-crumb>
    <bread-crumb v-else :navpath="navpath" :navpathName="navpathName"></bread-crumb>
    <div class="content-content-wrap">
      <div class="content-content">
        <el-form :model="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="ruleForm.name" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div class="three-wrap module-wrap">
          <div class="module-title"><span>应用服务</span></div>
          <div v-show="!navAddBool" class="three-content clearfix">
            <div class="fl img">
              <img src="../../../static/img/gic.png" alt="" />
            </div>
            <div class="fl three-info">
              <div class="three-info-item fl">
                <h2>GIC商户后台</h2>
                <p class="phone-wrap">
                  手机号码<span>{{ gicPhone }}</span>
                </p>
              </div>
            </div>
          </div>
          <div v-show="weiApplyList.length > 0" class="three-content clearfix" v-for="(itemList, index) in weiApplyList" :key="index">
            <div class="fl img">
              <img v-show="itemList[0].projectCode == 'wm-mall'" src="../../../static/img/marking.png" alt="" />
              <img v-show="itemList[0].projectCode == 'yh-bi'" src="../../../static/img/wxy.png" alt="" />
              <img v-show="itemList[0].projectCode == 'yueshi'" src="../../../static/img/jfsc.png" alt="" />
            </div>
            <div class="fl three-info ">
              <div class="three-info-item fl" v-for="(item, idx) in itemList" :key="item.createTime">
                <h2 v-show="item.projectCode == 'wm-mall'">{{ item.thirdProjectStoreName }}</h2>
                <h2 v-show="item.projectCode == 'yh-bi'">万象仪</h2>
                <h2 v-show="item.projectCode == 'yueshi'">福利中心</h2>
                <p class="phone-wrap">
                  手机号码<span>{{ item.phoneNumber }}</span
                  ><delete-tip @confirm="delWeiAccount(item.thirdProjectUserId, index, idx)" tips="确定删除该账号?">
                    <el-button type="text" style="margin-left:30px;">删除</el-button>
                  </delete-tip>
                </p>
              </div>
            </div>
          </div>
          <div class="add-apply-btn" @click="addAccount">
            <p class="add">+</p>
            <p class="add-text">新增账号</p>
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
          <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="100px" class="phone-ruleForm">
            <el-form-item label="手机号码" prop="phone">
              <el-input :disabled="phoneBool" v-model="ruleForm2.phone"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn('ruleForm2')">取 消</el-button>
        <el-button type="primary" @click="addAccountSave('ruleForm2')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import breadCrumb from '../../components/breadCrumb';
import { isvalidPhone } from '../../../static/js/validate';
import { log } from '@/utils/index.js';
import { getRequest, postRequest } from '@/api/api';
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
        },
        {
          name: '编辑用户',
          path: '/editUser'
        }
      ],
      navpathName: '编辑应用服务与账号',
      navpathadd: [
        {
          name: '用户管理',
          path: '/userManage'
        }
      ],
      navpathNameadd: '新增应用服务与账号',
      navAddBool: true,
      ruleForm: {
        name: ''
      },
      dialogVisible: false, // 新增账号
      applyList: [],
      newApplyList: [],
      // eslint-disable-next-line
      weiImg: require('../../../static/img/marking.png'),
      // eslint-disable-next-line
      wxyImg: require('../../../static/img/wxy.png'),
      // eslint-disable-next-line
      jfscImg: require('../../../static/img/jfsc.png'),
      applyName: '', // 应用名称  是否是微盟
      applyCode: '', // 应用code
      curIndex: 0,
      ruleForm2: {
        phone: '',
        store: ''
      },
      rules: {
        phone: [{ required: true, trigger: 'blur', validator: validPhone }]
      },
      options: [],
      thirdProjectStoreId: '', // 微盟门店id
      thirdProjectStoreName: '', // 微盟门店名称
      clerkId: '',
      gicPhone: '',
      weiApplyList: [], // 微盟账号列表

      errorStoreMsg: '请选择门店',
      errorStoreBool: false,
      phoneBool: false, // 福利中心  不能修改手机号
      yueshiPhone: ''
    };
  },
  computed: {},
  mounted() {
    this.getUrlData();
    this.getAllThree();
  },
  methods: {
    getUrlData() {
      // 获取路由传递的参数
      let type = this.$route.query.type;
      this.ruleForm.name = this.$route.query.name;
      this.clerkId = this.$route.query.clerkId ? this.$route.query.clerkId : '';
      this.gicPhone = this.$route.query.phone ? this.$route.query.phone : '';
      if (type == 'add') {
        // 新增
      } else if (type === 'edit') {
        this.navAddBool = false;
        this.getThreeCount();
        this.navpath[1].path = '/editUser?clerkId=' + this.clerkId;
      }
    },
    getAllThree() {
      // 获取所有的第三方应用
      let para = {};
      postRequest('/api-admin/list-all-project', para)
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.applyList = data.result ? data.result : [];
            this.newApplyList = data.result ? data.result : [];
            this.applyList.forEach(item => {
              if (item.code == 'wm-mall') {
                // 微盟
                item.img = this.weiImg;
              } else if (item.code == 'yh-bi') {
                // 万向仪
                item.img = this.wxyImg;
              } else if (item.code == 'yueshi') {
                // 万向仪
                item.img = this.jfscImg;
              }
            });
            this.applyName = this.applyList[0].name;
            this.applyCode = this.applyList[0].code;
            this.getWeiStore();
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
          this.$message.error(error.message);
        });
    },
    getWeiStore() {
      // 获取微盟的门店
      let para = {};
      getRequest('/api-admin/list-wm-store', para)
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.options = data.result ? data.result : [];
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
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
    getThreeCount() {
      // 获取第三方账号列表
      postRequest('/api-admin/list-project-user-byclerk', {
        clerkId: this.clerkId
      })
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.weiApplyList = data.result ? data.result : [];
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    cancelBtn(formName) {
      this.dialogVisible = false;
      this.errorStoreBool = false;
      this.$refs[formName].clearValidate();
    },
    addAccountSave(formName) {
      // 新增第三方的确定按钮
      let flag = true;
      if (this.applyCode == 'wm-mall' && this.thirdProjectStoreId == '') {
        this.errorStoreBool = true;
        flag = false;
      }
      if (this.applyCode == 'yueshi') {
        this.saveData();
      } else {
        this.$refs[formName].validate(valid => {
          if (valid && flag) {
            this.saveData();
          } else {
            log('error submit!!');
            return false;
          }
        });
      }
    },
    saveData() {
      this.axios
        .post(
          '/api-admin/save-third-project-user?requestProject=gic-web',
          {
            clerkId: this.clerkId,
            projectCode: this.applyCode,
            accountName: this.ruleForm.name,
            phoneNumber: this.ruleForm2.phone,
            thirdProjectStoreId: this.thirdProjectStoreId,
            thirdProjectStoreName: this.thirdProjectStoreName
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.dialogVisible = false;
            this.getThreeCount();
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    delWeiAccount(id, index, idx) {
      // 删除第三方账号
      postRequest('/api-admin/del-third-project-user', {
        thirdProjectUserId: id
      })
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.weiApplyList[index].splice(idx, 1);
            if (this.weiApplyList[index].length < 1) {
              this.weiApplyList.splice(index, 1);
            }
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    editGic() {
      // GIC商户后台  编辑
      this.dialogGicVisible = true;
    },
    addAccount() {
      // 新增账号
      this.dialogVisible = true;
      this.applyCode = 'wm-mall';
      this.applyName = '微盟微商城';
      this.phoneBool = false;
      this.ruleForm2.phone = '';
      this.ruleForm2.store = '';
      this.curIndex = 0;
      if (this.$refs.ruleForm2) {
        this.$refs.ruleForm2.clearValidate();
      }
      this.applyList = JSON.parse(JSON.stringify(this.newApplyList));
      let itemCodeArr = [];
      this.weiApplyList.forEach(item => {
        // 判断服务列表中是否有第三方应用，有则弹框中去掉
        if (item[0].projectCode == 'yueshi' || item[0].projectCode == 'yh-bi') {
          itemCodeArr.push(item[0].projectCode);
        }
      });
      this.applyList = this.applyList.filter(el => {
        return !(itemCodeArr.indexOf(el.code) > -1);
      });
      this.getYueshiPhone();
    },
    selectedApply(item, index) {
      // 选择应用
      this.$refs.ruleForm2.clearValidate();
      this.errorStoreBool = false;
      this.curIndex = index;
      this.applyName = item.name;
      this.applyCode = item.code;
      if (item.code == 'yueshi') {
        this.phoneBool = true;
        this.ruleForm2.phone = this.yueshiPhone;
      } else {
        this.phoneBool = false;
        this.ruleForm2.phone = '';
      }
    },
    getYueshiPhone() {
      // 获取福利中心的手机号
      let para = {};
      postRequest('/api-admin/get-superadmin-info', para)
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.yueshiPhone = data.result.phoneNumber; // 获取福利中心的手机号
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
          this.$message.error(error.message);
        });
    }
  },
  components: {
    breadCrumb
  }
};
</script>

<style lang="less" scoped>
.content-content {
  padding: 30px 0;
  min-height: 620px;
}
.module-wrap {
  margin-top: 35px;
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
.three-content {
  display: flex;
  color: #262626;
  font-size: 14px;
  margin-bottom: 20px;
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
      span {
        padding-left: 10px;
        display: inline-block;
        width: 100px;
      }
    }
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
.select-store-wrap {
  position: relative;
  .el-form-item__error {
    left: 65px;
  }
}
.three-info-item {
  width: 285px;
  margin-right: 80px;
  margin-bottom: 20px;
}
.content-content /deep/ .el-input__inner {
  width: 360px;
}
.phone-ruleForm /deep/ .el-input__inner {
  width: 240px;
}
.wei-wrap /deep/ .el-select .el-input__inner {
  width: 125px;
}
</style>
