<template>
  <div class="wraper personinfo-wrap">
        <tabbar></tabbar>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>代理商每日收益详情</span>
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
                   <input type="text" class="input-small" placeholder="代理商手机号" v-model="$store.state.everyDayGet.AgencyPhone">
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
                 <span class='color-waring'>必须查询指定代理商才能查询数据</span>
               </div>
            
                <!-- 表格 -->
                <table>
                  <tr class="table-header"> 
                    <td>日期</td>
                    <td>有效终端(开启)</td>
                    <td>有效终端(关闭)</td>
                    <td>推荐奖励收益</td>
                    <td>主页收益</td>
                    <td>桌标收益</td>
                    <td>当日总收益</td>
                    <td>网吧账单详情</td>
                  </tr>
                  <tr v-for="item in GetAgencyEarningGTimeByPage.Items">
                     <td>{{item&&item.DateOfEarningStr}}</td>
                     <td>{{item&&item.OpenWindowClientEarning}}元</td>
                     <td>{{item&&item.NotOpenWindowClientEarning}}元  </td>
                     <td>{{item&&item.EarningFromSubordinate}}元</td>
                     <td>{{item&&item.HomePage}}元</td>
                     <td>{{item&&item.Shortcut}}元</td>
                     <td>{{item&&item.SumEarning}}元</td>
                     <td><button class="back-blue" @click='todetail(item)'>查看详情</button></td>
                  </tr>
                </table> 
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3> 
                 <!-- 分页 -->
               <pages :allPage="GetAgencyEarningGTimeByPage.Total?GetAgencyEarningGTimeByPage.Total:0" @pagesChange="getBill"></pages>  
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
       GetAgencyEarningGTimeByPage:[],        
      }
     },
     computed:{
      consumeData:function(){
       var nowDate=new Date();
       var nextDate=new Date(new Date().setDate(nowDate.getDate() - 7));
       var nowString=nowDate.getFullYear()+"-"+(nowDate.getMonth()-0+1)+"-"+nowDate.getDate();
       var nextString=nextDate.getFullYear()+"-"+(nextDate.getMonth()-0+1)+"-"+nextDate.getDate();
                //有实际含义值才执行null undefined ''都不能执行
      return !!this.beginTime&&!!this.endTime?this.beginTime+"到"+this.endTime:nextString+"到"+nowString;
      }
     },
      mounted:function(){
        if(this.$store.state.everyDayGet.AgencyPhone||this.$store.state.everyDayGet.AgencyName||this.$store.state.everyDayGet.AgencyId){
          this.getBill(); 
        }else{
          this.beginTime="";
          this.endTime="";
        }
      },      
      methods:{
         getBill:function(adder){
          var that=this;
          this.pageIndex=this.$route.query.pages||1;          
          var _data=this.unit.getFinal.call(this,this.$store.state.everyDayGet);
          this.vq.bindTo({
            url:"/api/AgencyEarning/GetAgencyEarningGTimeByPage",
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
        if(this.$store.state.everyDayGet.AgencyPhone||this.$store.state.everyDayGet.AgencyName||this.$store.state.everyDayGet.AgencyId){
          this.unit.DateSend.call(this,this.getBill);
        }else{
          this.$store.state.primaryInfo="必须填上代理商信息才能查询";
          this.$store.state.primaryshow=true;          
          this.beginTime="";
          this.endTime="";
        }          
        },     
      clickDay:function(day){
        console.log(day)
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
          this.haveNone=false;
          this.$store.state.everyDayGet.AgencyPhone='';
          this.$store.state.everyDayGet.AgencyName='';
          this.$store.state.everyDayGet.AgencyId="";
       },
       todetail:function(item){
         this.$router.push("/BarBill?bengin="+item.DateOfEarning.split("T")[0].replace(/-/g,"/",));
         this.$store.state.nowName="网吧收益账单";         
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
