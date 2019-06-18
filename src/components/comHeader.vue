<template>
  <div class="header clearfix">
    <div class="fl logo">
      <img src="../../static/img/logo.png" alt="" />
    </div>
    <div class="fr login-user-info">
      <comUserInfo></comUserInfo>
    </div>
  </div>
</template>

<script>
import comUserInfo from './comUserInfo';
export default {
  name: 'comHeader',
  data() {
    return {};
  },
  methods: {},
  components: {
    comUserInfo
  }
};
</script>

<style lang="less" scoped>
.header {
  height: 60px;
  background: #fff;
  box-shadow: 0px 2px 4px 0px rgba(241, 241, 241, 0.5);
  .logo {
    margin: 9px 0 0 28px;
  }
  .login-user-info {
    margin: 15px 25px 0 0;
  }
}
</style>
