<template>
  <div class="select-shop-wrap">
    <el-select v-model="value" @change="selectShop" placeholder="请选择" class="select-shop fl">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
    </el-select>

    <div v-show="value == '1'" class="all-style-wrap fl">
      <el-popover class="vertical-baseline" popper-class="store-group-wrap" placement="bottom-start" trigger="click" v-model="showShopTree">
        <div class="select-shop select-shop-rt" slot="reference">{{ shopGroupValue }}</div>
        <div class="select-shop-url-wrap" :class="{ 'group-top-318': groupTopBool }">
          <div class="shop-tree-wrap">
            <el-tree ref="shopGroupTree" :data="dataObj" show-checkbox default-expand-all :default-checked-keys="keysArr" node-key="storeGroupId" highlight-current :props="defaultProps"> </el-tree>
          </div>
          <div class="select-group-btn">
            <el-row>
              <el-button @click.prevent.stop="hideTree" type="text" size="small" style="color:#303133">取消</el-button>
              <el-button @click.prevent.stop="groupBtnSure" type="text" size="small">确定</el-button>
            </el-row>
          </div>
        </div>
      </el-popover>
    </div>
    <div v-show="value == '2'" class="all-style-wrap fl">
      <el-popover class="vertical-baseline" placement="bottom-start" trigger="click" v-model="showSearchList">
        <div class="select-shop el-input dm-store__reference select-shop-total" slot="reference">
          <div class="select-shop-selected">
            <el-tag size="small" v-for="(item, index) in selecDataName" :key="index" @close="removeData(index)" closable>{{ item }}</el-tag>
          </div>
          <el-popover placement="top-start" popper-class="select-shop__popper" width="300" trigger="hover">
            <el-tag v-for="(item, index) in selecDataName" class="dm-store__total--tag" size="small" :key="index" closable @close="removeData(index)">{{ item }}</el-tag>
            <span slot="reference" class="total-tip" v-show="selecDataName.length">共{{ selecDataName.length }}项</span>
          </el-popover>
        </div>

        <div class="select-shop-url-wrap search-shop-wrap">
          <div class="search-shop-input">
            <el-input @keyup.enter.native="getSearchData(searchValueList)" class="input-name" prefix-icon="el-icon-search" size="small" clearable v-model="searchValueList" placeholder="输入搜索内容"></el-input>
          </div>
          <div class="search-shop-list">
            <ul v-if="selectList.length > 0">
              <li @click.prevent.stop="selectShopSuccess(list, index)" :key="index" v-for="(list, index) in selectList">
                <span>{{ list.storeName }}</span>
              </li>
            </ul>
            <p v-else class="no-data">无搜索内容</p>
            <p class="search-list-tip">最多显示5条数据</p>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
