<template>
  <div class="wraper personinfo-wrap">
        <tabbar></tabbar>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>代理商消费账单</span>
        </div>

            <div class="innerwrap">
              <div class="info-content">
               <div class="data-choose-top" style="overflow:hidden">
                <!-- <div class="lf">选择注册时间</div> -->
               <div class="lf">
                选择消费时间&nbsp;
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
                 <input type="text" class="input-small" placeholder="代理商名称" v-model='agencyName'>
              </div>     
              <span class="lf">&nbsp;</span>        
              <div class="lf">
                 <input type="text" class="input-small" placeholder="代理商电话" v-model='phone'>
              </div>
               <span class="lf">&nbsp;</span>
              <div class="lf">
                 <input type="text" class="input-small" placeholder="代理商ID" v-model="agencyid">
              </div>
                 <button class="button-confirm margin-l30" @click="send">查询</button>
                 <button class="button-confirm margin-l30" @click="reset">重置</button>
               </div>

               <div  class="data-choose-top" style="overflow:hidden">
                 <div class="lf">合计代理商总消费：<i class="color-waring">{{GetAgencyConsumeBill.Object&&GetAgencyConsumeBill.Object.orderPriceSum}}元</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">steam特权钻石版消费总计：<i class="color-waring">{{GetAgencyConsumeBill.Object&&GetAgencyConsumeBill.Object.Steam}}元</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">加速器特权消费总计：<i class="color-waring">{{GetAgencyConsumeBill.Object&&GetAgencyConsumeBill.Object.Accelerator}}元</i></div>
               </div>
                <!-- 表格 -->
                <table>
                  <tr class="table-header"> 
 
                    <td>代理商名称</td>
                    <td>代理商ID</td>
                    <td>代理商手机号</td>
                    <td>steam特权钻石版消费</td>
                    <td>加速器特权消费</td>
                    <td>合计(元)</td>
                    <td>网吧账单</td>
                  </tr>
                  <tr v-for="item in GetAgencyConsumeBillList.Items">
 
                     <td>{{item.AgencyName}}</td>
                     <td>{{item.AgencyID}}</td>
                     <td>{{item.AgencyPhone}}</td>
                     <td>{{item.ProductDetailed.Steam}}</td>
                     <td>{{item.ProductDetailed.Accelerator}}</td>
                     <td>{{item.OrderPriceSum}}</td>
                     <td><button class="button-blue" @click="tobarconsume(item)">查看详情</button></td>
                  </tr>          
                </table> 
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
                 <!-- 分页 -->
               <pages :allPage="GetAgencyConsumeBillList.Total" @pagesChange="getBill"></pages>  
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
       phone:"",
       agencyid:"", 
       GetAgencyConsumeBillList:"",   
       GetAgencyConsumeBill:"",   
      }
     },
      mounted:function(){
        this.getBill(); 
      },      
      methods:{
         getBill:function(adder){
          var that=this;
          this.pageIndex=this.$route.query.pages||1;          
          var _data=this.unit.getFinal.call(this,{phone:this.phone,agencyid:this.agencyid,agencyName:this.agencyName},true);
          var _data2=this.unit.getFinal.call(this,{phone:this.phone,agencyid:this.agencyid},true)
          this.vq.bindTo({
            url:"/api/Consume/GetAgencyConsumeBillList",
            data:_data,
            isAsycn:true,
            addfn: function(res){
              that.haveNone = false;
               if (res.Items.length < 1) {
                that.haveNone = true;
              }
            }
          });
          this.vq.bindTo({
            url:"/api/Consume/GetAgencyConsumeBill",
            data:_data2,
            isAsycn:true
          });          
         },  
        send:function(){
          this.unit.DateSend.call(this,this.getBill);
        }, 
      tobarconsume:function(item){
         this.$store.state.barbillconsume={
           AgencyName:item.AgencyName,
           AgencyId:item.AgencyID
         };
         this.$router.push("/BarBillConsume");
         this.$store.state.nowName="网吧消费账单";       
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
       reset:function(){
          this.beginTime='';
          this.endTime='';
          this.phone='';
          this.agencyid=''; 
          this.agencyName='';   
          this.haveNone =false;          
          this.send();
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

