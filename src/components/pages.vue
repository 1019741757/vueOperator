<template>
  <div class="pages overflow padding-pb">
    <div class="record-num lf">共<span class="color-waring">{{allPage}}</span>条记录</div>
    <div class="lr pages-list">
      <div class="lf"><span @click="changePage(1)">首页</span></div>
      <div class="lf"><span @click="gopage('golast')">上一页</span></div>
      <div class="page-row lf">
        <div><span :class="{'page-now':nowpages==index+1}" v-for='(item,index) in pageNum' @click="changePage(item)">{{item}}</span></div>
      </div> 
      <span v-if="pageNum>23" class="lf">...</span>
      <div class="lf"><span @click="gopage('godown')">下一页</span></div>
      <div class="lf"><span @click="changePage(pageNum)">尾页</span></div>
    </div>
  </div>  
</template>

<script>
export default {
  name: 'pages',
  props:['allPage',"pageSize"],
  data:function() {
    return {
      nowpages:this.$route.query.pages||1,
      pages:this.$route.query.pages,
      passpage:"",
    }
  },
  watch:{
    $route:function(){
      this.nowpages=this.$route.query.pages||1
    }
  },
  computed:{
    pageNum:function(){
      var _allpage=this.allPage||0;
      var pagesize=this.pageSize||8;
      var _pageNum=Math.ceil(_allpage/pagesize);
      return _pageNum;
    }
  },
  methods:{
    changePage:function(item){
      this.$router.push("?pages="+item);
      this.nowpages=item;
      this.$emit('pagesChange')
    },
    gopage:function(way){
      way=='golast'?this.nowpages--:this.nowpages++;
      if(this.nowpages<1) this.nowpages=1;
      if(this.nowpages>this.pageNum) this.nowpages=this.pageNum;
      this.$router.push("?pages="+this.nowpages);
      this.nowpages=this.nowpages;
      this.$emit('pagesChange');
    }
  },
  mounted:function(){
    
  }
}
</script>

<style>
 .pages{
  margin-top: 35px;
 }
 .pages-list{

 }
  .pages-list>div{
    padding:10px 0px;
  }
 .page-row{
   max-width: 1000px;
   overflow: hidden;
 }
 .pages-list span{
  border:1px solid #ddd;
  margin-left:10px;
   color:#999;
  padding:5px;
  cursor: pointer;
 }
 span.page-now{
  background-color: #6d9dd6;
  color: white;
  cursor: pointer;
 }
</style>
