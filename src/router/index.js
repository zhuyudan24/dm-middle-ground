import Vue from 'vue';
import Router from 'vue-router';
import _import from './_import.js';
Vue.use(Router);

// 页面刷新时，重新赋值token
if (window.sessionStorage.getItem('token')) {
  // eslint-disable-next-line
  store.commit(types.LOGIN, window.sessionStorage.getItem('token'));
}

export const constantRouterMap = [
  {
    path: '/',
    name: '首页',
    component: _import('index', 'index')
  },
  {
    path: '/index',
    name: '首页',
    component: _import('index', 'index')
  },
  {
    path: '/index',
    name: 'index',
    component: _import('indexView', 'indexView'),
    children: [
      {
        path: '/accountInfo',
        name: '账号信息',
        component: _import('user', 'accountInfo')
      },

      {
        path: '/addUser',
        name: '新建用户',
        component: _import('user', 'addUser')
      },
      {
        path: '/editUser',
        name: '编辑用户',
        component: _import('user', 'editUser')
      },
      {
        path: '/userManage',
        name: '用户管理',
        component: _import('user', 'userManage')
      },
      {
        path: '/threeApply',
        name: '第三方应用账号',
        component: _import('user', 'threeApply')
      },

      {
        path: '/addRole',
        name: '新建角色',
        component: _import('role', 'addRole')
      },
      {
        path: '/threeBind',
        name: '第三方授权',
        component: _import('role', 'threeBind')
      }
    ]
  },

  {
    path: '/401',
    name: '无权访问',
    component: _import('error', '401')
  },
  {
    path: '/404',
    name: '不存在',
    component: _import('error', '404')
  },

  { path: '*', redirect: '/404', hidden: true }
];
export default new Router({
  routes: constantRouterMap
  // scrollBehavior: () => ({ y: 0 })

  //使用keep-alive标签后部分安卓机返回缓存页位置不精确问题
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition && to.meta.keepAlive) {
  //     return savedPosition;
  //   }
  //   const layoutRight = document.querySelector('.layout-right');
  //   if (layoutRight) {
  //     layoutRight.scrollTo(0,0);
  //   }
  // }
});
