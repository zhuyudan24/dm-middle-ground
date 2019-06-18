<template>
  <div class="index-content">
    <div class="index-title">
      <div class="fr user-info-top">
        <comUserInfo :isIndex="isIndex"></comUserInfo>
      </div>
      <div class="logo-img">
        <img src="../../../static/img/index-logo.png" alt="logo" />
      </div>
    </div>
    <div class="select-application" v-loading="loading">
      <ul>
        <li @click="inGicApply" class="select-icon select-icon1">
          <div class="icon icon1">
            <img src="../../../static/img/icon1.png" alt="" />
          </div>
          <p class="on">GIC商户后台<b>|</b><span>进入应用</span></p>
        </li>
        <li @click="inWeiApply(item, item.status)" v-show="applyList.length > 0" class="select-icon select-icon2" v-for="(item, index) in applyList" :key="index">
          <div class="icon icon2">
            <img v-if="item.code == 'wm-mall'" src="../../../static/img/icon2.png" alt="" />
            <img v-if="item.code == 'yh-bi'" src="../../../static/img/icon3.png" alt="" />
          </div>
          <p v-if="item.status == 1" class="on">{{ item.name }}<b>|</b><span>进入应用</span></p>
          <p v-else>
            {{ item.name }}<b>|</b><span>{{ item.status == 2 ? '未授权' : '未绑定' }}</span>
          </p>
        </li>
      </ul>
    </div>
    <!-- 第三方授权 -->
    <el-dialog title="提示" class="dialog-save-wrap" :close-on-click-modal="false" :visible.sync="dialogVisible" width="480px">
      <div>
        <div class="img">
          <img src="../../../static/img/authorize-icon.png" alt="" />
        </div>
        <p>首次登录，请点击下方按钮完成第三方授权</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="goBind">点击完成微盟第三方授权</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import comUserInfo from '../../components/comUserInfo';
import { getRequest, postRequest } from '@/api/api';
import { log } from '@/utils/index.js';
export default {
  name: 'index',
  data() {
    return {
      isIndex: true,
      dialogVisible: false, // 第三方授权的弹框
      statusMsg: '未绑定',
      applyList: [], // 应用列表
      loading: false
    };
  },
  computed: {},
  mounted() {
    // this.getUserInfo()
    this.getWeiStatus();
  },
  methods: {
    getUserInfo() {
      // 获取登录信息
      getRequest('/api-auth/get-login-user-info', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.clerkId = resData.result.userId;
            this.getWeiStatus(this.clerkId);
          } else {
            this.$message.error(resData.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    getWeiStatus(id) {
      // 获得 第三方应用
      this.loading = true;
      postRequest('/api-admin/list-project-byclerk', {})
        .then(res => {
          let data = res.data;
          this.loading = false;
          if (data.errorCode == 0) {
            this.applyList = data.result ? data.result : [];
            this.applyList.forEach((item, index) => {
              if (item.status == 0) {
                this.applyList.splice(index, 1);
              }
            });
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    noBind(status) {
      // status = 2  未授权  去授权
      this.dialogVisible = true;
    },
    goBind() {
      // 授权
      postRequest('/api-admin/get-auth-url', {})
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            window.location.href = data.result;
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    allowWeiApply(code) {
      // status = 1  进入微盟  判断免密登录
      let href;
      if (code == 'wm-mall') {
        postRequest('/api-admin/get-nopwd-url', {}).then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            href = data.result;
          } else {
            this.$message.error(data.message);
          }
        });
      } else if (code == 'yh-bi') {
        postRequest('/api-admin/get-yh-bi-url', {}).then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            href = data.result;
          } else {
            this.$message.error(data.message);
          }
        });
      }
      window.timer = setTimeout(_ => {
        if (href) {
          window.open(href, '_blank');
        } else {
          clearTimeout(window.timer);
        }
      }, 500);
    },
    inWeiApply(item, status) {
      // 是否允许进入微盟
      if (item.code == 'wm-mall') {
        // 微盟
        if (status == 1) {
          this.allowWeiApply(item.code); // 进入 判断免密登录
        } else if (status == 2) {
          // 未授权
          this.noBind();
        }
      } else if (item.code == 'yh-bi') {
        // 永洪
        if (status == 1) {
          this.allowWeiApply(item.code); // 进入  判断免密登录
        }
      }
    },
    inGicApply() {
      // 进入GIC商户后台
      let url = '//' + window.location.host + '/report/#/memberSummary';
      window.open(url, '_blank');
    }
  },
  beforeDestroy() {
    // 组件销毁时清除定时器
    if (window.timer) {
      clearTimeout(window.timer);
    }
  },
  components: {
    comUserInfo
  }
};
</script>

<style lang="less" scoped>
.index-content {
  background: #fff;
}
.index-title {
  width: 100%;
  height: 370px;
  background: url(../../../static/img/index-bg.png) no-repeat center bottom;
  background-color: #04143a;
  position: relative;
  .user-info-top {
    padding: 18px 45px 0 0;
  }
}
.logo-img {
  text-align: center;
  padding-top: 127px;
}
.select-application {
  background: #fff;
  padding: 143px 0 40px 0;
  text-align: center;
  position: relative;
  &:before {
    content: '';
    width: 100%;
    height: 1px;
    position: absolute;
    top: 287px;
    left: 0;
    background: -webkit-linear-gradient(left, #fff 2%, #0092fe 50%, #fff 98%); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #fff 2%, #0092fe 50%, #fff 98%); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #fff 2%, #0092fe 50%, #fff 98%); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #fff 2%, #0092fe 50%, #fff 98%); /* 标准的语法 */
    z-index: 1;
  }
  ul {
    display: inline-block;
    margin: 0 auto;
    position: relative;
    z-index: 2;
    li {
      display: inline-block;
      .icon {
        width: 222px;
        height: 210px;
        background: url(../../../static/img/icon_bottom.png) no-repeat center bottom;
        background-size: 100% 129px;
        margin-bottom: 17px;
        img {
          width: 131px;
          height: 151px;
          transition: all 0.4s;
        }
      }
      p {
        width: 192px;
        height: 26px;
        font-size: 14px;
        border-radius: 13px;
        line-height: 26px;
        text-align: center;
        margin: 0 auto;
        background: #e7e7e7;
        b {
          padding: 0 10px;
        }
        span {
          cursor: pointer;
        }
      }
    }
    .select-icon {
      cursor: pointer;
    }
    .select-icon p {
      color: #414141;
      b,
      span {
        color: #a2a1a1;
      }
      span {
        cursor: pointer;
      }
    }
    p.on {
      color: #fff;
      background: #1483ff;
      b,
      span {
        color: #fff;
      }
    }
  }
}
.normal-ok {
  color: #fff;
  background: #1483ff;
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
.dialog-save-wrap /deep/ .el-dialog__header {
  display: none;
}
.icon1:hover img,
.icon2:hover img {
  margin-top: -15px;
}
.select-icon2 {
  margin-left: 158px;
}
</style>
