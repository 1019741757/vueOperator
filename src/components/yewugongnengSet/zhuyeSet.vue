<template>
  <div class="wraper personinfo-wrap">
        <tabbar></tabbar>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>主页设置</span>
        </div>

            <div class="innerwrap">
              <div class="info-content">
               <div class="data-choose-top" style="overflow:hidden">
 
               </div>
                <!-- 表格 -->
                <table>
                  <tr class="table-header"> 
                    <td>编号</td>
                    <td>主页名称</td>
                    <td>主页价格</td>
                    <td>主页链接</td>
                    <td>主页设置</td>
                  </tr>
                  <tr v-for="(item,index) in GetHomePage.Object">
                     <td><input type="checkbox" class="small-checkbox">{{index+1}}</td>
                     <td>{{item.Name}}</td>
                     <td>1000次UV/{{item.Price}}元</td>
                     <td>{{item.Url}}</td>
                     <td><button class="button-confirm margin-l30" @click="settingget(item)">收益设置</button></td>
                  </tr>        
                </table> 
                 <!-- 分页 -->
 
              </div>
        </div>
   <floatboard v-if="imgpopshow" @hiddenWindow="hiddenWindow" :confirmWay='sendPage'>
       <div class="padding-pb fs-18 item-title margin-b25">
          <span class="little-blue"></span>
          <span>主页设置</span>
       </div>  
       <div class="margin-b25">
         <input type="" name="" v-model="price"/>
         <span>元/千次UV</span>
       </div>
 
  </floatboard>
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
       imgpopshow:false,
       GetHomePage:[],
       nowitem:{},
       price:0,
       type:0,
       pageName:''
      }
     },
     mounted:function(){
      this.getData();
     },
     methods:{
      getData:function(){
        var that=this;
        this.vq.v(this).bindTo({
          url:"/api/Configure/GetHomePage",
          addfn:function(res){
            that.vq.rightArr({
              data:res.Object,
              name:"Url",
              value:"http://www.580wangba.com",
              fn:function(item){
                item.type='自有业务';
              },
              notE:function(item){
                item.type='合作商业务';
              }
            })
          }
        });
      },
      sendPage:function(){
        var that=this;
        var _data=that.nowitem;
        _data.Price=that.price;
        if(_data.Price<0){
          alert("金额不能小于0")
        }else{
          that.vq.sendMes({
            url:"/api/Configure/SetHomePage",
            type:"post",
            data:_data,
          })
        }
      },
      hiddenWindow:function(){
        this.imgpopshow=false;
      },
      settingget:function(item){
        this.imgpopshow=true;
        this.nowitem=item;
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
       if(type===0){
         this.beginshow=true;
         this.endshow=false;
       }
       else{
         this.endshow=true;
         this.beginshow=false;
       }
      },
      send:function(){
        var that=this;
        var checker={
          getType:function(type){
            var myfn=function(){};
            if(type==0){
            }else if(type==1){
              myfn=function(item){
                this.GetHomePage.Object=item;
              }
            }else{
              myfn=function(item,index){
                this.GetHomePage.Object.splice(index,1);
              }
            };
            for(var i=0;i<this.GetHomePage.Object.length;i++){
              if(this.GetHomePage.Object[i].Url=='http://www.580wangba.com'){
                    myfn().call(that,this.GetHomePage.Object[i],i);
              }
            };   

          },
          getName:function(name){
            for(var i=0;i<this.GetHomePage;i++){
              if(this.GetHomePage[i].Name=name){
                  this.GetHomePage=this.GetHomePage;
              }
            };             
          },
        };
        if(this.type==0&&this.pageName==''){
          this.getData();
        }else if(this.type!=0&&this.pageName==''){
            checker.getType.call(this,this.type);
        }else if(this.type==0&&this.pageName!=''){
           checker.getName.call(this,this.pageName);
        }else if(this.type!=0&&this.pageName!=""){
           checker.getType.call(this,this.type);
           checker.getName.call(this,this.pageName);
        }
      }
   }
 }
</script>
<style scoped>
  table tr td{font-size:14px;}
 .data-choose-top{padding-bottom:25px;}
  h2{text-align: left;border-left:5px solid green;padding-left:10px;}
</style>

