<template>
  <div class="wraper personinfo-wrap">
        <tabbar></tabbar>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>网吧steam时长统计</span>
        </div>

            <div class="innerwrap">
              <div class="info-content">
               <div class="data-choose-top" style="overflow:hidden">
 
               <span class="lf"></span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="请输入网吧名称  " v-model="netbarName">
                </div>
               <span class="lf"></span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="请输入网吧ID" v-model="netbarId">
                </div>
               <span class="lf"></span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="请输入代理商名称" v-model="agencyName">
                </div> 
               <span class="lf"></span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="请输入代理商ID" v-model="agencyId">
                </div>                                                           
               <span class="lf"></span>                
                 <button class="button-confirm margin-l30" @click="send">查询</button>
                 <button class="button-confirm margin-l30" @click="reset">重置</button> 
               </div>
                <!-- 表格 -->

                <table class="margin-b25">
                  <tr class="table-header"> 
                    <td>网吧名称</td>
                    <td>网吧ID</td>
                    <td>所属代理商</td>
                    <td>代理商ID</td>
                    <td>
                      累计使用时长
                      <span :class="sortType==1||sortType==2?'back-blue btn-small color-w':'back-grey btn-small color-w'" @click="changesort(true)">{{word1}}</span>
                    </td>
                    <td>
                      累计购买月数
                      <span :class="sortType==3||sortType==4?'back-blue btn-small color-w':'back-grey btn-small color-w'" @click="changesort(false)">{{word2}}</span>
                    </td>
                  </tr>
                  <tr v-for="item in GetSteamOrderTimeStatistics.Items">
                     <td>{{item.NetbarName}}</td>
                     <td>{{item.NetbarID}}</td>
                     <td>{{item.AgencyName}}</td>
                     <td>{{item.AgencyID}}</td>
                     <td>{{item.CumulativeTime}}</td>
                     <td>{{item.BuyMonthCount}}</td>
                  </tr>
                </table> 
 
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
                 <!-- 分页 -->
               <pages :allPage="GetSteamOrderTimeStatistics.Total" @pagesChange="getBill" :pageSize="10"></pages> 
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
       netbarName:"",
       netbarId:"",
       haveNone:false,
       agencyName:"",
       agencyId:"",
       sortType:1,
       pageSize:10,
       beginshow:false,
       endshow:false,
       pageIndex:1,
       word1:"倒序",
       word2:"倒序",
       GetGameOrderTime:"",
       GetSteamOrderTimeStatistics:"",
      }
     },
      mounted:function(){
        this.getBill(); 
      },      
      methods:{
      reset:function(){
        this.netbarName="";
        this.netbarId="";
        this.agencyName="";
        this.agencyId="";
        this.haveNone=false;
       this.getBill();
      },
         getBill:function(adder){
          var that=this;
          this.pageIndex=this.$route.query.pages||1;          
          var _data=this.unit.getFinal.call(this,{netbarName:this.netbarName,netbarId:this.netbarId,agencyName:this.agencyName,agencyId:this.agencyId,sortType:this.sortType},true);
          this.vq.bindTo({
            url:"/api/SteamOrder/GetSteamOrderTimeStatistics",
            data:_data,
            addfn: function(res){
              that.haveNone = false
              if (res.Items.length < 1) {
                that.haveNone = true;
              }
            }
          });
         },  
        send:function(){
          this.unit.DateSend.call(this,this.getBill);
        },
      changesort:function(type){
        if(type){
          if(this.sortType==1){
            this.sortType=2;
            this.word1="正序";
          }else{
            this.sortType=1;
            this.word1='倒序';
          }
        }else{
          if(this.sortType==3){
            this.sortType=4;
            this.word1="正序";
          }else{
            this.sortType=3;
            this.word1="倒序";
          }          
        }
        this.getBill();
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

