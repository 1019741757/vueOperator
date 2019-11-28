<template>
  <div class="wraper personinfo-wrap">
 
	  <tabbar></tabbar>
    <div class="innerwrap">
		  <div class="padding-pb fs-18 item-title">
		    <span class="little-blue"></span>
		    <span>消费记录查询</span>
		  </div>
   	  <div class="info-content">
       <div class="data-choose-top">
       <div class="lf">
          <input class="input-small" type="" name="" placeholder="开始时间" v-model="beginTime" @click="showrili(0)"  />
          <Calendar v-on:choseDay="clickDay" v-if="beginshow"></Calendar>
       </div>
         <span class="lf">——</span>
       <div class="lf">
          <input class="input-small" type="" name="" placeholder="结束时间"  v-model="endTime" @click="showrili(1)" />
          <Calendar v-on:choseDay="clickEnd" v-if="endshow"></Calendar>
       </div>
          <span class="margin-l15">订单编号筛选</span>
          <input class="input-small" type="" name="" v-model="orderid" placeholder="请输入订单编号"  />
          <span class="margin-l15">网吧名称筛选</span>
          <input class="input-small" type="" name="" v-model="netbarNeme" placeholder="请输入网吧名称"   />                
          <button class="button-confirm margin-l30" @click="send">查询</button>
          <button class="button-confirm margin-l30" @click="reset">重置</button>
       </div>
       <div class="consume-record-content margin-b25" v-for="item in GetConsumeLog.Items">
            <div class="consume-record-title padding-pb">
               <span>购买时间：</span><span>{{item.OrderDate}}</span>
               <span>订单编号：</span><span>{{item.OrderID}}</span>
               <span>总金额：</span><span>{{item.Price}}元</span>
            </div>
            <table>
              <tr class="table-header"> <td>网吧名称</td><td>特权名称</td><td>购买月数</td><td>消费金额</td></tr>
              <tr v-for="sonitem in item.ConsumeLogItems">
                 <td>{{item.NetbarName}}</td><td>{{sonitem.ProductName}}</td><td>{{sonitem.Units}}</td><td>{{sonitem.Units*sonitem.UnitPrice}}</td>
              </tr>          
            </table>  
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
       </div>
       <pages :allPage="GetConsumeLog.Total" @pagesChange="getBill" :pageSize='pageSize'></pages>  
      </div>
     </div>
  </div>
</template>

<script>
import pages from '../pages.vue'
import tabbar from "../tabbar.vue"
import axios from "axios"
import Calendar from 'vue-calendar-component';
export default {
  name: 'barbill',
  components:{
    tabbar,
    Calendar,
    pages, 
  },
  data:function(){
   return{
    beginTime:"",
    endTime:"",
    orderid:"",
    netbarNeme:"",
    beginshow:false,
    endshow:false,
    haveNone:false,
    pageSize:3,
    pageIndex:1,
    GetConsumeLog:{

    }
   }
  },
 
  mounted:function(){
    this.getBill(); 
  },      
  methods:{
   getBill:function(){
    this.pageIndex=this.$route.query.pages||1;
    var adder={orderid:this.orderid,netbarNeme:this.netbarNeme};
    var _data=this.unit.getFinal.call(this,adder);
    this.vq.v(this).bindTo({
      url:"/api/Consume/GetConsumeLog",
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
    this.unit.DateSend.call(this,this.getBill,{orderid:this.orderid,netbarNeme:this.netbarNeme});
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
      this.orderid="";
      this.netbarNeme="";
      this.haveNone = false;
      this.send();
    },     
  }
}
</script>
<style>
.data-choose-top{
  padding-bottom:25px;
 
}
.consume-record-title{
  border:1px solid #dddddd;
  border-bottom: 0px;
}
.haveNoneS {
    margin-top: 50px;
    text-align: center;
    color: gray;
  }
</style>
