<template>
<div id="app">
  <sidebar></sidebar>
  <headerbar></headerbar>
  <keep-alive>
    <router-view />
  </keep-alive>
  <floatboard v-if='$store.state.primaryshow' @hiddenWindow="hiddenWindow" :ispop='true'>
    <h5 class="fs-18 padding-pb texta">{{$store.state.primaryInfo}}</h5>
  </floatboard>
</div>
</template>

<script>
import headerbar from "./components/headerBar"
import sidebar from "./components/sideBar"
import floatboard from "./components/floatboard"
export default {
  name: 'App',
  data: function() {
    return {}
  },
  mounted: function() {

  },
  methods: {
    hiddenWindow: function() {
      this.$store.state.primaryshow = false;
    }
  },
  components: {
    headerbar,
    sidebar,
    floatboard
  }
}
</script>

<style>

</style>
