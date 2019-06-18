<template>
  <div class="user-info-wrap" :class="{ 'index-user-info': isIndex }">
    <el-popover placement="bottom" title="" width="74" trigger="hover" :popper-class="isIndex ? 'user-header-pop' : 'com-user-header-pop'" style="min-width: 95px;">
      <ul class="navsuerwrap">
        <li class="useritem" @click="toModifyUser"><span class="usertext">账号信息</span></li>
        <li class="useritem" @click="toModifyPaw"><span class="usertext">修改密码</span></li>
        <li class="useritem loginout" @click="toLoginOut"><span class="usertext">退出登录</span></li>
      </ul>
      <span class="navusername" slot="reference">{{ userInfo.realName }}<i class="el-icon-arrow-down arrowico"></i><b v-show="isSuperAdmin">|</b></span>
    </el-popover>
    <span v-show="isSuperAdmin" style="margin-left:10px;cursor:pointer" @click="userManage">用户管理（{{ userListCount }}）</span>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="dialogPawVisible" width="385px" :show-close="false" :close-on-click-modal="false">
      <el-form :model="pawForm" :rules="rules" ref="pawForm" label-width="80px">
        <el-form-item label="旧密码" prop="oldPaw">
          <el-input v-model="pawForm.oldPaw"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPaw">
          <el-input v-model="pawForm.newPaw"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="surePaw">
          <el-input v-model="pawForm.surePaw"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toModifyPawCancel('pawForm')">取 消</el-button>
        <el-button type="primary" @click="toModifyPawSure('pawForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRequest, postRequest } from '@/api/api';
import { log } from '@/utils/index.js';
export default {
  name: 'userInfo',
  props: {
    isIndex: Boolean
  },
  data() {
    return {
      repProjectName: 'middle-ground',
      dialogPawVisible: false, // 修改密码
      pawForm: {
        oldPaw: '',
        newPaw: '',
        surePaw: ''
      },
      rules: {
        oldPaw: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPaw: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        surePaw: [{ required: true, message: '请输入确认密码', trigger: 'blur' }]
      },
      userInfo: {
        // 用户信息
        realName: '',
        gender: '', // 1男2女
        clerkCode: '',
        phoneNumber: '',
        positionName: ''
      },
      userListCount: 0, // 用户列表个数
      isSuperAdmin: false
    };
  },
  created() {
    this.getUserInfo();
    this.getUserList();
  },
  methods: {
    getUserInfo() {
      // 获取用户信息
      let para = {};
      getRequest('/api-auth/get-login-user-info', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.userInfo.realName = resData.result.realName;
            this.isSuperAdmin = resData.result.superAdmin == 1 ? true : false;
          } else {
            this.$message.error(resData.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    getUserList() {
      // 获取用户列表个数
      postRequest('/api-admin/list-middle-user', {
        search: '',
        currentPage: this.currentPage1,
        pageSize: 20
      })
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.userListCount = resData.result.totalCount;
          } else {
            this.$message.error(resData.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    toModifyPaw() {
      // 修改密码的弹框
      this.dialogPawVisible = true;
      this.pawForm.oldPaw = '';
      this.pawForm.newPaw = '';
      this.pawForm.surePaw = '';
    },
    toModifyPawCancel(formName) {
      // 修改密码弹框  取消
      this.dialogPawVisible = false;
      this.$refs[formName].clearValidate();
    },
    toModifyPawSure(formName) {
      // 修改密码弹框  确定
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = {
            oldPassword: this.pawForm.oldPaw,
            newPassword: this.pawForm.newPaw
          };
          if (!this.pawForm.oldPaw.trim() || !this.pawForm.newPaw.trim() || !this.pawForm.surePaw.trim()) {
            this.$message.error('请输入密码');
            return false;
          }
          if (this.pawForm.newPaw.trim() != this.pawForm.surePaw.trim()) {
            this.$message.error('两次密码输入不一致!');
            return false;
          }
          postRequest('/api-auth/modify-password', para)
            .then(res => {
              let data = res.data;
              if (data.errorCode == 0) {
                this.dialogPawVisible = false;
                this.$message.success('修改成功');
                getRequest('/api-auth/do-logout', {})
                  .then(res => {
                    let resData = res.data;
                    if (resData.errorCode == 0) {
                      window.location.href = window.location.origin + '/gic-web/#/';
                    } else {
                      this.$message.error(resData.message);
                    }
                  })
                  .catch(function(error) {
                    log(error);
                  });
                // window.location.href = window.location.origin + '/gic-web/#/';
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
    },
    toLoginOut() {
      // 退出登录
      let that = this;
      that
        .$confirm('确认退出吗?', '提示', {
          type: 'warning'
        })
        .then(() => {
          getRequest('/api-auth/do-logout', {})
            .then(res => {
              let resData = res.data;
              if (resData.errorCode == 0) {
                that.$message.success('退出成功');
                // let url = '//' + window.location.host + '/gic-web/#/';
                // window.open(url, '_blank');
                log(window.location.origin);
                window.location.href = window.location.origin + '/gic-web/#/';
              } else {
                that.$message.error(resData.message);
              }
            })
            .catch(function(error) {
              log(error);
            });
        })
        .catch(() => {});
    },
    userManage() {
      // 用户管理
      // let routeData = this.$router.resolve({ path: '/userManage'});
      // window.open(routeData.href, '_blank');
      this.$router.push('/userManage');
    },
    toModifyUser() {
      // 账户信息
      // let routeData = this.$router.resolve({ path: '/accountInfo'});
      // window.open(routeData.href, '_blank');
      this.$router.push('/accountInfo');
    }
  }
};
</script>

<style lang="less" scoped>
.user-info-wrap {
  font-size: 14px;
  color: #595959;
  display: inline-block;
  padding: 5px 0;
  .com-user-header-pop {
    width: 95px !important;
  }
  .navusername {
    color: #595959;
    i {
      margin: 0 15px 0 12px;
    }
    b {
      color: #ccc;
      vertical-align: top;
    }
    span {
      padding-left: 17px;
    }
    &:hover .arrowico {
      transform: rotate(180deg);
    }
    .arrowico {
      transition: all 0.5s;
    }
  }
}
.navsuerwrap .useritem span {
  color: #595959;
  line-height: 30px;
  &:hover {
    color: #262626;
  }
}
// 首页的用户信息
.index-user-info {
  &.user-info-wrap {
    color: #fff;
    .navusername {
      color: #fff;
      b {
        color: rgba(255, 255, 255, 0.52);
      }
    }
  }
}
.user-header-pop .navsuerwrap .useritem span {
  color: #fff;
  &:hover {
    color: #e3e3e3;
  }
}
</style>
