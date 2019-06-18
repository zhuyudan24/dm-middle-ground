import 'babel-polyfill';
import es6promise from 'es6-promise';
es6promise.polyfill();
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import VueAxios from 'vue-axios';
import axios from 'axios';
import store from './store/store'; // 状态管理器 vuex

import '../static/css/public.css'; // 公用样式
import 'element-ui/lib/theme-chalk/index.css'; // elementUI的样式
import '../static/font/iconfont.css'; // iconfont
import '../theme/index.css'; // 新主题

// import { getRequest, postRequest, postJson, postJsonRequest } from './api/api'; // 封装请求
// Vue.prototype.getRequest = getRequest;
// Vue.prototype.postRequest = postRequest;
// Vue.prototype.postJsonRequest = postJsonRequest;
// Vue.prototype.postJson = postJson;

// 删除提示
import deleteTip from 'components/deleteTip';
Vue.component('delete-tip', deleteTip);

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueAxios, axios);

Vue.prototype.axios.withCredentials = true; // 跨域cookie访问

window.$bus = new Vue(); // 全局事件

// Vue.axios.defaults.baseURL =  process.env['NODE_ENV'] === 'development' ? 'http://gicdev.demogic.com' : 'https://hope.demogic.com/';
Vue.axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
Vue.axios.interceptors.response.use(
  response => {
    if (response.status == 200 && response.data.errorCode == 401) {
      // 加上登录页
      window.location.href = window.location.origin + '/gic-web/#/';
    }
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.href = window.location.origin + '/gic-web/#/';
      }
    }
    return Promise.reject(error.response.status.toString());
  }
);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
