<template>
  <div class="wraper personinfo-wrap">
        <tabbar></tabbar>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>植入广告设置</span>
        </div>
            <div class="innerwrap">
              <div class="info-content">
               <div class="data-choose-top" style="overflow:hidden">
                <!-- <div class="lf">选择注册时间</div> -->
 
               <span class="lf">&nbsp;</span>
                <div class="lf">
                  广告类型：
                  <select name="" id="" class="input-small" v-model='aDType'>
                      <option value="">全部</option>
                      <option value="自有业务">自有业务</option>
                      <option value="合作商业务">合作商业务</option>
                  </select>
                </div>
                <span class="lf">&nbsp;</span>
                <div class="lf">
                  广告目标：
                  <input type="text" class="input-small" placeholder="请输入目标" v-model='gameTypeId'>
                </div>
                <span class="lr">&nbsp;</span>
                 <button class="button-confirm margin-l30" @click="send">查询</button>
                 <button class="button-confirm margin-l30" @click="reset">重置</button>  
               </div>

               <div  class="data-choose-top margin-b25" style="overflow:hidden">
                  <div class="lr"></div> 
                  <span class="lr">&nbsp;</span> 
                  <div class="lr"><button class="button-confirm" @click="deletearr">删除</button></div>
                  <span class="lr">&nbsp;</span>
                  <div class="lr"><button class="button-confirm" @click="showpop">新增</button></div>
               </div>
                <!-- 表格 -->
                <table >
                  <tr class="table-header"> 
                    <td>序号</td>
                    <td>广告名称</td>
                    <td>到期时间</td>
                    <td>广告类型</td>
                    <td>广告目标</td>
                    <td>广告位置</td>
                    <td>备注</td>
                    <td>广告链接</td>
                    <td>图片像素</td>
                    <td>X偏移</td>
                    <td>Y偏移</td>
                    <td>是否置顶</td>
                    <td>自动关闭时长(秒)</td>
                    <td>图片</td>
                    <td>操作</td>
                  </tr>
                  <tr v-for="(item,index) in GetList.Items">
                     <td><input type="checkbox" class="small-checkbox" v-model="item.isRadio" @click="chooseTr(item)">{{index+1}}</td>
                     <td>{{item.ADName}}</td>
                     <td>{{item.ExpirationTime}}</td>
                     <td>{{item.ADType}}</td>
                     <td>{{item.GameTypeId}}</td>
                     <td>{{item.ADShowLocation}}</td>
                     <td>{{item.Remark}}</td>
                     <td>{{item.ADOpenUrl}}</td>
                     <td>{{item.ADImageWidth+"*"+item.ADImageHeight}}</td>
                     <td>{{item.ADOffsetX}}</td>
                     <td>{{item.ADOffsetY}}</td>
                     <td>{{item.IsTop}}</td>                     
                     <td>{{item.ShowTime}}</td>
                     <td class="table-link" @click="showimg(item)">查看</td>
                     <td><button class="button-confirm" @click="reverse(item)">修改</button></td>
                  </tr>
          
                </table> 
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
                 <!-- 分页 -->
               <pages :allPage="GetList.Total" @pagesChange="getBill"></pages>  
              </div>
        </div>
  <floatboard v-if="popshow" @hiddenWindow="hiddenWindow" :confirmWay="addAd">
     <div>
       <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>添加广告设置</span>
       </div>  
       <div class="ad-content overflow float-content">
          <div class="lf handlerow">
              <span>广告类型</span>
              <select v-model='addData.ADType'>
                <option value="自有业务">自有业务</option>
                <option value="合作商业务">合作商业务</option>
              </select>
           </div> 
          <div class="lf handlerow">
              <span>广告名称</span>
              <input type="" name="" placeholder="请输入广告名称"   v-model='addData.ADName'/>
           </div>
          <div class="lf handlerow">
              <span>广告过期时间</span>
              <input type="" name="" placeholder="请输入过期时间"   v-model='addData.ExpirationTime' @click="showrili(0)"/>
              <Calendar v-on:choseDay="clickDay" v-if="beginshow"></Calendar>
           </div>                        
          <div class="lf handlerow">
              <span>广告目标</span>
              <input type="" name="" placeholder="请输入广告目标"   v-model='addData.GameTypeId'/>
           </div>                   
          <div class="lf handlerow">
              <span>广告位置</span>
              <input type="" name="" placeholder="请输入广告位置"   v-model='addData.ADShowLocation'/>
           </div>
          <div class="lf handlerow">
              <span>广告X偏移</span>
              <input type="" name="" placeholder="请输入广告X位置"   v-model='addData.ADOffsetX'/>
           </div>
           <div class="lf handlerow">
              <span>广告Y偏移</span>
              <input type="" name="" placeholder="请输入广告Y位置"   v-model='addData.ADOffsetY'/>
           </div>  
           <div class="lf handlerow">
              <span>是否置顶</span>
              <select v-model="addData.IsTop">
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
           </div>                              
          <div class="lf handlerow">
              <span>自动关闭时长</span>
              <input type="" name="" placeholder="时长"  v-model='addData.ShowTime'/>
           </div>
          <div class="lf handlerow">
              <span>像素高度</span>
              <input type="" name="" placeholder="图片像素高度"   v-model='addData.ADImageHeight'/>
           </div>  
          <div class="lf handlerow">
              <span>像素宽度</span>
              <input type="" name="" placeholder="图片像素宽度"   v-model='addData.ADImageWidth'/>
           </div> 
          <div class="lf handlerow">
              <span>广告链接</span>
              <input type="" name="" placeholder="广告跳转链接地址"  class="input-big" v-model='addData.ADOpenUrl'/>
          </div>  
          <div class="lf handlerow ad-imgadder">
             <span>广告图片</span>
             <input type="file" name="" @change="handleImg" ref="imgel" v-show="false"/>
             <img :src="imgrc" class="file-img" alt="选择图片" @click="clikfile">
             <span class="color-waring" @click="closeimg">X</span>
          </div> 
          <div class="lf handlerow">
           <span>备注</span>
            <textarea  v-model='addData.Remark'></textarea>
          </div>                                                              
       </div> 
     </div>
  </floatboard>
  <floatboard v-if="repopshow" @hiddenWindow="hiddenWindow" :confirmWay="reverseAd">
     <div>
       <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>植入广告设置</span>
       </div>  
       <div class="ad-content overflow float-content">
          <div class="lf handlerow">
              <span>广告类型</span>
              <select v-model='nowreverse.ADType'>
                <option value="自有业务">自有业务</option>
                <option value="合作商业务">合作商业务</option>
              </select>
           </div> 
          <div class="lf handlerow">
              <span>广告名称</span>
              <input type="" name="" placeholder="请输入广告名称"   v-model='nowreverse.ADName'/>
           </div>
          <div class="lf handlerow">
              <span>广告过期时间</span>
              <input type="" name="" placeholder="请输入过期时间"   v-model='nowreverse.ExpirationTime' @click="showrili(1)"/>
              <Calendar v-on:choseDay="clickDayre" v-if="beginshowre"></Calendar>
           </div>                        
          <div class="lf handlerow">
              <span>广告目标</span>
              <input type="" name="" placeholder="请输入广告目标"   v-model='nowreverse.GameTypeId'/>
           </div>                   
          <div class="lf handlerow">
              <span>广告位置</span>
              <input type="" name="" placeholder="请输入广告位置"   v-model='nowreverse.ADShowLocation'/>
           </div>
          <div class="lf handlerow">
              <span>广告X偏移</span>
              <input type="" name="" placeholder="请输入广告X位置"   v-model='nowreverse.ADOffsetX'/>
           </div>
           <div class="lf handlerow">
              <span>广告Y偏移</span>
              <input type="" name="" placeholder="请输入广告Y位置"   v-model='nowreverse.ADOffsetY'/>
           </div>  
           <div class="lf handlerow">
              <span>是否置顶</span>
              <select v-model="nowreverse.IsTop">
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
           </div>           
          <div class="lf handlerow">
              <span>自动关闭时长</span>
              <input type="" name="" placeholder="时长"  v-model='nowreverse.ShowTime'/>
           </div>
          <div class="lf handlerow">
              <span>像素高度</span>
              <input type="" name="" placeholder="图片像素高度"   v-model='nowreverse.ADImageHeight'/>
           </div>  
          <div class="lf handlerow">
              <span>像素宽度</span>
              <input type="" name="" placeholder="图片像素宽度"   v-model='nowreverse.ADImageWidth'/>
           </div> 
          <div class="lf handlerow">
              <span>广告链接</span>
              <input type="" name="" placeholder="广告跳转链接地址"  class="input-big" v-model='nowreverse.ADOpenUrl'/>
          </div>  
          <div class="lf handlerow ad-imgadder">
             <span>广告图片</span>
             <input type="file" name="" @change="handleImg" ref="imgel" v-show="false"/>
             <img :src="imgrc" class="file-img" alt="选择图片" @click="clikfile">
             <span class="color-waring" @click="closeimg">X</span>
          </div> 
          <div class="lf handlerow">
           <span>备注</span>
            <textarea  v-model='nowreverse.Remark'></textarea>
          </div>                                                              
       </div> 
     </div>
  </floatboard>  
   <floatboard v-if="imgpopshow" @hiddenWindow="hiddenWindow"  >
     <div>
       <img :src="nowimg">
     </div>
  </floatboard>
  </div>
