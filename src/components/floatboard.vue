<template>
  <div class="window-wrap"  >
    <div class="window-content" ref="windowbody">
       <div class="window-top overflow"><span class="lr close-window" @click="defaultconfirm">X</span></div>
       <slot></slot>
       <div class="window-button-row"><button class="button-confirm" @click="confirmWayAll">确认</button><button class="button-cancel margin-l30" @click="defaultconfirm" v-if="!ispop">取消</button></div>      
    </div>
  </div>
</template>

<script>
 
 
export default {
  name: 'floatboard',
  props:["confirmWay",'ispop'],
  components:{
 
  },
  data:function(){
   return{
 
   }
  },
  methods:{
   defaultconfirm:function(){
     this.$emit("hiddenWindow");
   },
   confirmWayAll:function(){
    clearTimeout(window.timer);
    if(this.confirmWay){
      this.confirmWay();
      this.$emit("hiddenWindow");
    }else{
     this.$emit("hiddenWindow");      
    }
   }
  },
  mounted:function(){
  var that=this;
  var _width=this.$refs.windowbody.clientWidth;
  var _height=this.$refs.windowbody.clientHeight;
  this.$refs.windowbody.style.marginLeft=-(_width/2)+"px";
  this.$refs.windowbody.style.marginTop=-(_height/2)+"px";
   if(this.ispop){
    clearTimeout(window.timer);
    window.timer=setTimeout(function(){
      that.$store.state.primaryshow=false;
    },2000);
   }
  }
}
</script>
<style>
.window-wrap{
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  background-color: rgba(0,0,0,0.6);
  z-index: 999999;
}
.window-content{
   padding:30px;
   padding-top:10px;
  position: absolute;
 left: 50%;
  top:50%;
  background-color: white;
  border-radius: 15px;
    max-height: 750px;
    overflow: auto;
} 
.window-button-row{
  text-align: center;
}
.close-window{
  cursor: pointer;
}
</style>
