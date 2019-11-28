<template>
<div class="tabbar back-white">
  <router-link to="/">
    <span>
      <span class="iconfont icon-shouye"></span>
      <span class="menu-top-name">首页</span>
    </span>
  </router-link>
  <span v-for="(item,index) in this.$store.state.openlist" class="cursor-point">
    <span :class='{topbarnow:item[0]===$store.state.nowName}' @click="changenow(item[0],item[2])">
      <span :class="['iconfont',item[3]]"> </span>
      <span class="menu-top-name">{{item[0]}}</span>
      <span class="top-menu-close" @click.stop="deleteItem(index)">X</span>
    </span>
  </span>
</div>
</template>

<script>
export default {
  name: 'tabbar',

  mounted: function() {

  },
  methods: {
    deleteItem: function(index) {
      this.$store.state.openlist.splice(index, 1);
      this.$store.state.nowName = this.$store.state.openlist[index - 1][0];
      this.$router.push(this.$store.state.openlist[index - 1][2]);
    },
    changenow: function(name, url) {
      this.$store.state.nowName = name;
      this.$router.push(url);
    }
  }
}
</script>

<style>
.tabbar {
  height: 50px;
  left: 0px;
  right: 0px;
  box-sizing: border-box;
  padding-left: 250px;
  position: fixed;
  top: 72px;
  line-height: 50px;
  z-index: 88;
}

.top-menu-close {
  display: inline-block;
  background-color: black;
  vertical-align: middle;
  width: 15px;
  height: 15px;
  line-height: 15px;
  font-size: 12px;
  padding: 0;
  text-align: center;
  border-radius: 15px;
  color: white;

}

.cursor-point {
  cursor: pointer;
}

.topbarnow {
  color: #34c0e2;
}

.topbarnow .top-menu-close {
  background-color: #34c0e2;
}
</style>
