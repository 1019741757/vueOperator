<template>
<div class="headerbar back-theme color-w">
  <!-- 	   <span class="concat-li">
	   	 <font class="iconfont icon-iconfonticonfontweibiaoti101516"></font>

	   	 <span>客户经理</span>
	   </span>
	   <span  class="concat-li">
	   	<font class="iconfont icon-iconfonticonfontweibiaoti101516 "></font>
	   	<span>技术支持</span>
	   </span> -->
  <div class="img-content margin-b10 color-w">
    580运营商管理后台
  </div>
  <span class="user-info-top padding-tb-0">
    <img src="../assets/img/userlogo.jpg">
    <font @click="out();return false;">退出 &nbsp;&nbsp;</font>
  </span>
</div>
</template>

<script>
export default {
  name: 'HeaderBar',
  methods: {
    out: function() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.vq.cookier.deleteCookies('token');
        this.vq.cookier.deleteCookies('UserName');
        // this.$router.push({
        //   path: '/AgentList'
        // })
        //   window.location.href="http://passport111.ggzuhao.com/";
        window.location.href = "http://passport111.ggzuhao.com/"
      }).catch(() => {});
    }

  }
}
</script>

<style>
.concat-li {
  padding-right: 15px;
}

.headerbar {
  height: 70px;
  line-height: 70px;
  text-align: right;
  padding-right: 35px;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 999;
}

.user-info-top {
  padding-left: 35px;

}

.user-info-top img {
  width: 30px;
  vertical-align: middle;
}

.user-info-top font {
  vertical-align: middle;
  padding-left: 10px;
  cursor: pointer;
}

.getout {
  vertical-align: middle;
  margin-right: 25px;
}
</style>