</template>

<script>
   import tabbar from "../tabbar.vue";
   import axios from "axios";
   import Calendar from 'vue-calendar-component';
   import pages from '../pages.vue'
   import floatboard from "../floatboard"
   export default{
     name: 'barbill',
     components:{
       tabbar,
       Calendar,
       pages,
       floatboard,
     },
     data:function(){
      return{
       beginshowre:false, 
       beginshow:false,
       beginTime:"",
       gameTypeId:"",
       chooseTrDate:[],
       endTime:"",
       nowimg:"",
       beginshow:false,
       endshow:false,
       haveNone:false,
       imgrc:"../../../static/addimg.png",
       imgpopshow:false,
       repopshow:false,
       nowreverse:{},
       popshow:false,
       aDType:"",
       addData:{
          ADName: "",
          ADType: "",
          GameTypeId: "",
          ADShowLocation: "",
          ADImageUrl: "../../../static/addimg.png",
          ADImageWidth: 0,
          ADImageHeight: 0,
          ADOpenUrl: "",
          ExpirationTime:"",
          ShowTime: 0,
          Remark: "" ,
          IsTop:"false",
          ADOffsetX:"",
          ADOffsetY:"",      
       },
       pageIndex:1,
       GetList:[]
      }
     },
    mounted:function(){
      this.getBill(); 
    },      
    methods:{
      getBill:function(adder){
        var that=this;
        this.pageIndex=this.$route.query.pages||1;
        var _target=this.vq.v(this).getData("pager");
        var _addata=_target;
        if(this.aDType){
          _addata=this.vq.objectAdd(_target,{aDType:this.aDType}); 
        }
        if(this.gameTypeId){
          _addata=this.vq.objectAdd(_addata,{gameTypeId:this.gameTypeId})
        }
        this.vq.v(this).bindTo({
          url:"/api/Advertising/GetList",
          data:_addata,
          addfn:function(res){
            var _object=res;
            _object.Items=that.vq.insertTo(_object.Items,"isRadio",false);
            that.GetList=_object;
             that.haveNone = false;
           if (res.Items.length < 1) {
                that.haveNone = true;
              }
          },
         })        
      },
      chooseTr:function(item){
         if(!item.isRadio){
           this.chooseTrDate.push(item.ADID);
         }else{
           for(var i=0;i<this.chooseTrDate.length;i++){
              if(this.chooseTrDate[i]==item.ADID){
                 this.chooseTrDate.splice(i,1);
              }
           }
         }
      },
      addAd:function(){
         var that=this;
         console.log(this.imgrc);
         this.vq.sendMes({
          url:"/api/Advertising/Add",
          type:"post",
          data:that.addData,
          fn:function(res){
            that.unit.MessHandle.call(that,res);
            that.addData={
              ADName: "",
              ADType: "",
              GameTypeId: "",
              ADShowLocation: "",
              ADImageUrl: "../../../static/addimg.png",
              ADImageWidth: 0,
              ADImageHeight: 0,
              ADOpenUrl: "",
              ExpirationTime:"",
              ShowTime: 0,
              Remark: "" ,
              IsTop:"false",
              ADOffsetX:"",
              ADOffsetY:"",     
           };
           that.getBill(); 
          }
         })
      },
      showimg:function(item){
        this.imgpopshow=true;
        this.nowimg=item.ADImageUrl;
      },
      reverseAd:function(){
        var that=this;
         this.vq.v(this).sendMes({
          url:"/api/Advertising/Modefy",
          type:"post",
          data:that.nowreverse,
          fn:function(res){
            that.unit.MessHandle.call(that,res,'修改成功');
            that.addData={
              ADName: "",
              ADType: "",
              GameTypeId: "",
              ADShowLocation: "",
              ADImageUrl: "../../../static/addimg.png",
              ADImageWidth: 0,
              ADImageHeight: 0,
              ADOpenUrl: "",
              ExpirationTime:"",
              ShowTime: 0,
              Remark: "" ,
              IsTop:"false",
              ADOffsetX:"",
              ADOffsetY:"",     
           };
           this.getBill();            
          }
         })        
      },
      deletearr:function(){
        var that=this;
       for(var i=0;i<this.chooseTrDate.length;i++){
         this.vq.v(this).sendMes({
          url:"/api/Advertising/Delete/"+that.chooseTrDate[i],
          type:"post",
          data:{id:that.chooseTrDate[i]},
          fn:function(res){
            that.unit.MessHandle.call(that,res,'删除成功');
            that.getBill();
          },
          isAsycn:true
         })
       }
      },
      reverse:function(item){
       this.repopshow=true;
       this.nowreverse=item;
       this.imgrc=item.ADImageUrl;
      },
      showpop:function(){
       this.popshow=true;
      },
      hiddenWindow:function(){
        this.imgpopshow=false;
        this.popshow=false;
        this.repopshow=false;
      },
      clikfile:function(){
       this.$refs.imgel.click();
      },
      handleImg:function(){
        var that=this;
        var fr= new FileReader();
        var fm=new FormData();
        fm.append('myfile',that.$refs.imgel.files[0]);    
        fr.readAsDataURL(that.$refs.imgel.files[0]);
        fr.onload=function(){
           that.imgrc=fr.result;
           that.vq.v(that).sendMes({
             url:"http://d.580tequan.com/api/UploadFile/UploadFile/",
             data:fm,
             type:"post",
             fn:function(res){
               that.addData.ADImageUrl=res;
               that.nowreverse.ADImageUrl=res;
             },
             err:function(res){
                alert('图片添加失败');
             }
           });    
        };

      },
      clickDay:function(day){
        var _day=this.unit.timeEncode(new Date(day)).split("T")[0];
        this.addData.ExpirationTime=_day+" 00:00:00";
        this.beginshow=false;
      },
      clickDayre:function(days){
         var _day=this.unit.timeEncode(new Date(days)).split("T")[0];
         this.nowreverse.ExpirationTime=_day+" 00:00:00";
         this.beginshowre=false;       
      },
      closeimg:function(){
        this.imgrc="../../../static/addimg.png";
      },
      showrili:function(type){
         if(type==0){
          this.beginshow=!this.beginshow;
         }else{
          this.beginshowre=!this.beginshowre;
         }
      },
      send:function(){
        this.getBill();
       this.pageIndex=1;
       this.$router.push("?pages=1")        
      },
      reset:function(){
        this.aDType='';
        this.gameTypeId='';
        this.haveNone = false;
        this.getBill();
      }
   }
 }
</script>
<style >
 .haveNoneS {
    margin-top: 50px;
    text-align: center;
    color: gray;
  } 
</style>

