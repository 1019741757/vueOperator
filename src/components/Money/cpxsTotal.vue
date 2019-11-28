<template>
  <div class="wraper personinfo-wrap">
        <tabbar></tabbar>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>产品销售统计</span>
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
                   <input type="text" class="input-small" placeholder="代理商手机号" v-model="phone">
                </div>
                 <span class="lf">&nbsp;</span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="代理商ID" v-model="agencyId">
                </div>
                 <button class="button-confirm margin-l30" @click="send">查询</button>
                 <button class="button-confirm margin-l30" @click="reset">重置</button>
               </div>

               <div  class="data-choose-top" style="overflow:hidden">
                 <div class="lf">总金额合计:<i class="color-waring">{{GetAgencyConsumeBill.Object&&GetAgencyConsumeBill.Object.orderPriceSum}}元</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">加速器特权消费合计:<i class="color-waring">{{GetAgencyConsumeBill.Object&&GetAgencyConsumeBill.Object.Accelerator}}元</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">steam特权钻石版消费合计:<i class="color-waring">{{GetAgencyConsumeBill.Object&&GetAgencyConsumeBill.Object.Steam}}元</i></div>
               </div>
                <!-- 表格 -->
                <table>
                  <tr class="table-header"> 
                    <td>时间</td>
                    <td>加速器特权消费(元)</td>
                    <td>steam特权钻石版消费(元)</td>
                  </tr>
                  <tr v-for="item in GetProductConsumeBillList.Items">
                     <td>{{item.Date}}</td>
                     <td>{{item.ProductSalesInfo.Accelerator}}</td>
                     <td>{{item.ProductSalesInfo.Steam}}</td>
                  </tr>           
                </table> 
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
                 <!-- 分页 -->
               <pages :allPage="GetProductConsumeBillList.Total" @pagesChange="getBill"></pages>  
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
       haveNone:false,
       endshow:false,
       phone:"",
       name:"",
       pageIndex:1,
       agencyId:"", 
       GetProductConsumeBillList:"", 
       GetAgencyConsumeBill:""     
      }
     },
      mounted:function(){
        this.getBill(); 
      },      
      methods:{
         getBill:function(adder){
          var that=this;
          this.pageIndex=this.$route.query.pages||1;          
          var _data=this.unit.getFinal.call(this,{phone:this.phone,agencyId:this.agencyId});
          this.vq.bindTo({
            url:"/api/Consume/GetProductConsumeBillList",
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
            data:_data,
            isAsycn:true
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
       reset:function(){
          this.beginTime='';
          this.endTime='';
          this.phone='';
          this.name='';
          this.agencyId='';    
          this.haveNone=false;        
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

