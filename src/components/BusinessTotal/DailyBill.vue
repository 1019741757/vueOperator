<template>
  <div class="wraper personinfo-wrap">
  	   <tabbar></tabbar>
      <div class="box">
        <h2>每日账单</h2>
      </div>
  </div>
</template>

<script>
         import tabbar from "../tabbar.vue";
   import axios from "axios"
   export default{
   	components:{
   		tabbar
   	}
   }
</script>
<style scoped>

  .box{width: 100%;border-bottom: 1px solid #ccc;padding-bottom:16px;}
  h2{text-align: left;border-left:5px solid green;padding-left:10px;}
</style>
