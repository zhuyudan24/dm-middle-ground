<template>
  <div class="navwrap">
    <el-breadcrumb separator="/">
      <span class="el-breadcrumb__item no-link link-active"><i class="iconfont icon-shouye"></i><router-link to="/index" class="el-breadcrumb__inner is-link">首页</router-link><span role="presentation" class="el-breadcrumb__separator">/</span></span>
      <el-breadcrumb-item class="no-link " :class="{ 'link-active': item.path != '' }" v-for="(item, index) in navpath" :key="index" :to="{ path: item.path }">{{ item.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <h1 class="navtitle">{{ navpathName }}</h1>
  </div>
</template>

<script>
export default {
  name: 'breadcrumb',
  data() {
    return {};
  },
  props: {
    navpath: {
      type: Array,
      default() {
        return [];
      }
    },
    navpathName: {
      type: String,
      default: ''
    }
  },
  methods: {}
};
</script>

<style scoped>
.navwrap {
  padding: 26px 30px 7px 30px;
  box-sizing: border-box;
}
.navtitle {
  margin: 10px 0 7px 0;
  font-size: 18px;
  color: #262626;
  font-weight: 400;
  line-height: 25px;
  padding-left: 20px;
}
.icon-shouye {
  font-size: 14px;
  padding-right: 6px;
}
.navmTop {
  margin-top: 25px;
}
.navtipcolor {
  margin: 0 12px;
  color: #1890ff;
}
.link-active /deep/ .el-breadcrumb__inner {
  cursor: pointer !important;
  color: #595959 !important;
}
.link-active /deep/ .el-breadcrumb__inner:hover {
  color: #1890ff !important;
}
.no-link /deep/ .el-breadcrumb__inner,
.no-link /deep/ .el-breadcrumb__inner:hover {
  font-weight: normal;
  cursor: text;
  color: #606266;
}
</style>
