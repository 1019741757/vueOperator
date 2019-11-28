<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>网吧每日终端统计</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <div class="data-choose-top" style="overflow:hidden">
        <div class="lf">
          请选择统计时间&nbsp;
          <input class="input-small" type="" name="" placeholder="开始时间" v-model="beginTime" @click="showrili(0)" />
          <Calendar v-on:choseDay="clickDay" v-if="beginshow"></Calendar>
        </div>
        <div class="lf margin-l30">
          <input type="text" class="input-small" placeholder="网吧ID" v-model='netbarId'>
        </div>
        <div class="lf margin-l30">
          <input type="text" class="input-small" placeholder="网吧名称" v-model='netbarName'>
        </div>
        <div class="lf margin-l30">
          <input type="text" class="input-small" placeholder="代理商ID" v-model='agencyId'>
        </div>
        <div class="lf margin-l30">
          <input type="text" class="input-small" placeholder="代理商名称" v-model='agencyName'>
        </div>
        <button class="button-confirm margin-l30" @click="send">查询</button>
      </div>
      <table>
        <tr class="table-header">
          <td>网吧名称</td>
          <td>启动终端(次)</td>
          <td>580特权客户端(显示)</td>
          <td>580特权客户端(不显示)</td>
          <td>主页成功数</td>
          <td>主页失败数</td>
          <td>桌标释放成功数</td>
          <td>桌标释放失败数</td>

        </tr>
        <tr v-for="item in GetNetBarTerminalStatisticsList.Items">
          <td>{{item.NetbarName}}</td>
          <td>{{item.Start}}</td>
          <td>{{item.OpenWin}}</td>
          <td>{{item.NotOpenWin}}</td>
          <td>{{item.SetHomepageSuccess}}</td>
          <td>{{item.SetHomepageFail}}</td>
          <td>{{item.ShortcutSuccess}}</td>
          <td>{{item.ShortcutFail}}</td>
        </tr>
      </table>
      <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
      <pages :allPage="GetNetBarTerminalStatisticsList.Total" @pagesChange="getBill"></pages>
    </div>
  </div>
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
import Calendar from 'vue-calendar-component';
import pages from '../pages.vue'
import floatboard from "../floatboard"
export default {
  name: 'barbill',
  components: {
    tabbar,
    Calendar,
    pages,
    floatboard
  },
  data: function() {
    return {
      beginTime: "",
      beginshow: "",
      netbarName: "",
      netbarId: "",
      agencyId: "",
      agencyName: "",
      GetNetBarTerminalStatisticsList: "",
      pageIndex: 1,
      haveNone: false,
    }
  },
  computed: {

  },
  mounted: function() {
    this.beginTime = this.$route.query.bengin || this.unit.timeEncode.call(this, new Date(new Date().setDate(new Date().getDate() - 1))).split("T")[0];
    this.getBill();
  },
  methods: {
    showrili: function() {
      this.beginshow = !this.beginshow;
    },
    clickDay: function(day) {
      this.beginshow = false;
      var time = this.unit.timeEncode.call(this, new Date(day))
      this.beginTime = time.split("T")[0];
    },
    send: function() {
      if (this.netbarName) {
        this.getBill();
      } else {
        this.getBill();
      }
    },
    getBill: function(ob) {
      this.pageIndex = this.$route.query.pages || 1;
      var data = {
        pageSize: 10,
        pageIndex: this.pageIndex,
        netbarId: this.netbarId,
        netbarName: this.netbarName,
        agencyId: this.agencyId,
        agencyName: this.agencyName
      };
      if (this.beginTime) {
        data.time = this.beginTime;
      } else {
        data.time = this.unit.timeEncode.call(this, new Date(new Date().setDate(new Date().getDate() - 1)));
      }
      if (ob) {
        data.time = ob;
      } else {

      }
      var _data = this.unit.getFinal.call(this, data, true);
      this.vq.v(this).bindTo({
        url: "/api/TerminalStatistics/GetNetBarTerminalStatisticsList",
        data: _data,
        addfn: function(res) {
          that.haveNone = false;
          if (res.Items.length < 1) {
            that.haveNone = true;
          }
        }
      })
    }
  }
}
</script>
<style scoped>
table tr td {
  font-size: 14px;
}

.data-choose-top {
  padding-bottom: 25px;
}

h2 {
  text-align: left;
  border-left: 5px solid green;
  padding-left: 10px;
}

.haveNoneS {
  margin-top: 50px;
  text-align: center;
  color: gray;
}
</style>
