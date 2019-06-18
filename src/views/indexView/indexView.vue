<template>
  <div id="index-wiew">
    <com-header></com-header>
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import comHeader from '../../components/comHeader';
export default {
  name: 'indexView',
  data() {
    return {};
  },
  computed: {},
  methods: {},
  components: {
    comHeader
  }
};
</script>

<style lang="less" scoped>
#index-wiew {
  min-height: 100%;
  background: rgb(247, 247, 247);
  padding-bottom: 30px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