let qs = require('qs');
export default {
  name: 'select_shop_tree',
  props: {
    msg: {
      type: Object
    },
    groupTopBool: {
      type: Boolean,
      default: false
    },
    storeTopBool: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [
        {
          value: '0',
          label: '所有门店'
        },
        {
          value: '1',
          label: '门店分组'
        },
        {
          value: '2',
          label: '部分门店'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'storeGroupName'
      },
      value: '0',
      dataObj: [],
      showShopTree: false, // 显示门店的树级结构
      showSearchList: false, // 显示部分门店的搜索结果
      shopGroupValue: '已选择0个门店分组',
      searchShop: '',
      searchValue: '', // 部分门店
      searchValueList: '', // 部分门店的下拉框的搜索值
      searchOptions: [],
      selectList: [],
      selecData: [],
      selecData2: [],
      selecDataName: [],
      selecDataId: [],
      selectListId: [], // 选中的门店的id
      selectListGroupId: [],
      keysArr: [], // 默认选中的门店分组
      sendGroupObj: {},
      sendStoreObj: {},

      storeList: [] // 店员管理 -- 企业部门 -- 编辑企业成员
    };
  },
  watch: {
    msg(oldVal, newVal) {
      // log(oldVal);
      this.init(oldVal);
    }
  },
  created() {
    // log(this.msg);
    this.init(this.msg);
  },
  mounted() {
    this.getGroupTreeData(); // 获得门店分组的数据
  },
  methods: {
    init(dataObj) {
      // 初始化
      // log(dataObj);
      // if(dataObj.storeList){
      // 	if(dataObj.storeList.length>0){
      // 		this.selecData = dataObj.storeList
      // 	}
      // }
      if (dataObj.storeType) {
        this.value = dataObj.storeType.toString();
        if (this.value == '1') {
          this.selecDataName.splice(0, this.selecDataName.length); // 清除部分门店的默认显示
          this.keysArr.splice(0, this.keysArr.length); // 清除门店分组的默认显示
          this.shopGroupValue = '已选择' + dataObj.storeGroupIds.split(',').length + '个门店分组';
          dataObj.storeGroupIds.split(',').forEach(item => {
            this.keysArr.push(item);
          });
          this.selecData = [];
          if (!dataObj.storeList) {
            let arr = [];
            dataObj.storeGroupIds.split(',').forEach(item => {
              let arrObj = {};
              arrObj.storeGroupId = item;
              arrObj.storeId = null;
              arr.push(arrObj);
            });
            this.selecData = arr;
          } else {
            if (dataObj.storeList.length > 0) {
              this.selecData = dataObj.storeList;
            }
          }
          this.sendGroupObj.storeGroupIds = dataObj.storeGroupIds;
          this.sendGroupObj.storeIds = '';
          this.sendGroupObj.storeType = this.value;
          this.sendGroupObj.storeList = dataObj.storeList;
          // this.getGroupTreeData();		// 更改默认分组的显示，即this.keysArr，要刷新一遍才会更新
        } else if (this.value == '2') {
          this.keysArr.splice(0, this.keysArr.length);
          this.shopGroupValue = '已选择0个门店分组';
          this.selecDataName.splice(0, this.selecDataName.length);
          dataObj.storeName.split(',').forEach(item => {
            this.selecDataName.push(item);
          });
          this.selectListId.splice(0, this.selectListId.length);
          dataObj.storeIds.split(',').forEach(item => {
            this.selectListId.push(item);
          });
          this.selecData2 = [];
          if (!dataObj.storeList) {
            let arr = [];
            dataObj.storeIds.split(',').forEach(item => {
              let arrObj = {};
              arrObj.storeGroupId = null;
              arrObj.storeId = item;
              arr.push(arrObj);
            });
            this.selecData2 = arr;
          } else {
            if (dataObj.storeList.length > 0) {
              this.selecData2 = dataObj.storeList;
            }
          }
          this.sendStoreObj.storeType = this.value;
          this.sendStoreObj.storeGroupIds = dataObj.storeGroupIds;
          this.sendStoreObj.storeIds = dataObj.storeIds;
          this.sendStoreObj.storeList = dataObj.storeList;
        } else if (this.value == '0') {
          this.keysArr.splice(0, this.keysArr.length); // 清除门店分组的默认显示
          // this.keysArr=[];
          this.selecDataName.splice(0, this.selecDataName.length);
          this.selectListId.splice(0, this.selectListId.length);

          this.keysArr.splice(0, this.keysArr.length);
          this.shopGroupValue = '已选择0个门店分组';
        }
        // log(this.sendStoreObj);
        this.getGroupTreeData();
      }
    },
    getGroupTreeData() {
      this.axios
        .get('/api-admin/store-group-list', {
          params: {
            requestProject: 'middle-ground'
          }
        })
        .then(res => {
          let data = res.data;
          // log(data);
          if (data.errorCode == 0) {
            this.dataObj = data.result;
          } else {
            this.$message.error(data.message);
          }
        });
    },
    getSearchData(val) {
      // 部分门店的查询
      if (val) {
        this.axios
          .post(
            '/api-plug/query-store-by-code-name',
            qs.stringify({
              requestProject: 'middle-ground',
              searchParam: this.searchValueList,
              selectedIds: this.selectListId.join(','),
              flag: '1'
            })
          )
          .then(res => {
            let data = res.data;
            // log(data);
            if (data.errorCode == 0) {
              this.selectList = data.result;
            } else {
              this.$message.error(data.message);
            }
          });
      }
    },
    selectShop(val) {
      // 选择门店
      this.showShopTree = false;
      this.showSearchList = false;

      let obj = {};
      obj.storeType = parseInt(val); // 参与门店
      if (val == '0') {
        obj.storeGroupIds = '';
        obj.storeIds = '';
        this.$emit('sendSelectGroupData', obj); // 发送给父组件，告诉选中的是哪个
      } else if (val == '1') {
        this.sendGroupObj.storeType = parseInt(val);
        this.$emit('sendSelectGroupData', this.sendGroupObj);
      } else if (val == '2') {
        this.sendStoreObj.storeType = parseInt(val);
        this.$emit('sendSelectGroupData', this.sendStoreObj);
      }
    },
    toggleShopTree() {
      // 门店分组的树结构  1
      this.showShopTree = !this.showShopTree;
    },
    groupBtnSure() {
      // 选择门店分组的确定按钮
      this.showShopTree = false;
      let storeGroupList = this.$refs.shopGroupTree.getCheckedKeys();
      let len = storeGroupList.length; // elementUI 里的函数方法
      let groupIds = storeGroupList.join(',');
      let arr = [];
      storeGroupList.forEach(item => {
        let arrObj = {};
        arrObj.storeGroupId = item;
        arrObj.storeId = null;
        arr.push(arrObj);
      });
      this.shopGroupValue = '已选择' + len + '个门店分组';
      this.sendGroupObj = {};
      this.sendGroupObj.storeGroupIds = groupIds;
      this.sendGroupObj.storeIds = '';
      this.sendGroupObj.storeType = parseInt(this.value); // 参与门店
      this.sendGroupObj.storeList = arr;
      this.$emit('sendSelectGroupData', this.sendGroupObj); //  1
    },

    toggleSearchShop() {
      // 部分门店的树结构		--  自定义 2
      this.showSearchList = !this.showSearchList;
    },
    showSearchTree() {
      // 部分门店的搜索
      this.showSearchList = true;
    },
    hideSearch() {
      // 隐藏搜索结果框
      this.showSearchList = false;
    },
    hideTree() {
      this.showShopTree = false; // 门店分组
      this.showSearchList = false; // 部分门店
    },
    selectShopSuccess(list, index) {
      // 成功选择部分门店
      // log(list);
      // log(this.selecData2);
      this.selecData2.push(list);
      this.selecDataName.push(list.storeName);
      this.selectList.splice(index, 1);
      this.selectListId.push(list.storeId);
      this.selectListGroupId.push(list.storeGroupId);
      let arr = [];
      this.selecData2.forEach(item => {
        let arrObj = {};
        arrObj.storeGroupId = item.storeGroupId;
        arrObj.storeId = item.storeId;
        arr.push(arrObj);
      });
      this.sendStoreObj = {};
      this.sendStoreObj.storeType = parseInt(this.value);
      this.sendStoreObj.storeGroupIds = this.selectListGroupId.join(',');
      this.sendStoreObj.storeIds = this.selectListId.join(',');
      this.sendStoreObj.storeList = arr;
      this.$emit('sendSelectGroupData', this.sendStoreObj);
    },
    removeData(index) {
      // 移出部分门店
      // log(this.selecData2);
      this.selecData2.splice(index, 1);
      this.selecDataName.splice(index, 1);
      this.selectListId.splice(index, 1);
      this.selectListGroupId.splice(index, 1);
      let arr = [];
      this.selecData2.forEach(item => {
        let arrObj = {};
        arrObj.storeGroupId = item.storeGroupId;
        arrObj.storeId = item.storeId;
        arr.push(arrObj);
      });
      // log(arr);
      // log(this.selectListGroupId.join(','));
      this.sendStoreObj = {};
      this.sendStoreObj.storeType = parseInt(this.value);
      this.sendStoreObj.storeGroupIds = this.selectListGroupId.join(',');
      this.sendStoreObj.storeIds = this.selectListId.join(',');
      this.sendStoreObj.storeList = arr;
      // log(obj);
      this.$emit('sendSelectGroupData', this.sendStoreObj);
    }
  }
};
</script>

