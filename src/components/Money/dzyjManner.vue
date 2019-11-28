<template>
  <div class="wraper personinfo-wrap">
        <tabbar></tabbar>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>对账预警管理</span>
        </div>

            <div class="innerwrap">
              <div class="info-content">
               <!-- <div class="data-choose-top" style="overflow:hidden"> -->
               <div class="data-choose-top">
                <div class="lf">
                  <input type="text" class="input-small" placeholder="代理商名称">
                </div>
                <span class="lf">&nbsp;</span>
                <div class="lf">
                  <input type="text" class="input-small" placeholder="代理商名ID">
                </div>
                 <button class="button-confirm margin-l30" @click="send">查询</button>
               </div>
                <!-- 表格 -->
                <table>
                  <tr class="table-header"> 
                    <td>代理商名称</td>
                    <td>代理商ID</td>
                    <td>收益总金额</td>
                    <td>提现成功(元)</td>
                    <td>提现中(元)</td>
                    <td>可提现(元)</td>
                    <td>已兑换可消费金额</td>
                  </tr>
                  <tr>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                  </tr>
                  <tr>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                  </tr> 
                  <tr>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                  </tr>
                  <tr>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                  </tr> 
                  <tr>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                  </tr>            
                </table> 
                 <!-- 分页 -->
               <pages></pages>
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
       endshow:false
      }
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
      showrili:function(type){
       this.unit.rilishow.call(this,type);
      },
      send:function(){

      }
   }
 }
</script>
<style scoped>
  table tr td{font-size:14px;}
 .data-choose-top{padding-bottom:25px;}
  h2{text-align: left;border-left:5px solid green;padding-left:10px;}
</style>

