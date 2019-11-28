<template>
  <div class="wraper personinfo-wrap">
        <tabbar></tabbar>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>代理商账户余额查询</span>
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
                 <button class="button-confirm margin-l30" @click="send">查询</button>
                 <button class="button-confirm margin-l30" @click="reset">重置</button> 
               </div>
                <!-- 表格 -->
                <table>
                  <tr class="table-header"> 
                    <td>日期</td>
                    <td>总额(元)</td>
                    <td>可消费余额(元)</td>
                    <td>可提现收益余额(元)</td>
                    <td>提现中余额(元)</td>
                  </tr>
                  <tr v-for="item in GetBalanceSumByDay.Items">
                     <td>{{item.DateOfCreate}}</td>
                     <td>{{item.TotalBalance+item.EarningOfPaying+item.EarningOfWaitingAudit}}</td>
                     <td>{{item.TotalBalance}}</td>
                     <td>{{item.EarningOfPaying}}</td>
                     <td>{{item.EarningOfWaitingAudit}}</td>
                  </tr>
                </table> 
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
                 <!-- 分页 -->
               <pages :allPage="GetBalanceSumByDay.Total" @pagesChange="getBill"></pages> 
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
       GetBalanceSumByDay:"",
      }
     },
      mounted:function(){
        this.getBill(); 
      },      
      methods:{
      reset:function(){
       this.beginTime='';
       this.endTime='';
       this.haveNone=false;
       this.getBill();
      },
         getBill:function(adder){
          var that=this;
          this.pageIndex=this.$route.query.pages||1;          
          var _data=this.unit.getFinal.call(this,{},true);
          this.vq.bindTo({
            url:"/api/Balance/GetBalanceSumByDay",
            data:_data,
            addfn: function(res){
              that.haveNone = false;
               if (res.Items.length < 1) {
                that.haveNone = true;
              }
            }
          });
         },  
        send:function(){
          this.unit.DateSend.call(this,this.getBill);
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

