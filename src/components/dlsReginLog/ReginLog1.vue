<template>
  <div class="wraper personinfo-wrap">
        <tabbar></tabbar>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>登陆日志</span>
        </div>

            <div class="innerwrap">
              <div class="info-content">
               <div class="data-choose-top" style="overflow:hidden">
                <!-- <div class="lf">选择注册时间</div> -->
               <div class="lf">
                  <input class="input-small" type="" name="" placeholder="开始时间" v-model="beginTime" @click="showrili(0)"  />
                  <Calendar v-on:choseDay="clickDay" v-if="beginshow"></Calendar>
               </div>
               <span class="lf">-</span>
               <div class="lf">
                  <input class="input-small" type="" name="" placeholder="结束时间"  v-model="endTime" @click="showrili(1)" />
                  <Calendar v-on:choseDay="clickEnd" v-if="endshow"></Calendar>
               </div>
               <span class="lf">&nbsp;</span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="代理商手机号" v-model="agencyPhone">
                </div>
                <span class="lf">&nbsp;</span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="代理商名称" v-model='agencyName'>
                </div>
                 <span class="lf">&nbsp;</span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="代理商ID" v-model="agencyId">
                </div>
                 <button class="button-confirm margin-l30" @click="send">查询</button>
                 <button class="button-confirm margin-l30" @click="reset">重置</button>  
               </div>
                <!-- 表格 -->
                <table>
                  <tr class="table-header"> 
                    <td>登陆时间</td>
                    <td>代理商名称</td>
                    <td>代理商ID</td>
                    <td>代理商手机号</td>
                    <td>登录IP</td>
                  </tr>
                  <tr v-for="item in GetList.Items">
                     <td>{{item.LogTime}}</td>
                     <td>{{item.AgencyName}}</td>
                     <td>{{item.AgencyId}}</td>
                     <td>{{item.AgencyPhone}}</td>
                     <td>{{item.IP}}</td>
                  </tr>                 
                </table> 
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
                 <!-- 分页 -->
               <pages :allPage="GetList.Total" @pagesChange="getBill" :pageSize='pageSize'></pages>  
              </div>
        </div>

  </div>
</template>

<script>
import tabbar from "../tabbar.vue";
   import axios from "axios";
   import Calendar from 'vue-calendar-component';
   import pages from '../pages.vue'
   export default{
     name: 'barbill',
     components:{
       tabbar,
       Calendar,
       pages
     },
     data:function(){
      return{
       beginTime:"",
       endTime:"",
       beginshow:false,
       endshow:false,
       haveNone:false,
       pageIndex:1,
       pageSize:12,
       agencyPhone:"",
       agencyName:"",
       agencyId:"",
       GetList:""
       }
      },
      mounted:function(){
        this.getBill(); 
      },      
      methods:{
         getBill:function(adder){
          var that=this;
          this.pageIndex=this.$route.query.pages||1;          
          var _data=this.unit.getFinal.call(this,{agencyPhone:this.agencyPhone,agencyName:this.agencyName,agencyId:this.agencyId});
          this.vq.bindTo({
            url:"/api/LoginLog/GetList",
            data:_data,
            addfn: function(res){
              that.haveNone = false;
               if (res.Items.length < 1) {
                that.haveNone = true;
              }
            }
          })
         },  
        send:function(){
          this.unit.DateSend.call(this,this.getBill);
        },   
       reset:function(){
          this.beginTime='';
          this.endTime='';
          this.agencyPhone='';
          this.agencyName="";
          this.agencyId="";
          this.haveNone=false;
          this.send();
       },                
      clickDay:function(day){
        this.beginTime=day;
        this.beginshow=false;
      },
      clickEnd:function(day){
       this.endTime=day;
       this.endshow=false;
      },
      showrili:function(type){
       this.unit.rilishow.call(this,type);
      },
 
   }
 }
</script>
<style scoped>
  table tr td{font-size:14px;}
 .data-choose-top{padding-bottom:25px;}
  h2{text-align: left;border-left:5px solid green;padding-left:10px;}
  .haveNoneS {
    margin-top: 50px;
    text-align: center;
    color: gray;
  } 
</style>

