<template>
  <div class="index-content">
    <breadCrumbBtn :activeitem="activeitem" :navpath="navpath" :navpathName="navpathName" :navtab="navtab" @getCurTab="getCurTab"></breadCrumbBtn>
    <div class="content-content-wrap">
      <div class="content-content">
        <div v-show="activeitem == 0" class="user-list-wrap">
          <div class="search-wrap">
            <el-input @keyup.native.enter="searchUserList" class="search" placeholder="输入姓名/手机号码进行搜索" prefix-icon="el-icon-search" v-model="searchUser" clearable></el-input>
            <el-button type="primary" @click="addUser">新增用户</el-button>
          </div>
          <el-table :data="tableData1" style="width: 100%" v-loading="loading" class="table-no-line-wrap">
            <el-table-column prop="clerkName" label="姓名"> </el-table-column>
            <el-table-column prop="phoneNumber" label="手机号码"> </el-table-column>
            <el-table-column prop="roleName" label="角色" show-overflow-tooltip>
              <template slot-scope="scope">
                <p class="role-name">{{ scope.row.roleName ? scope.row.roleName : '--' }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="storeCount" label="管辖门店数" width="150"> </el-table-column>
            <el-table-column prop="opr" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" @click="resetPaw(scope.row)">重置密码</el-button>
                <el-button type="text" @click="editUser(scope.row.clerkId)">编辑</el-button>
                <delete-tip @confirm="deleteUser(scope.row.clerkId, scope.$index)" tips="确定删除该用户?">
                  <el-button type="text">删除</el-button>
                </delete-tip>
              </template>
            </el-table-column>
            <template slot="empty">
              <div class="no-data-wrap">
                <div class="no-data-icon">
                  <img src="../../../static/img/no-data_icon.png" alt="" />
                </div>
                <p>暂无数据</p>
              </div>
            </template>
          </el-table>
          <div class="pagination" v-show="totalCount1 > 0">
            <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange1" :page-size="20" :total="totalCount1"> </el-pagination>
          </div>
        </div>
        <div v-show="activeitem == 1" class="user-list-wrap">
          <div class="search-wrap">
            <el-input @keyup.native.enter="searchRoleList" class="search" placeholder="输入角色名称进行搜索" prefix-icon="el-icon-search" v-model="searchRole" clearable></el-input>
            <el-select @change="changeApply" v-model="projectCode" placeholder="请选择应用">
              <el-option v-for="item in applyList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
            </el-select>
            <el-button style="margin-left:16px;" type="primary" @click="addRole">新增角色</el-button>
          </div>
          <el-table :data="tableData2" style="width: 100%" v-loading="loading" class="table-no-line-wrap">
            <el-table-column prop="roleName" label="角色名称"> </el-table-column>
            <el-table-column prop="userCount" label="账号数量"> </el-table-column>
            <el-table-column prop="project" label="角色所属应用"> </el-table-column>
            <el-table-column prop="opr" label="操作" width="150">
              <template slot-scope="scope">
                <el-button @click="editRole(scope.row.roleId, scope.row.project)" type="text">编辑</el-button>
                <delete-tip @confirm="deleteRole(scope.row.roleId, scope.$index)" tips="确定删除该角色?">
                  <el-button type="text">删除</el-button>
                </delete-tip>
              </template>
            </el-table-column>
            <template slot="empty">
              <div class="no-data-wrap">
                <div class="no-data-icon">
                  <img src="../../../static/img/no-data_icon.png" alt="" />
                </div>
                <p>暂无数据</p>
              </div>
            </template>
          </el-table>
          <div class="pagination" v-show="totalCount2 > 0">
            <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange2" :page-size="20" :total="totalCount2"> </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadCrumbBtn from '../../components/breadCrumbBtn';
import { postRequest } from '@/api/api';
import { log } from '@/utils/index.js';
export default {
  name: 'index',
  data() {
    return {
      navpath: [],
      navpathName: '用户管理',
      navtab: [
        {
          name: '用户列表',
          tab: 0
        },
        {
          name: '角色列表',
          tab: 1
        }
      ],
      activeitem: 0,
      tableData1: [],
      tableData2: [],
      totalCount1: 0,
      totalCount2: 0,
      currentPage1: 1,
      currentPage2: 1,
      searchUser: '',
      searchRole: '',
      projectCode: '', // 第三方应用
      applyList: [],
      loading: false
    };
  },
  computed: {},
  mounted() {
    this.getSesionData();
  },
  methods: {
    getSesionData() {
      let activeitem = sessionStorage.getItem('activeitem');
      if (activeitem) {
        this.activeitem = parseInt(activeitem);
        if (this.activeitem == 0) {
          // 用户
          let userDataObj = JSON.parse(sessionStorage.getItem('userData'));
          if (userDataObj) {
            this.searchUser = userDataObj.searchUser;
            // this.currentPage1 = userDataObj.currentPage1;    //  分页
            this.getUserList();
          }
        } else {
          // 角色
          let roleDataObj = JSON.parse(sessionStorage.getItem('roleData'));
          if (roleDataObj) {
            this.searchRole = roleDataObj.searchRole;
            this.projectCode = roleDataObj.projectCode;
            // this.currentPage2 = userDataObj.currentPage2;    //  分页
            this.getAllThree();
            this.getRoleList();
          }
        }
      } else {
        this.getUserList();
      }
    },
    getCurTab(val) {
      // 用户、角色列表的切换
      this.activeitem = val;
      if (val == 0) {
        // 用户
        this.getUserList();
      }
      if (val == 1) {
        // 列表
        this.getAllThree();
        this.getRoleList();
      }
    },
    getUserList() {
      // 获取用户列表
      this.loading = true;
      let para = {
        search: this.searchUser,
        currentPage: this.currentPage1,
        pageSize: 20
      };
      postRequest('/api-admin/list-middle-user', para)
        .then(res => {
          let data = res.data;
          this.loading = false;
          if (data.errorCode == 0) {
            let tableData = data.result.result;
            if (tableData && tableData.length > 0) {
              this.tableData1 = tableData;
              this.totalCount1 = data.result.totalCount;
              // let userDataObj = JSON.parse(sessionStorage.getItem('userData'));
              // if (userDataObj){
              //   this.$nextTick(_ => {
              //     this.currentPage1 = userDataObj.currentPage1;    //  分页
              //   })
              // }
            } else {
              this.tableData1 = [];
              this.totalCount1 = 0;
            }
            sessionStorage.removeItem('userData');
            sessionStorage.removeItem('activeitem');
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    searchUserList() {
      // 搜索 用户
      this.currentPage1 = 1;
      this.getUserList();
    },
    deleteUser(id, index) {
      // 用户  删除
      let para = {
        clerkId: id
      };
      postRequest('/api-admin/del-middle-user', para)
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.$message.success('删除成功');
            this.totalCount1--;
            this.tableData1.splice(index, 1);
            if (this.tableData1.length == 0) {
              if (this.currentPage1 > 1) {
                this.currentPage1 = this.currentPage1 - 1;
                this.getUserList();
              }
            }
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    getAllThree() {
      // 获取所有的第三方应用
      let para = {};
      postRequest('/api-admin/list-all-project', para)
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.applyList = [
              {
                code: '',
                name: '所有应用'
              },
              {
                code: 'gic',
                name: 'GIC商户后台'
              }
            ];
            data.result.forEach(item => {
              if (item.code != 'yueshi') {
                this.applyList.push(item);
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
    getRoleList() {
      // 获取角色列表
      this.loading = true;
      let para = {
        search: this.searchRole,
        currentPage: this.currentPage2,
        pageSize: 20,
        projectCode: this.projectCode
      };
      postRequest('/api-admin/list-middle-role', para)
        .then(res => {
          let data = res.data;
          this.loading = false;
          if (data.errorCode == 0) {
            let tableData = data.result.result;
            if (tableData && tableData.length > 0) {
              this.tableData2 = tableData;
              this.totalCount2 = data.result.totalCount;
              // let roleDataObj = JSON.parse(sessionStorage.getItem('roleData'));
              // if (roleDataObj){
              //   this.$nextTick(_ => {
              //     this.currentPage2 = roleDataObj.currentPage2;    //  分页
              //   })
              // }
            } else {
              this.tableData2 = [];
              this.totalCount2 = 0;
            }
            sessionStorage.removeItem('roleData');
            sessionStorage.removeItem('activeitem');
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    searchRoleList() {
      // 搜索 角色
      this.currentPage2 = 1;
      this.getRoleList();
    },
    changeApply(val) {
      // 角色 切换 应用
      this.projectCode = val;
      this.currentPage2 = 1;
      this.getRoleList();
    },
    // 角色  删除
    deleteRole(id, index) {
      let para = {
        roleId: id
      };
      postRequest('/api-admin/delete-middle-role', para)
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.$message.success('删除成功');
            this.totalCount2--;
            this.tableData2.splice(index, 1);
            if (this.tableData2.length == 0) {
              if (this.currentPage2 > 1) {
                this.currentPage1 = this.currentPage1 - 1;
                this.getRoleList();
              }
            }
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(function(error) {
          log(error);
        });
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getUserList();
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.getRoleList();
    },
    addUser() {
      // 新增用户
      this.$router.push('/addUser');
    },
    editUser(id) {
      // 编辑用户
      this.$router.push({
        path: '/editUser',
        query: {
          clerkId: id
        }
      });
    },
    editRole(id, code) {
      // 编辑角色
      this.$router.push({
        path: '/addRole',
        query: {
          roleId: id,
          type: 1
        }
      });
    },
    addRole() {
      // 新增角色
      this.$router.push({
        path: '/addRole',
        query: {
          type: 1
        }
      });
    },
    resetPaw(row) {
      let html = '确认重置【' + row.clerkName + '】的密码？新生成的密码将以短信的方式发给该用户';
      this.$confirm(html, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      })
        .then(() => {
          let para = {
            userId: row.clerkId
          };
          postRequest('/api-admin/reset-middle-password', para)
            .then(res => {
              let data = res.data;
              if (data.errorCode == 0) {
                this.$message.success('重置密码成功');
              } else {
                this.$message.error(data.message);
              }
            })
            .catch(function(error) {
              log(error);
            });
        })
        .catch(() => {
          this.$message.info('已取消');
        });
    }
  },
  // 路由离开之前存储数据
  // 导航离开该组件的对应路由时调用
  // 可以访问组件实例 `this`
  // log(to,from,next)
  beforeRouteLeave(to, from, next) {
    let d = to;
    if (d.path == '/addRole') {
      let obj = {};
      obj.searchRole = this.searchRole; // 搜索值
      obj.projectCode = this.projectCode; //选择应用
      obj.currentPage2 = this.currentPage2; //  分页
      sessionStorage.setItem('activeitem', this.activeitem);
      sessionStorage.setItem('roleData', JSON.stringify(obj));
    } else if (d.path == '/addUser' || d.path == '/editUser') {
      let obj = {};
      obj.searchUser = this.searchUser; // 搜索值
      obj.currentPage1 = this.currentPage1; //  分页
      sessionStorage.setItem('activeitem', this.activeitem);
      sessionStorage.setItem('userData', JSON.stringify(obj));
    } else {
      sessionStorage.removeItem('activeitem');
    }
    next();
  },
  components: {
    breadCrumbBtn
  }
};
</script>

<style lang="less" scoped>
.content-content {
  padding: 20px 18px;
}
.user-list-wrap {
  .search-wrap {
    margin-bottom: 18px;
    .search {
      width: 400px;
      margin-right: 16px;
      display: inline-block;
    }
  }
}
.role-name {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
