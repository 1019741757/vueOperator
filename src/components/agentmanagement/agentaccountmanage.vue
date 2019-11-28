<template>
  <div class="wraper personinfo-wrap">
  	  <tabbar></tabbar>
  	  <div class="padding-pb fs-18 item-title">
  	    <span class="little-blue"></span>
  	    <span>代理商账号审核</span>
  	  </div>
           <div class="innerwrap">
             <div class="info-content">
              <div class="data-choose-top">
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
                 <input type="text" class="input-small" placeholder="代理商名称" v-model='name'>
              </div>
               <span class="lf">&nbsp;</span>
                <button class="button-confirm margin-l30" @click="send">查询</button>
                <button class="button-confirm margin-l30" @click="reset">重置</button>
              </div>
               <!-- 表格 -->
               <table>
                 <tr class="table-header"> 
                   <td>注册时间</td>
                   <td>姓名</td>
                   <td>手机号</td>
                   <td>所住地</td>
                   <td>QQ</td>
                   <td>状态</td>
                   <td>审核人</td>
                   <td>审核时间</td>
                   <td>操作</td>
                 </tr>
                 <tr v-for="item in GetAwaitAuditList.Items">
                    <td>{{item.AgencyRegisterDate}}</td>
                    <td>{{item.AgencyName}}</td>
                    <td>{{item.AgencyPhone}}</td>
                    <td>{{item.AgencyArea}}</td>
                    <td>{{item.QQ}}</td>
                    <td>{{item.AgencyStatus?"已通过":"未通过"}}</td>
                    <td>{{item.Auditor}}</td>
                    <td>{{item.AuditDate}}</td>
                    <td>
                      <div v-if="!item.AgencyStatus">
                        <button class="button-blue" @click="showwindow(item,1)" >通过</button>
                        <button class="button-blue" @click="showwindow(item,2)" >不通过</button>                        
                      </div>
                    </td>

                 </tr>
               </table> 
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>        
                <!-- 分页 -->
             <pages :allPage="GetAwaitAuditList.Total" @pagesChange="getBill"></pages>  
             <floatboard v-if="boardshow" @hiddenWindow="hiddenWindow" :confirmWay="audit"><h4>确认操作?</h4></floatboard>
             </div>
       </div>


  </div>
</template>

<script>
    import tabbar from "../tabbar.vue";
    import axios from "axios";
    import Calendar from 'vue-calendar-component';
    import pages from '../pages.vue';
    import floatboard from "../floatboard"    
    export default{
      name: 'barbill',
      components:{
        tabbar,
        Calendar,
        pages,
        floatboard
      },
      data:function(){
       return{
        beginTime:"",
        endTime:"",
        beginshow:false,
        endshow:false,
        haveNone:false,
        boardshow:false,
        pageIndex:1,
        handleType:-1,
        handleItem:{},
        phone:"",
        name:"",
        GetAwaitAuditList:{}   
       }
      },
   
      mounted:function(){
        this.getBill(); 
      },      
      methods:{
         getBill:function(adder){
          var that=this;
          this.pageIndex=this.$route.query.pages||1;          
          var _data=this.unit.getFinal.call(this,{phone:this.phone,name:this.name},true);
          this.vq.bindTo({
            url:"/api/Agency/GetAwaitAuditList",
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
        hiddenWindow:function(){
          this.boardshow=false;
        },
        showwindow:function(item,type){
         this.boardshow=true;
         this.handleItem=item;
         type==1?this.handleType=true:this.handleType=false;
        },
       reset:function(){
          this.beginTime='';
          this.endTime='';
          this.phone='';
          this.name='';
          this.haveNone= false;
          this.send();
       },        
       audit:function(id,handle){
          var that=this;
          this.vq.v(this).sendMes({
            url:"/api/Agency/RegisterAudit?agencyId="+this.handleItem.AgencyID+"&agencyStatus="+this.handleType,
            type:"post",
            data:{agencyId:this.handleItem.AgencyID,agencyStatus:this.handleType},
            fn:function(){
              that.getBill();
            }
          })
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
   .dnumber{border:1px solid #ccc;padding:8px 10px} 
  h2{text-align: left;border-left:5px solid green;padding-left:10px;}
  .haveNoneS {
    margin-top: 50px;
    text-align: center;
    color: gray;
  } 
</style>
