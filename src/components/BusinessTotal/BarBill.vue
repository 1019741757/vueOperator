<template>
  <div class="wraper personinfo-wrap">
        <tabbar></tabbar>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>网吧收益账单</span>
        </div>

            <div class="innerwrap">
              <div class="info-content">
               <div class="data-choose-top" style="overflow:hidden">
                <!-- <div class="lf">选择注册时间</div> -->
               <div class="lf">
                选择统计时间&nbsp;
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
                   <input type="text" class="input-small" placeholder="请输入网吧名称"  v-model='barname'> 
                </div>
                <span class="lf">&nbsp;</span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="代理商名称" v-model='$store.state.everyDayGet.AgencyName'>
                </div>
                 <span class="lf">&nbsp;</span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="代理商ID" v-model="$store.state.everyDayGet.AgencyId">
                </div>
                 <button class="button-confirm margin-l30" @click="send">查询</button>
                 <button class="button-confirm margin-l30" @click="reset">重置</button>
               </div>

               <div  class="data-choose-top" style="overflow:hidden">

                 <div class="lf">网吧业务收益总计:<i class="color-waring">{{GetNetbarEarningBill.Object&&GetNetbarEarningBill.Object.SumEarning}}元</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">58特权客户端(显示)总计:<i class="color-waring">{{GetNetbarEarningBill.Object&&GetNetbarEarningBill.Object.OpenWindow}}元</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">58特权客户端(不显示)总计:<i class="color-waring">{{GetNetbarEarningBill.Object&&GetNetbarEarningBill.Object.NotOpenWindow}}元</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">主页业务总计<i class="color-waring">{{GetNetbarEarningBill.Object&&GetNetbarEarningBill.Object.HomePage}}元</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">桌标业务总计:<i class="color-waring">{{GetNetbarEarningBill.Object&&GetNetbarEarningBill.Object.Shortcut}}元</i></div>
               </div>
                <!-- 表格 -->
                <table>
                  <tr class="table-header"> 
                    <td>网吧名称</td>
                    <td>所属代理商名称</td>
                    <td>代理商ID</td>
                    <td>580特权客户端(显示)</td>
                    <td>580特权客户端(不显示)</td>
                    <td>主页业务</td>
                    <td>桌标业务</td>
                    <td>合计(元)</td>
                  </tr>
                  <tr v-for="item in GetNetbarEarningBillList.Items">
                     <td>{{item.NetbarName}}</td>
                     <td>{{item.AgencyName}}</td>
                     <td>{{item.AgencyID}}</td>
                     <td>{{item.OpenWindow}}元</td>
                     <td>{{item.NotOpenWindow}}元</td>
                     <td>{{item.HomePage}}元</td>
                     <td>{{item.Shortcut}}元</td>
                     <td>{{item.SumEarning}}元</td>
                  </tr>          
                </table> 
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
                 <!-- 分页 -->
                <pages :allPage="GetNetbarEarningBillList.Total" @pagesChange="getBill"></pages>  
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
       name:"",
       agencyId:"", 
       barname:'', 
       GetNetbarEarningBillList:"",
       GetNetbarEarningBill:""    
      }
     },
      mounted:function(){
        this.beginTime=this.$route.query.bengin||"";
        this.endTime=this.$route.query.bengin||"";        
        this.getBill(); 
      },            
     methods:{
      clickDay:function(day){
        this.beginTime=day;
        this.beginshow=false;
      },
      clickEnd:function(day){
       this.endTime=day;
       this.endshow=false;
      },
       reset:function(){
          this.beginTime='';
          this.endTime='';
          this.$store.state.everyDayGet.AgencyName='';
          this.$store.state.everyDayGet.AgencyId='';
          this.barname='';   
          this.haveNone=false;         
          this.send();
       },         
      showrili:function(type){
        this.unit.rilishow.call(this,type);
      },
         getBill:function(adder){
          var that=this;
          this.pageIndex=this.$route.query.pages||1;      
          var _ob=this.$store.state.everyDayGet;
          _ob.netbarName=this.barname;
          var _data=this.unit.getFinal.call(this,_ob);
          this.vq.bindTo({
            url:"/api/Netbar/GetNetbarEarningBillList",
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
            url:"/api/Netbar/GetNetbarEarningBill",
            data:_data,
            isAsycn:true
          });          
         },  
        send:function(){
          this.unit.DateSend.call(this,this.getBill);
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