<style lang="less" scoped>
.select-shop {
  width: 175px;
  margin-right: 10px;
}
.all-style-wrap {
  width: 175px;
  position: relative;
  .search-input {
    width: 180px;
  }
  .select-shop {
    width: 173px;
    height: 32px;
    overflow: hidden;
    line-height: 1;
    font-size: 14px;
    color: #606266;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background: #fff;
    box-sizing: border-box;
    input {
      cursor: pointer;
      padding-left: 15px;
      box-sizing: border-box;
      width: 160px;
      height: 100%;
      color: #606266;
      padding-top: 7px;
    }
    .shop-style-icon {
      color: #c0c4cc;
      transition: all 0.3s;
      &.on {
        transform: rotate(-180deg);
      }
    }
  }
  .select-shop-rt {
    line-height: 30px;
    padding-left: 15px;
    cursor: pointer;
  }
}
.search-shop-input {
  padding: 10px 10px 0;
}
.store-group-wrap {
  position: relative;
}
.select-shop-url-wrap {
  width: 260px;
  max-height: 308px;
  position: absolute;
  top: -1px;
  left: -1px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 20;
  &.group-top-318 {
    top: -318px;
  }
  .shop-tree-wrap {
    padding: 10px;
    overflow: auto;
    max-height: 260px;
    border: 1px solid #e4e7ed;
    box-sizing: border-box;
    position: relative;
  }
  .select-group-btn {
    padding: 4px 15px;
    height: 36px;
    line-height: 25px;
    text-align: right;
    box-sizing: border-box;
  }
}
.select-shop-wrap {
  font-size: 0;
  /* 显示隐藏的动画 */
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.3s;
  }
  .slide-fade-enter, .slide-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(-10px);
  }
}
.select-shop-wrap /deep/ .select-shop-url-wrap .el-input__inner {
  width: 100%;
}
.select-shop-wrap /deep/ .select-shop-url-wrap .el-tree-node__content {
  height: 32px;
}
.all-style-wrap .select-shop .search-input-width {
  max-width: 80px;
  padding-left: 5px;
}
.select-shop {
  position: relative;
  .shop-style-icon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
}

