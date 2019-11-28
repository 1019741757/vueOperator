export default{
  rilishow:function(type){
     if(type==0){
        this.beginshow=!this.beginshow;
        this.endshow=false;
      }
      else{
        this.endshow=!this.endshow;
        this.beginshow=false;
      }
  },
   getImgCode:function(){
    var that=this
     this.vq.v(this).sendMes({
       url:"/api/Account/GetVerifyCode",
       fn:function(res){
         that.GetVerifyCode=res.Object;
       }
     })
   },
   getCode:function(){
     var that=this;
     that.nowCodeclass="back-grey";
     clearInterval(that.timer);
     that.timer=setInterval(function(){
        if(that.time==0){
           clearInterval(that.timer);
           that.nowCodeclass="back-confirm";
           that.nowCodeword="获取验证码";
           that.time=60;
           }else{
               that.time--;
               that.nowCodeword=that.time+"S后再发送";
            }
     },1000)
   },
   showWindow:function(mes){
     this.$store.state.primaryInfo="";
     this.$store.state.primaryshow=true;
   },
   timeEncode:function(data){
     var str="";
     var data=data||new Date();
     str+=data.getFullYear()+"-";
     str+=data.getMonth()+1<=9?'0'+(data.getMonth()+1)+"-":data.getMonth()+1+"-";
     str+=data.getDate()<=9?'0'+data.getDate()+"T":data.getDate()+"T";
     str+="00:00:00";
     return str;
   },
   DateSend:function(fn,addob){
     var _begintime=new Date(this.beginTime);
     var _endtime=new Date(this.endTime);
     if(_endtime<_begintime){
      alert("开始时间大于结束时间")
     }else{
       this.pageIndex=1;
       this.$router.push("?pages=1")
       if(this.$route.query.pages==1){
         fn(addob);
       }
     }
   },
   getFinal:function(adder,type){
      var _adder={};
      for(var item in adder){
        if(adder[item]){
         _adder[item]=adder[item]
        }else{

        }
      }
      var _target=this.vq.v(this).getData("datePager");
      if(type){
        _target=this.vq.v(this).getData("nodefaultdatePager");
      }
      var _addata=this.vq.objectAdd(_target,_adder);
      if(type){

      }else{
        this.beginTime=_addata.startTime.split("T")[0];
        this.endTime=_addata.endTime.split("T")[0];
      }

      return _addata;
   },
    /*如何去除js对象中的空值（undefined，null），以及空对象*/
   // getFinalTwo:function(ob){
   //   for (let e in ob) {
   //     if (typeof(ob[e]) === 'undefined' || ob[e] === null|| ob[e] === '') {
   //       delete ob[e];
   //     } else if (ob[e].constructor === Object) {
   //       if (Object.keys(ob[e]).length === 0) {
   //         delete ob[e];
   //       } else {
   //         getFinalTwo(ob[e]);
   //       }
   //     } else if (ob[e].constructor === Array) {
   //       ob[e].map(function(seg) {
   //         if (typeof(seg) === 'object') {
   //           getFinalTwo(seg);
   //         }
   //       });
   //     }
   //   }
   //   return ob;
   // },
   dataFor:function(data,handle){
    var that=this;
     var Factor={
       getDate:function(data){
        var datacha=data[1]-data[0];
        var daycha=datacha/1000/60/60/24+1;
        var arr=[];
        for(var i=0;i<daycha;i++){
          var _data=data[0].toString();
          var time=that.timeEncode(new Date(new Date(_data).setDate(new Date(_data).getDate()+i)));
          time=time.split("T")[0];
          arr.push(time);
        }
        return arr;
       },
      getEaring:function(res){
        var arr=[[],[],[],[],[]];
        for(var i=0,len=res.length;i<len;i++){
          arr[0].push(res[i].OpenWindowClientEarning);
          arr[1].push(res[i].NotOpenWindowClientEarning);
          arr[2].push(res[i].HomePage);
          arr[3].push(res[i].Shortcut);
          arr[4].push(res[i].EarningFromSubordinate)
        }
        return arr;
      },
     }
    return Factor[handle](data);
   },
      MessHandle:function(res,mes){
        var mes=mes||'操作成功';
       if(res.StatusCode==200){
         this.$store.state.primaryInfo='操作成功';
       }else{
         this.$store.state.primaryInfo='操作失败';
       }
         this.$store.state.primaryshow=true;
      }
}
