webpackJsonp([11],{"3RDD":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i("MOmO"),s=i.n(a),r={name:"page401",data:function(){return{errGif:s.a+"?"+ +new Date,ewizardClap:"https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646",dialogVisible:!1}},methods:{back:function(){this.$route.query.noGoBack?this.$router.push({path:"/"}):this.$router.go(-1)}}},n={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"errPage-container"},[i("el-button",{staticClass:"pan-back-btn",attrs:{icon:"arrow-left"},on:{click:t.back}},[t._v("返回")]),t._v(" "),i("el-row",[i("el-col",{attrs:{span:12}},[i("h1",{staticClass:"text-jumbo text-ginormous"},[t._v("Oops!")]),t._v("\n      页面\n      "),i("h2",[t._v("你没有权限去该页面")]),t._v(" "),i("h6",[t._v("如有不满请联系你领导")]),t._v(" "),i("ul",{staticClass:"list-unstyled"},[i("li",[t._v("或者你可以去:")]),t._v(" "),i("li",{staticClass:"link-type"},[i("router-link",{attrs:{to:"/index"}},[t._v("回首页")])],1),t._v(" "),i("li",{staticClass:"link-type"},[i("router-link",{attrs:{to:"/index"}},[t._v("回首页")])],1),t._v(" "),i("li",[i("a",{attrs:{href:"#"},on:{click:function(e){e.preventDefault(),t.dialogVisible=!0}}},[t._v("点我看图")])])])]),t._v(" "),i("el-col",{attrs:{span:12}},[i("img",{attrs:{src:t.errGif,width:"313",height:"428",alt:"Girl has dropped her ice cream."}})])],1),t._v(" "),i("el-dialog",{attrs:{title:"随便看",visible:t.dialogVisible},on:{"update:visible":function(e){t.dialogVisible=e}}},[i("img",{staticClass:"pan-img",attrs:{src:t.ewizardClap}})])],1)},staticRenderFns:[]};var l=i("C7Lr")(r,n,!1,function(t){i("jLQ+")},"data-v-04f5cca3",null);e.default=l.exports},MOmO:function(t,e,i){t.exports=i.p+"static/img/401.089007e.gif"},"jLQ+":function(t,e){}});