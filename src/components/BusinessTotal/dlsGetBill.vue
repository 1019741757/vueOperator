<template>
  <div class="wraper personinfo-wrap">
        <tabbar></tabbar>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>代理商收益账单</span>
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
                   <input type="text" class="input-small" placeholder="代理商手机号" v-model="phone">
                </div>
                <span class="lf">&nbsp;</span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="代理商名称" v-model='name'>
                </div>
                 <span class="lf">&nbsp;</span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="代理商ID" v-model="agencyId">
                </div>
                 <button class="button-confirm margin-l30" @click="send">查询</button>
                 <button class="button-confirm margin-l30" @click="reset">重置</button>
               </div>

               <div  class="data-choose-top" style="overflow:hidden">
                 <div class="lf">代理商业务收益总计：<i class="color-waring">{{GetAgencyEarningTotal.Object&&GetAgencyEarningTotal.Object.SumEarning}}</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">580特权客户端(显示)总计：<i class="color-waring">{{GetAgencyEarningTotal.Object&&GetAgencyEarningTotal.Object.OpenWindowClientEarning}}</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">580特权客户端(不显示)总计：<i class="color-waring">{{GetAgencyEarningTotal.Object&&GetAgencyEarningTotal.Object.NotOpenWindowClientEarning}}</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">主页业务总计：<i class="color-waring">{{GetAgencyEarningTotal.Object&&GetAgencyEarningTotal.Object.HomePage}}</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">桌标业务总计：<i class="color-waring">{{GetAgencyEarningTotal.Object&&GetAgencyEarningTotal.Object.Shortcut}}</i></div>
                   <span class="lf">&nbsp;</span>
                 <div class="lf">推荐奖励总计：<i class="color-waring">{{GetAgencyEarningTotal.Object&&GetAgencyEarningTotal.Object.EarningFromSubordinate}}</i></div>
               </div>
                <!-- 表格 -->
                <table>
                  <tr class="table-header">

                    <td>代理商名称</td>
                    <td>代理商ID</td>
                    <td>代理商手机号</td>
                    <td>580特权客户端(显示)</td>
                    <td>580特权客户端(不显示)</td>
                    <td>主页业务</td>
                    <td>桌标业务</td>
                    <td>活动收益</td>
                    <td>合计(元)</td>
                    <td>网吧账单</td>
                    <td>每日账单详情</td>
                  </tr>
                  <tr v-for="item in GetAgencyEarningGAgencyByPage.Items">

                     <td>{{item.AgencyName}}</td>
                     <td>{{item.AgencyId}}</td>
                     <td>{{item.AgencyPhone}}</td>
                     <td>{{item.OpenWindowClientEarning}}</td>
                     <td>{{item.NotOpenWindowClientEarning}}</td>
                     <td>{{item.HomePage}}</td>
                     <td>{{item.Shortcut}}</td>
                     <td>{{item.EarningFromSubordinate}}</td>
                     <td>{{item.SumEarning}}</td>
                     <td><button class="button-blue" @click='tobarbill(item)'>查看详情</button></td>
                     <td><button class="button-blue" @click="todailybill(item)">查看详情</button></td>
                  </tr>
                </table>
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
                 <!-- 分页 -->
               <pages :allPage="GetAgencyEarningGAgencyByPage.Total" @pagesChange="getBill"></pages>
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
       name:"",
       GetAgencyEarningTotal:"",
       agencyId:"",
       GetAgencyEarningGAgencyByPage:"",
      }
     },
      mounted:function(){
        this.getBill();
      },
    methods:{
      tobarbill:function(item){
         this.$store.state.everyDayGet={
           AgencyName:item.AgencyName,
           AgencyPhone:item.AgencyPhone,
           AgencyId:item.AgencyId
         };
         this.$router.push("/BarBill");
         this.$store.state.nowName="网吧收益账单";
      },
       reset:function(){
          this.beginTime='';
          this.endTime='';
          this.phone='';
          this.name='';
          this.agencyId="";
          this.haveNone=false;
          this.send();
       },
      todailybill:function(item){
         this.$store.state.everyDayGet={
           AgencyName:item.AgencyName,
           AgencyPhone:item.AgencyPhone,
           AgencyId:item.AgencyId
         };
         this.$router.push("/dlsBillDetail");
         this.$store.state.nowName="代理商每日收益详情";
      },
      getBill:function(adder){
        var that=this;
        this.pageIndex=this.$route.query.pages||1;
        var _data=this.unit.getFinal.call(this,{AgencyName:this.name,AgencyPhone:this.phone,AgencyId:this.agencyId},true);
          this.vq.bindTo({
            url:"/api/AgencyEarning/GetAgencyEarningTotal",
            data:_data,
            isAsycn:true
          })
          this.vq.bindTo({
            url:"/api/AgencyEarning/GetAgencyEarningGAgencyByPage",
            data:_data,
            isAsycn:true,
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
