<template>
  <el-popover class="el-button el-button--text" placement="top" width="186" v-model="visible">
    <p class="tip-wrap"><i class="el-icon-error warning-icon"></i>{{ tips }}</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="confirm">确定</el-button>
    </div>
    <span slot="reference"><slot></slot></span>
  </el-popover>
</template>
<script>
export default {
  name: 'dm-delete',
  props: {
    tips: {
      type: String,
      default: '是否删除?'
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    cancel() {
      this.visible = false;
    },
    confirm() {
      this.visible = false;
      this.$emit('confirm');
    }
  }
};
</script>

<style lang="less" scoped>
.tip-wrap {
  line-height: 24px;
  padding: 0 10px 0 36px;
  margin: 10px 0 20px 0;
  color: #606266;
  position: relative;
}
.warning-icon {
  color: #f5222d;
  font-size: 24px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
</style>