.gic-tag-name {
  box-sizing: border-box;
  border-color: transparent;
  margin: 3px 0 2px 6px;
  background-color: #f0f2f5;
  height: 24px;
  padding: 2px 8px;
  line-height: 22px;
  color: #909399;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
  .dele-icon {
    padding-left: 5px;
    cursor: pointer;
  }
}
.search-shop-wrap {
  .search-shop-input {
    // padding: 10px 10px 0 10px;
  }
  .search-shop-list {
    .no-data {
      height: 34px;
      line-height: 34px;
      text-align: center;
      color: #606266;
    }
    ul {
      padding: 0 10px;
      li {
        font-size: 14px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #606266;
        height: 34px;
        line-height: 34px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          background-color: #f0f2f5;
        }
        &.on {
          color: #1890ff;
          background-color: #fff;
          font-weight: 700;
          &:after {
            position: absolute;
            right: 20px;
            font-family: element-icons;
            content: '\E611';
            font-size: 12px;
            font-weight: 700;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
      }
    }
  }
  .search-list-tip {
    font-size: 12px;
    background-color: #f6f8f9;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    color: #606266;
    box-sizing: border-box;
  }
}
.select-search-shop {
  font-size: 0;
  line-height: 1;
  display: inline-block;
  width: 125px;
  height: 32px;
  overflow: hidden;
  span {
    font-size: 12px;
  }
}

.select-shop-total {
  position: relative;
  padding-left: 6px;
  .total-tip {
    font-size: 12px;
    line-height: 32px;
    display: inline-block;
    vertical-align: top;
    position: absolute;
    right: 0;
    top: 0;
    background: #fff;
    padding: 0 6px;
  }
}
.select-shop-selected {
  padding-top: 3px;
  white-space: nowrap;
}
.el-tag {
  margin: 0 4px 4px 0;
}
.search-shop-input /deep/ input::-webkit-input-placeholder {
  font-size: 12px;
}
.search-shop-input /deep/ input::-moz-input-placeholder {
  font-size: 12px;
}
.search-shop-input /deep/ input::-ms-input-placeholder {
  font-size: 12px;
}
.shop-tree-wrap /deep/ .el-tree-node__label {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.select-group-btn /deep/ .el-row {
  padding-top: 5px;
}
</style>
