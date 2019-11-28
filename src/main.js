// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./assets/css/reset.css"
import "./assets/css/forall.css"
import "./assets/css/public.css"
import "./assets/font/iconfont.css"
import "./assets/css/element-variables.scss"
import store from "./store"
import vq from "./assets/js/vq.js";
import axios from "axios";
import unit from "./assets/js/unit.js";
import moment from 'moment'//导入文件

Vue.prototype.$moment = moment;//赋值使用
axios.defaults.baseURL = 'http://ta.api.580tequan.com/';
//axios.defaults.baseURL = 'http://192.168.0.62:1042';

Vue.use(ElementUI);

var url=window.location.href;
if(url.indexOf("?")!=-1){
var userId=url.split('?')[1].split("=")[1];
}else{

}
// 有令牌的验证可以去掉
 axios.interceptors.request.use(function (config) {
 var cook = Vue.prototype.vq.cookier.getCookie('token');
 var cook ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVc2VySUQiOiJiNTMxMTY2Mi1kYWYwLTQ5YjAtYWIxNS03MmUyMjE0YTAzZTYiLCJVc2VyTmFtZSI6IumCuea0i-a0iyIsInRpbWUiOiIyMDE5LzExLzYgMTU6NDY6MzciLCJleHAiOjE1NzMxMTI3OTd9.V9kmv6ZzkH_wzv3qTAJISbiItDSYsGUTUVF_q3fZOqA";

  if(cook){
  //config.headers.Authorization='Bearer '+Vue.prototype.vq.cookier.getCookie('token');
  config.headers.Authorization='Bearer '+"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVc2VySUQiOiJiNTMxMTY2Mi1kYWYwLTQ5YjAtYWIxNS03MmUyMjE0YTAzZTYiLCJVc2VyTmFtZSI6IumCuea0i-a0iyIsInRpbWUiOiIyMDE5LzExLzYgMTU6NDY6MzciLCJleHAiOjE1NzMxMTI3OTd9.V9kmv6ZzkH_wzv3qTAJISbiItDSYsGUTUVF_q3fZOqA";

  }else{

  }
   return config;
 })
axios.interceptors.response.use(function (response) {
   return response;
 },function (error) {
	if(error.response.data.StatusCode==401){
      window.location.href="http://passport111.ggzuhao.com/"
	}
	return Promise.reject(error);
});
Vue.prototype.vq=new vq();
Vue.prototype.vq.putData('pager',function(vueob){return {pageSize:vueob.pageSize||8,pageIndex:vueob.pageIndex}});
Vue.prototype.vq.putData('datePager',
	function(vueob){
	      var nowDate=new Date(new Date().setDate(new Date().getDate()));
	      var star=vueob.beginTime==""?new Date(new Date().setDate(nowDate.getDate() - 6)):new Date(vueob.beginTime);
	      var end=vueob.endTime==""?nowDate:new Date(vueob.endTime);
	      var startime=vueob.unit.timeEncode(star);
	      var endtime=vueob.unit.timeEncode(end);
		  return {startTime:startime,endTime:endtime,pageSize:vueob.pageSize||8,pageIndex:vueob.pageIndex};
	});
Vue.prototype.vq.putData('nodefaultdatePager',
	function(vueob){
	      var nowDate=new Date(new Date().setDate(new Date().getDate()-1));
	      var star=vueob.beginTime;
	      var end=vueob.endTime;
	      if(star&&end){
		      var startime=vueob.unit.timeEncode(new Date(star));
		      var endtime=vueob.unit.timeEncode(new Date(end));
			  return {startTime:startime,endTime:endtime,pageSize:vueob.pageSize||8,pageIndex:vueob.pageIndex};
	      }else{
			  return {pageSize:vueob.pageSize||8,pageIndex:vueob.pageIndex};
	      }

	});
Vue.prototype.unit=unit;
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
