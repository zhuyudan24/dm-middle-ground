webpackJsonp([5],{"95gy":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=s("3cXf"),o=s.n(r),i=s("ZmIX"),a=s("9Xge"),l=s("qopJ"),n=s("+PzL"),c=s("08dp"),h=s("P9l9"),u=s("0xDb"),p=(s("6iV/"),function(e,t,s){t?Object(c.b)(t)?s():s(new Error("请输入正确的11位手机号码")):s(new Error("请输入手机号码"))}),d={name:"index",data:function(){return{navpath:[{name:"用户管理",path:"/userManage"}],navpathName:"编辑用户",editGicForm:{name:"",sex:1,code:"",phone:"",role:"",store:"",paw:""},clerkId:"",gicRules:{name:[{required:!0,message:"请输入姓名",trigger:"blur"}],code:[{required:!0,message:"请输入员工代码",trigger:"blur"}],phone:[{required:!0,trigger:"blur",validator:p}],role:[{required:!0,message:"请输入职位",trigger:"blur"}]},thirdProjectUser:[],gicOptions:[],weiOptions:[],gicAccountRole:"",weiAccountRole:"",thirdProjectStoreId:"",roleName:"",sendChildData:{},storeType:"0",storeList:[],errorStoreMsg:"",errorStoreBool:!1,errorGicMsg:"",errorGicBool:!1,errorWeiBool:!1,sendChildData2:{},storeType2:"0",storeList2:[],errorRightMsg:"",errorRightBool:!1,loading:!1,inputNum1:0,inputLength1:10,inputNum2:0,inputLength2:20,inputNum3:0,inputLength3:20}},computed:{},mounted:function(){this.getUesrDetail()},methods:{getUesrDetail:function(){var e=this;this.loading=!0,this.clerkId=this.$route.query.clerkId;var t={clerkId:this.clerkId};Object(h.b)("/api-admin/middle-user-detail",t).then(function(t){var s=t.data;if(e.loading=!1,0==s.errorCode){var r=s.result.clerkInfo;if(e.editGicForm.name=r.clerkName,e.editGicForm.sex=Number(r.clerkGender),e.editGicForm.code=r.clerkCode,e.editGicForm.phone=r.phoneNumber,e.editGicForm.role=r.positionName,e.thirdProjectUser=s.result.thirdProjectUser?s.result.thirdProjectUser:[],e.inputNum1=n.a.getZhLen(e.editGicForm.name),e.inputNum2=n.a.getZhLen(e.editGicForm.code),e.inputNum3=n.a.getZhLen(e.editGicForm.role),s.result.role&&(e.gicAccountRole=s.result.role.roleId,e.roleName=s.result.role.roleName),e.storeType=r.storeMode,e.storeType2=r.cloudStoreMode,r.storeList.forEach(function(t,s){1==t.type?e.storeList.push(t):2==t.type&&e.storeList2.push(t)}),"1"==e.storeType){e.sendChildData={},e.sendChildData.storeType=e.storeType;var o="";e.storeList.forEach(function(e){o+=e.storeGroupId+","}),e.sendChildData.storeList=e.storeList,e.sendChildData.storeGroupIds=o.substring(0,o.length-1)}else if("0"==e.storeType)e.sendChildData={},e.sendChildData.storeType=e.storeType;else if("2"==e.storeType){e.sendChildData={},e.sendChildData.storeType=e.storeType;var i="",a="";e.storeList.forEach(function(e){i+=e.storeId+",",a+=e.storeName+","}),e.sendChildData.storeList=e.storeList,e.sendChildData.storeIds=i.substring(0,i.length-1),e.sendChildData.storeName=a.substring(0,a.length-1)}if("1"==e.storeType2){e.sendChildData2={},e.sendChildData2.storeType=e.storeType2;var l="";e.storeList2.forEach(function(e){l+=e.storeGroupId+","}),e.sendChildData2.storeList=e.storeList2,e.sendChildData2.storeGroupIds=l.substring(0,l.length-1)}else if("0"==e.storeType2)e.sendChildData2={},e.sendChildData2.storeType=e.storeType2;else if("2"==e.storeType2){e.sendChildData2={},e.sendChildData2.storeType=e.storeType2;var c="",h="";e.storeList2.forEach(function(e){c+=e.storeId+",",h+=e.storeName+","}),e.sendChildData2.storeList=e.storeList2,e.sendChildData2.storeIds=c.substring(0,c.length-1),e.sendChildData2.storeName=h.substring(0,h.length-1)}e.getGicRole()}else e.$message.error(s.message)}).catch(function(e){Object(u.a)(e)})},getGicRole:function(){var e=this;Object(h.b)("/api-admin/list-right-role",{}).then(function(t){var s=t.data;e.loading=!1,0==s.errorCode?e.gicOptions=s.result:e.$message.error(s.message)}).catch(function(e){Object(u.a)(e)})},getWeiRole:function(e){var t=this;Object(h.b)("/api-admin/list-middle-role-bystore",{thirdProjectStoreId:e}).then(function(e){var s=e.data;0==s.errorCode?t.weiOptions=s.result:t.$message.error(s.message)}).catch(function(e){Object(u.a)(e),this.$message.error(e.message)})},toInput1:function(e,t){this.editGicForm.name=n.a.getByteVal(t.target.value,this.inputLength1),this.inputNum1=n.a.getZhLen(this.editGicForm.name)},toInput2:function(e,t){this.editGicForm.code&&(this.editGicForm.code=n.a.getByteVal(t.target.value,this.inputLength2),this.inputNum2=n.a.getZhLen(this.editGicForm.code))},toInput3:function(e,t){this.editGicForm.role=n.a.getByteVal(t.target.value,this.inputLength3),this.inputNum3=n.a.getZhLen(this.editGicForm.role)},changeGicRole:function(e){this.gicAccountRole=e,this.gicAccountRole&&(this.errorGicBool=!1);var t;t=this.gicOptions.find(function(t){return t.roleId===e}),this.roleName=t.roleName},changeWeiRole:function(e,t){var s;s=t.roleList.find(function(t){return t.roleId===e}),t.thirdProjectRoleName=s.roleName},getSelectGroupData:function(e){this.storeType=e.storeType.toString(),this.storeList=e.storeList?e.storeList:[],this.storeList.length>0&&(this.errorStoreBool=!1),"0"==this.storeType&&(this.errorStoreBool=!1)},getSelectGroupData2:function(e){this.storeType2=e.storeType.toString(),this.storeList2=e.storeList?e.storeList:[],this.storeList2.length>0&&(this.errorRightBool=!1),"0"==this.storeType2&&(this.errorRightBool=!1)},saveUserBtn:function(e){var t=this,s=!0;"1"==this.storeType?this.storeList.length<1&&(this.errorStoreBool=!0,this.errorStoreMsg="请选择门店分组",s=!1):"2"==this.storeType&&this.storeList.length<1&&(this.errorStoreBool=!0,this.errorStoreMsg="请选择部分门店",s=!1),"1"==this.storeType2?this.storeList2.length<1&&(this.errorRightBool=!0,this.errorRightMsg="请选择门店分组",s=!1):"2"==this.storeType2&&this.storeList2.length<1&&(this.errorRightBool=!0,this.errorRightMsg="请选择部分门店",s=!1),""==this.gicAccountRole&&(this.errorGicBool=!0,this.errorGicMsg="请选择账号角色",s=!1),this.thirdProjectUser.forEach(function(e){e[0].thirdProjectRoleId||"yueshi"==e[0].projectCode||(t.errorWeiBool=!0,s=!1)}),this.$refs[e].validate(function(e){if(!e||!s)return Object(u.a)("error submit!!"),!1;var r=[];t.thirdProjectUser.forEach(function(e){var t=[];e.forEach(function(e){var s={};s.thirdProjectUserId=e.thirdProjectUserId,s.projectCode=e.projectCode,s.phoneNumber=e.phoneNumber,s.status=e.status,s.thirdProjectStoreId=e.thirdProjectStoreId,s.thirdProjectStoreName=e.thirdProjectStoreName,s.thirdProjectRoleId=e.thirdProjectRoleId,s.thirdProjectRoleName=e.thirdProjectRoleName,t.push(s)}),r.push(t)}),t.axios.post("/api-admin/update-middle-user?requestProject=gic-web",{clerkId:t.clerkId,clerkType:2,clerkName:t.editGicForm.name,clerkGender:t.editGicForm.sex,clerkCode:t.editGicForm.code,phoneNumber:t.editGicForm.phone,positionName:t.editGicForm.role,roleId:t.gicAccountRole,storeMode:t.storeType,storeList:t.storeList,cloudStoreMode:parseInt(t.storeType2),cloudStoreList:t.storeList2,resetPwd:t.editGicForm.paw,storeId:"",thirdProjectUser:o()(r)},{headers:{"Content-Type":"application/json"}}).then(function(e){var s=e.data;0==s.errorCode?(t.$message.success("保存成功"),t.$router.push("/userManage")):t.$message.error(s.message)})})},preBack:function(){this.$router.push("/userManage")},editApply:function(){this.$router.push({path:"/threeApply",query:{type:"edit",name:this.editGicForm.name,phone:this.editGicForm.phone,clerkId:this.clerkId}})}},components:{breadCrumb:i.a,selectShopTree:a.a,selectRightTree:l.a}},v={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"index-content"},[r("bread-crumb",{attrs:{navpath:e.navpath,navpathName:e.navpathName}}),e._v(" "),r("div",{staticClass:"content-content-wrap"},[r("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"content-content"},[r("div",{staticClass:"gic-web-wrap module-wrap"},[e._m(0),e._v(" "),r("div",{staticClass:"gic-web-content"},[r("el-form",{ref:"editGicForm",attrs:{model:e.editGicForm,rules:e.gicRules,"label-width":"100px"}},[r("el-form-item",{attrs:{label:"姓名：",prop:"name"}},[r("div",{staticClass:"edit-input"},[r("el-input",{staticClass:"input-input",nativeOn:{keyup:function(t){return e.toInput1(e.editGicForm.name,t)}},model:{value:e.editGicForm.name,callback:function(t){e.$set(e.editGicForm,"name",t)},expression:"editGicForm.name"}}),e._v(" "),r("span",{staticClass:"tag-name-num"},[e._v(e._s(e.inputNum1)+"/"+e._s(e.inputLength1))])],1)]),e._v(" "),r("el-form-item",{attrs:{label:"性别："}},[r("el-radio-group",{model:{value:e.editGicForm.sex,callback:function(t){e.$set(e.editGicForm,"sex",t)},expression:"editGicForm.sex"}},[r("el-radio",{attrs:{label:1}},[e._v("男")]),e._v(" "),r("el-radio",{attrs:{label:2}},[e._v("女")])],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"员工代码：",prop:"code"}},[r("div",{staticClass:"edit-input"},[r("el-input",{staticClass:"input-input",attrs:{disabled:!0},model:{value:e.editGicForm.code,callback:function(t){e.$set(e.editGicForm,"code",t)},expression:"editGicForm.code"}}),e._v(" "),r("span",{staticClass:"tag-name-num"},[e._v(e._s(e.inputNum2)+"/"+e._s(e.inputLength2))])],1)]),e._v(" "),r("el-form-item",{attrs:{label:"手机号码：",prop:"phone"}},[r("el-input",{attrs:{type:"number"},model:{value:e.editGicForm.phone,callback:function(t){e.$set(e.editGicForm,"phone",t)},expression:"editGicForm.phone"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"职位：",prop:"role"}},[r("div",{staticClass:"edit-input"},[r("el-input",{staticClass:"input-input",nativeOn:{keyup:function(t){return e.toInput3(e.editGicForm.role,t)}},model:{value:e.editGicForm.role,callback:function(t){e.$set(e.editGicForm,"role",t)},expression:"editGicForm.role"}}),e._v(" "),r("span",{staticClass:"tag-name-num"},[e._v(e._s(e.inputNum3)+"/"+e._s(e.inputLength3))])],1)]),e._v(" "),r("el-form-item",{staticClass:"is-required store-wrap",attrs:{label:"管辖门店：",prop:"store"}},[r("selectShopTree",{ref:"selectStoreTree",attrs:{msg:e.sendChildData},on:{sendSelectGroupData:e.getSelectGroupData}}),e._v(" "),e.errorStoreBool?r("div",{staticClass:"el-form-item__error"},[e._v(e._s(e.errorStoreMsg))]):e._e()],1),e._v(" "),r("el-form-item",{staticClass:"store-wrap",attrs:{label:"数据权限："}},[r("selectRightTree",{ref:"selectRightDataTree",attrs:{msg:e.sendChildData2},on:{sendSelectGroupData:e.getSelectGroupData2}}),e._v(" "),e.errorRightBool?r("div",{staticClass:"el-form-item__error"},[e._v(e._s(e.errorRightMsg))]):e._e()],1)],1)],1)]),e._v(" "),r("div",{staticClass:"three-wrap module-wrap"},[r("div",{staticClass:"module-title"},[r("span",[e._v("应用服务")]),r("el-button",{attrs:{type:"text"},on:{click:e.editApply}},[e._v("编辑")])],1),e._v(" "),r("div",{staticClass:"three-content clearfix"},[e._m(1),e._v(" "),r("div",{staticClass:"fl three-info"},[r("div",{staticClass:"three-info-item fl"},[r("h2",[e._v("GIC商户后台")]),e._v(" "),r("div",{staticClass:"phone-wrap"},[e._v("\n                手机号码"),r("span",{staticClass:"phone-number"},[e._v(e._s(e.editGicForm.phone))]),r("b",[e._v("|")]),e._v(" 账号角色："),r("el-select",{attrs:{placeholder:"请选择"},on:{change:e.changeGicRole},model:{value:e.gicAccountRole,callback:function(t){e.gicAccountRole=t},expression:"gicAccountRole"}},e._l(e.gicOptions,function(e){return r("el-option",{key:e.roleId,attrs:{label:e.roleName,value:e.roleId}})}),1),e._v(" "),e.errorGicBool?r("div",{staticClass:"el-form-item__error error-msg"},[e._v(e._s(e.errorGicMsg))]):e._e()],1)])])]),e._v(" "),e._l(e.thirdProjectUser,function(t,o){return r("div",{directives:[{name:"show",rawName:"v-show",value:e.thirdProjectUser.length>0,expression:"thirdProjectUser.length > 0"}],key:o,staticClass:"three-content clearfix"},[r("div",{staticClass:"fl img"},[r("img",{directives:[{name:"show",rawName:"v-show",value:"wm-mall"==t[0].projectCode,expression:"itemList[0].projectCode == 'wm-mall'"}],attrs:{src:s("CD1R"),alt:""}}),e._v(" "),r("img",{directives:[{name:"show",rawName:"v-show",value:"yh-bi"==t[0].projectCode,expression:"itemList[0].projectCode == 'yh-bi'"}],attrs:{src:s("Fr71"),alt:""}}),e._v(" "),r("img",{directives:[{name:"show",rawName:"v-show",value:"yueshi"==t[0].projectCode,expression:"itemList[0].projectCode == 'yueshi'"}],attrs:{src:s("4s/0"),alt:""}})]),e._v(" "),r("div",{staticClass:"fl three-info no-small-line"},e._l(t,function(t){return r("div",{key:t.createTime,staticClass:"three-info-item fl"},[r("h2",{directives:[{name:"show",rawName:"v-show",value:"wm-mall"==t.projectCode,expression:"item.projectCode == 'wm-mall'"}]},[e._v(e._s(t.thirdProjectStoreName))]),e._v(" "),r("h2",{directives:[{name:"show",rawName:"v-show",value:"yh-bi"==t.projectCode,expression:"item.projectCode == 'yh-bi'"}]},[e._v("万象仪")]),e._v(" "),r("h2",{directives:[{name:"show",rawName:"v-show",value:"yueshi"==t.projectCode,expression:"item.projectCode == 'yueshi'"}]},[e._v("福利中心")]),e._v(" "),r("div",{staticClass:"phone-wrap"},[e._v("\n                手机号码"),r("span",{staticClass:"phone-number"},[e._v(e._s(t.phoneNumber))]),r("b",{directives:[{name:"show",rawName:"v-show",value:"yueshi"!=t.projectCode,expression:"item.projectCode != 'yueshi'"}]},[e._v("|")]),e._v(" "),r("span",{directives:[{name:"show",rawName:"v-show",value:"yueshi"!=t.projectCode,expression:"item.projectCode != 'yueshi'"}]},[e._v("账号角色："),r("el-select",{attrs:{placeholder:"请选择"},on:{change:function(s){return e.changeWeiRole(t.thirdProjectRoleId,t)}},model:{value:t.thirdProjectRoleId,callback:function(s){e.$set(t,"thirdProjectRoleId",s)},expression:"item.thirdProjectRoleId"}},e._l(t.roleList,function(e){return r("el-option",{key:e.roleId,attrs:{label:e.roleName,value:e.roleId}})}),1),e._v(" "),e.errorWeiBool&&!t.thirdProjectRoleId?r("div",{staticClass:"el-form-item__error error-msg"},[e._v("请选择账号角色")]):e._e()],1)])])}),0)])})],2),e._v(" "),r("div",{staticClass:"two-btn"},[r("el-row",[r("el-button",{on:{click:e.preBack}},[e._v("返 回")]),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.saveUserBtn("editGicForm")}}},[e._v("保 存")])],1)],1)])])],1)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"module-title"},[t("span",[this._v("GIC商户后台")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"fl img"},[t("img",{attrs:{src:s("NxTf"),alt:""}})])}]};var m=s("C7Lr")(d,v,!1,function(e){s("UUeg")},"data-v-f2680410",null);t.default=m.exports},"9Lt3":function(e,t){},"9Xge":function(e,t,s){"use strict";var r=s("6iV/"),o={name:"select_shop_tree",props:{msg:{type:Object},groupTopBool:{type:Boolean,default:!1},storeTopBool:{type:Boolean,default:!1}},data:function(){return{options:[{value:"0",label:"所有门店"},{value:"1",label:"门店分组"},{value:"2",label:"部分门店"}],defaultProps:{children:"children",label:"storeGroupName"},value:"0",dataObj:[],showShopTree:!1,showSearchList:!1,shopGroupValue:"已选择0个门店分组",searchShop:"",searchValue:"",searchValueList:"",searchOptions:[],selectList:[],selecData:[],selecData2:[],selecDataName:[],selecDataId:[],selectListId:[],selectListGroupId:[],keysArr:[],sendGroupObj:{},sendStoreObj:{},storeList:[]}},watch:{msg:function(e,t){this.init(e)}},created:function(){this.init(this.msg)},mounted:function(){this.getGroupTreeData()},methods:{init:function(e){var t=this;if(e.storeType){if(this.value=e.storeType.toString(),"1"==this.value){if(this.selecDataName.splice(0,this.selecDataName.length),this.keysArr.splice(0,this.keysArr.length),this.shopGroupValue="已选择"+e.storeGroupIds.split(",").length+"个门店分组",e.storeGroupIds.split(",").forEach(function(e){t.keysArr.push(e)}),this.selecData=[],e.storeList)e.storeList.length>0&&(this.selecData=e.storeList);else{var s=[];e.storeGroupIds.split(",").forEach(function(e){var t={};t.storeGroupId=e,t.storeId=null,s.push(t)}),this.selecData=s}this.sendGroupObj.storeGroupIds=e.storeGroupIds,this.sendGroupObj.storeIds="",this.sendGroupObj.storeType=this.value,this.sendGroupObj.storeList=e.storeList}else if("2"==this.value){if(this.keysArr.splice(0,this.keysArr.length),this.shopGroupValue="已选择0个门店分组",this.selecDataName.splice(0,this.selecDataName.length),e.storeName.split(",").forEach(function(e){t.selecDataName.push(e)}),this.selectListId.splice(0,this.selectListId.length),e.storeIds.split(",").forEach(function(e){t.selectListId.push(e)}),this.selecData2=[],e.storeList)e.storeList.length>0&&(this.selecData2=e.storeList);else{var r=[];e.storeIds.split(",").forEach(function(e){var t={storeGroupId:null};t.storeId=e,r.push(t)}),this.selecData2=r}this.sendStoreObj.storeType=this.value,this.sendStoreObj.storeGroupIds=e.storeGroupIds,this.sendStoreObj.storeIds=e.storeIds,this.sendStoreObj.storeList=e.storeList}else"0"==this.value&&(this.keysArr.splice(0,this.keysArr.length),this.selecDataName.splice(0,this.selecDataName.length),this.selectListId.splice(0,this.selectListId.length),this.keysArr.splice(0,this.keysArr.length),this.shopGroupValue="已选择0个门店分组");this.getGroupTreeData()}},getGroupTreeData:function(){var e=this;this.axios.get("/api-admin/store-group-list",{params:{requestProject:"middle-ground"}}).then(function(t){var s=t.data;0==s.errorCode?e.dataObj=s.result:e.$message.error(s.message)})},getSearchData:function(e){var t=this;e&&this.axios.post("/api-plug/query-store-by-code-name",r.stringify({requestProject:"middle-ground",searchParam:this.searchValueList,selectedIds:this.selectListId.join(","),flag:"1"})).then(function(e){var s=e.data;0==s.errorCode?t.selectList=s.result:t.$message.error(s.message)})},selectShop:function(e){this.showShopTree=!1,this.showSearchList=!1;var t={};t.storeType=parseInt(e),"0"==e?(t.storeGroupIds="",t.storeIds="",this.$emit("sendSelectGroupData",t)):"1"==e?(this.sendGroupObj.storeType=parseInt(e),this.$emit("sendSelectGroupData",this.sendGroupObj)):"2"==e&&(this.sendStoreObj.storeType=parseInt(e),this.$emit("sendSelectGroupData",this.sendStoreObj))},toggleShopTree:function(){this.showShopTree=!this.showShopTree},groupBtnSure:function(){this.showShopTree=!1;var e=this.$refs.shopGroupTree.getCheckedKeys(),t=e.length,s=e.join(","),r=[];e.forEach(function(e){var t={};t.storeGroupId=e,t.storeId=null,r.push(t)}),this.shopGroupValue="已选择"+t+"个门店分组",this.sendGroupObj={},this.sendGroupObj.storeGroupIds=s,this.sendGroupObj.storeIds="",this.sendGroupObj.storeType=parseInt(this.value),this.sendGroupObj.storeList=r,this.$emit("sendSelectGroupData",this.sendGroupObj)},toggleSearchShop:function(){this.showSearchList=!this.showSearchList},showSearchTree:function(){this.showSearchList=!0},hideSearch:function(){this.showSearchList=!1},hideTree:function(){this.showShopTree=!1,this.showSearchList=!1},selectShopSuccess:function(e,t){this.selecData2.push(e),this.selecDataName.push(e.storeName),this.selectList.splice(t,1),this.selectListId.push(e.storeId),this.selectListGroupId.push(e.storeGroupId);var s=[];this.selecData2.forEach(function(e){var t={};t.storeGroupId=e.storeGroupId,t.storeId=e.storeId,s.push(t)}),this.sendStoreObj={},this.sendStoreObj.storeType=parseInt(this.value),this.sendStoreObj.storeGroupIds=this.selectListGroupId.join(","),this.sendStoreObj.storeIds=this.selectListId.join(","),this.sendStoreObj.storeList=s,this.$emit("sendSelectGroupData",this.sendStoreObj)},removeData:function(e){this.selecData2.splice(e,1),this.selecDataName.splice(e,1),this.selectListId.splice(e,1),this.selectListGroupId.splice(e,1);var t=[];this.selecData2.forEach(function(e){var s={};s.storeGroupId=e.storeGroupId,s.storeId=e.storeId,t.push(s)}),this.sendStoreObj={},this.sendStoreObj.storeType=parseInt(this.value),this.sendStoreObj.storeGroupIds=this.selectListGroupId.join(","),this.sendStoreObj.storeIds=this.selectListId.join(","),this.sendStoreObj.storeList=t,this.$emit("sendSelectGroupData",this.sendStoreObj)}}},i={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"select-shop-wrap"},[s("el-select",{staticClass:"select-shop fl",attrs:{placeholder:"请选择"},on:{change:e.selectShop},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}},e._l(e.options,function(e){return s("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:"1"==e.value,expression:"value == '1'"}],staticClass:"all-style-wrap fl"},[s("el-popover",{staticClass:"vertical-baseline",attrs:{"popper-class":"store-group-wrap",placement:"bottom-start",trigger:"click"},model:{value:e.showShopTree,callback:function(t){e.showShopTree=t},expression:"showShopTree"}},[s("div",{staticClass:"select-shop select-shop-rt",attrs:{slot:"reference"},slot:"reference"},[e._v(e._s(e.shopGroupValue))]),e._v(" "),s("div",{staticClass:"select-shop-url-wrap",class:{"group-top-318":e.groupTopBool}},[s("div",{staticClass:"shop-tree-wrap"},[s("el-tree",{ref:"shopGroupTree",attrs:{data:e.dataObj,"show-checkbox":"","default-expand-all":"","default-checked-keys":e.keysArr,"node-key":"storeGroupId","highlight-current":"",props:e.defaultProps}})],1),e._v(" "),s("div",{staticClass:"select-group-btn"},[s("el-row",[s("el-button",{staticStyle:{color:"#303133"},attrs:{type:"text",size:"small"},on:{click:function(t){return t.preventDefault(),t.stopPropagation(),e.hideTree(t)}}},[e._v("取消")]),e._v(" "),s("el-button",{attrs:{type:"text",size:"small"},on:{click:function(t){return t.preventDefault(),t.stopPropagation(),e.groupBtnSure(t)}}},[e._v("确定")])],1)],1)])])],1),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:"2"==e.value,expression:"value == '2'"}],staticClass:"all-style-wrap fl"},[s("el-popover",{staticClass:"vertical-baseline",attrs:{placement:"bottom-start",trigger:"click"},model:{value:e.showSearchList,callback:function(t){e.showSearchList=t},expression:"showSearchList"}},[s("div",{staticClass:"select-shop el-input dm-store__reference select-shop-total",attrs:{slot:"reference"},slot:"reference"},[s("div",{staticClass:"select-shop-selected"},e._l(e.selecDataName,function(t,r){return s("el-tag",{key:r,attrs:{size:"small",closable:""},on:{close:function(t){return e.removeData(r)}}},[e._v(e._s(t))])}),1),e._v(" "),s("el-popover",{attrs:{placement:"top-start","popper-class":"select-shop__popper",width:"300",trigger:"hover"}},[e._l(e.selecDataName,function(t,r){return s("el-tag",{key:r,staticClass:"dm-store__total--tag",attrs:{size:"small",closable:""},on:{close:function(t){return e.removeData(r)}}},[e._v(e._s(t))])}),e._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:e.selecDataName.length,expression:"selecDataName.length"}],staticClass:"total-tip",attrs:{slot:"reference"},slot:"reference"},[e._v("共"+e._s(e.selecDataName.length)+"项")])],2)],1),e._v(" "),s("div",{staticClass:"select-shop-url-wrap search-shop-wrap"},[s("div",{staticClass:"search-shop-input"},[s("el-input",{staticClass:"input-name",attrs:{"prefix-icon":"el-icon-search",size:"small",clearable:"",placeholder:"输入搜索内容"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getSearchData(e.searchValueList)}},model:{value:e.searchValueList,callback:function(t){e.searchValueList=t},expression:"searchValueList"}})],1),e._v(" "),s("div",{staticClass:"search-shop-list"},[e.selectList.length>0?s("ul",e._l(e.selectList,function(t,r){return s("li",{key:r,on:{click:function(s){return s.preventDefault(),s.stopPropagation(),e.selectShopSuccess(t,r)}}},[s("span",[e._v(e._s(t.storeName))])])}),0):s("p",{staticClass:"no-data"},[e._v("无搜索内容")]),e._v(" "),s("p",{staticClass:"search-list-tip"},[e._v("最多显示5条数据")])])])])],1)],1)},staticRenderFns:[]};var a=s("C7Lr")(o,i,!1,function(e){s("9Lt3")},"data-v-5bcf6eba",null);t.a=a.exports},"BZf+":function(e,t){},NxTf:function(e,t){e.exports="data:image/png;base64,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"},UUeg:function(e,t){},qopJ:function(e,t,s){"use strict";var r=s("6iV/"),o={name:"select_shop_tree",props:{msg:{type:Object},groupTopBool:{type:Boolean,default:!1},storeTopBool:{type:Boolean,default:!1}},data:function(){return{options:[{value:"0",label:"所有门店"},{value:"1",label:"门店分组"},{value:"2",label:"部分门店"}],defaultProps:{children:"children",label:"storeGroupName"},value:"0",dataObj:[],showShopTree:!1,showSearchList:!1,shopGroupValue:"已选择0个门店分组",searchShop:"",searchValue:"",searchValueList:"",searchOptions:[],selectList:[],selecData:[],selecData2:[],selecDataName:[],selecDataId:[],selectListId:[],selectListGroupId:[],keysArr:[],sendGroupObj:{},sendStoreObj:{},storeList:[]}},watch:{msg:function(e,t){this.init(e)}},created:function(){this.init(this.msg)},mounted:function(){this.getGroupTreeData()},methods:{init:function(e){var t=this;if(e.storeType){if(this.value=e.storeType.toString(),"1"==this.value){if(this.selecDataName.splice(0,this.selecDataName.length),this.keysArr.splice(0,this.keysArr.length),this.shopGroupValue="已选择"+e.storeGroupIds.split(",").length+"个门店分组",e.storeGroupIds.split(",").forEach(function(e){t.keysArr.push(e)}),this.selecData=[],e.storeList)e.storeList.length>0&&(this.selecData=e.storeList);else{var s=[];e.storeGroupIds.split(",").forEach(function(e){var t={};t.storeGroupId=e,t.storeId=null,s.push(t)}),this.selecData=s}this.sendGroupObj.storeGroupIds=e.storeGroupIds,this.sendGroupObj.storeIds="",this.sendGroupObj.storeType=this.value,this.sendGroupObj.storeList=e.storeList}else if("2"==this.value){if(this.keysArr.splice(0,this.keysArr.length),this.shopGroupValue="已选择0个门店分组",this.selecDataName.splice(0,this.selecDataName.length),e.storeName.split(",").forEach(function(e){t.selecDataName.push(e)}),this.selectListId.splice(0,this.selectListId.length),e.storeIds.split(",").forEach(function(e){t.selectListId.push(e)}),this.selecData2=[],e.storeList)e.storeList.length>0&&(this.selecData2=e.storeList);else{var r=[];e.storeIds.split(",").forEach(function(e){var t={storeGroupId:null};t.storeId=e,r.push(t)}),this.selecData2=r}this.sendStoreObj.storeType=this.value,this.sendStoreObj.storeGroupIds=e.storeGroupIds,this.sendStoreObj.storeIds=e.storeIds,this.sendStoreObj.storeList=e.storeList}else"0"==this.value&&(this.keysArr.splice(0,this.keysArr.length),this.selecDataName.splice(0,this.selecDataName.length),this.selectListId.splice(0,this.selectListId.length),this.keysArr.splice(0,this.keysArr.length),this.shopGroupValue="已选择0个门店分组");this.getGroupTreeData()}},getGroupTreeData:function(){var e=this;this.axios.get("/api-admin/cloud-store-group",{params:{requestProject:"middle-ground"}}).then(function(t){var s=t.data;0==s.errorCode?e.dataObj=s.result:e.$message.error(s.message)})},getSearchData:function(e){var t=this;e&&this.axios.post("/api-admin/cloud-store",r.stringify({requestProject:"middle-ground",search:this.searchValueList,currentPage:1,pageSize:5,selectedIds:this.selectListId.join(",")})).then(function(e){var s=e.data;0==s.errorCode?t.selectList=s.result.list?s.result.list:[]:t.$message.error(s.message)})},selectShop:function(e){this.showShopTree=!1,this.showSearchList=!1;var t={};t.storeType=parseInt(e),"0"==e?(t.storeGroupIds="",t.storeIds="",this.$emit("sendSelectGroupData",t)):"1"==e?(this.sendGroupObj.storeType=parseInt(e),this.$emit("sendSelectGroupData",this.sendGroupObj)):"2"==e&&(this.sendStoreObj.storeType=parseInt(e),this.$emit("sendSelectGroupData",this.sendStoreObj))},toggleShopTree:function(){this.showShopTree=!this.showShopTree},groupBtnSure:function(){this.showShopTree=!1;var e=this.$refs.shopGroupTree.getCheckedKeys(),t=e.length,s=e.join(","),r=[];e.forEach(function(e){var t={};t.storeGroupId=e,t.storeId=null,r.push(t)}),this.shopGroupValue="已选择"+t+"个门店分组",this.sendGroupObj={},this.sendGroupObj.storeGroupIds=s,this.sendGroupObj.storeIds="",this.sendGroupObj.storeType=parseInt(this.value),this.sendGroupObj.storeList=r,this.$emit("sendSelectGroupData",this.sendGroupObj)},toggleSearchShop:function(){this.showSearchList=!this.showSearchList},showSearchTree:function(){this.showSearchList=!0},hideSearch:function(){this.showSearchList=!1},hideTree:function(){this.showShopTree=!1,this.showSearchList=!1},selectShopSuccess:function(e,t){this.selecData2.push(e),this.selecDataName.push(e.storeName),this.selectList.splice(t,1),this.selectListId.push(e.storeId),this.selectListGroupId.push(e.storeGroupId);var s=[];this.selecData2.forEach(function(e){var t={};t.storeGroupId=e.storeGroupId,t.storeId=e.storeId,s.push(t)}),this.sendStoreObj={},this.sendStoreObj.storeType=parseInt(this.value),this.sendStoreObj.storeGroupIds=this.selectListGroupId.join(","),this.sendStoreObj.storeIds=this.selectListId.join(","),this.sendStoreObj.storeList=s,this.$emit("sendSelectGroupData",this.sendStoreObj)},removeData:function(e){this.selecData2.splice(e,1),this.selecDataName.splice(e,1),this.selectListId.splice(e,1),this.selectListGroupId.splice(e,1);var t=[];this.selecData2.forEach(function(e){var s={};s.storeGroupId=e.storeGroupId,s.storeId=e.storeId,t.push(s)}),this.sendStoreObj={},this.sendStoreObj.storeType=parseInt(this.value),this.sendStoreObj.storeGroupIds=this.selectListGroupId.join(","),this.sendStoreObj.storeIds=this.selectListId.join(","),this.sendStoreObj.storeList=t,this.$emit("sendSelectGroupData",this.sendStoreObj)}}},i={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"select-shop-wrap"},[s("el-select",{staticClass:"select-shop fl",attrs:{placeholder:"请选择"},on:{change:e.selectShop},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}},e._l(e.options,function(e){return s("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:"1"==e.value,expression:"value == '1'"}],staticClass:"all-style-wrap fl"},[s("el-popover",{staticClass:"vertical-baseline",attrs:{"popper-class":"store-group-wrap",placement:"bottom-start",trigger:"click"},model:{value:e.showShopTree,callback:function(t){e.showShopTree=t},expression:"showShopTree"}},[s("div",{staticClass:"select-shop select-shop-rt",attrs:{slot:"reference"},slot:"reference"},[e._v(e._s(e.shopGroupValue))]),e._v(" "),s("div",{staticClass:"select-shop-url-wrap",class:{"group-top-318":e.groupTopBool}},[s("div",{staticClass:"shop-tree-wrap"},[s("el-tree",{ref:"shopGroupTree",attrs:{data:e.dataObj,"show-checkbox":"","default-expand-all":"","default-checked-keys":e.keysArr,"node-key":"storeGroupId","highlight-current":"",props:e.defaultProps}})],1),e._v(" "),s("div",{staticClass:"select-group-btn"},[s("el-row",[s("el-button",{staticStyle:{color:"#303133"},attrs:{type:"text",size:"small"},on:{click:function(t){return t.preventDefault(),t.stopPropagation(),e.hideTree(t)}}},[e._v("取消")]),e._v(" "),s("el-button",{attrs:{type:"text",size:"small"},on:{click:function(t){return t.preventDefault(),t.stopPropagation(),e.groupBtnSure(t)}}},[e._v("确定")])],1)],1)])])],1),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:"2"==e.value,expression:"value == '2'"}],staticClass:"all-style-wrap fl"},[s("el-popover",{staticClass:"vertical-baseline",attrs:{placement:"bottom-start",trigger:"click"},model:{value:e.showSearchList,callback:function(t){e.showSearchList=t},expression:"showSearchList"}},[s("div",{staticClass:"select-shop el-input dm-store__reference select-shop-total",attrs:{slot:"reference"},slot:"reference"},[s("div",{staticClass:"select-shop-selected"},e._l(e.selecDataName,function(t,r){return s("el-tag",{key:r,attrs:{size:"small",closable:""},on:{close:function(t){return e.removeData(r)}}},[e._v(e._s(t))])}),1),e._v(" "),s("el-popover",{attrs:{placement:"top-start","popper-class":"select-shop__popper",width:"300",trigger:"hover"}},[e._l(e.selecDataName,function(t,r){return s("el-tag",{key:r,staticClass:"dm-store__total--tag",attrs:{size:"small",closable:""},on:{close:function(t){return e.removeData(r)}}},[e._v(e._s(t))])}),e._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:e.selecDataName.length,expression:"selecDataName.length"}],staticClass:"total-tip",attrs:{slot:"reference"},slot:"reference"},[e._v("共"+e._s(e.selecDataName.length)+"项")])],2)],1),e._v(" "),s("div",{staticClass:"select-shop-url-wrap search-shop-wrap"},[s("div",{staticClass:"search-shop-input"},[s("el-input",{staticClass:"input-name",attrs:{"prefix-icon":"el-icon-search",size:"small",clearable:"",placeholder:"输入搜索内容"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getSearchData(e.searchValueList)}},model:{value:e.searchValueList,callback:function(t){e.searchValueList=t},expression:"searchValueList"}})],1),e._v(" "),s("div",{staticClass:"search-shop-list"},[e.selectList.length>0?s("ul",e._l(e.selectList,function(t,r){return s("li",{key:r,on:{click:function(s){return s.preventDefault(),s.stopPropagation(),e.selectShopSuccess(t,r)}}},[s("span",[e._v(e._s(t.storeName))])])}),0):s("p",{staticClass:"no-data"},[e._v("无搜索内容")]),e._v(" "),s("p",{staticClass:"search-list-tip"},[e._v("最多显示5条数据")])])])])],1),e._v(" "),s("p",{staticClass:"wxy-tip"},[e._v("按观云台门店分组，应用于万象仪")])],1)},staticRenderFns:[]};var a=s("C7Lr")(o,i,!1,function(e){s("BZf+")},"data-v-1bc54eea",null);t.a=a.exports}});