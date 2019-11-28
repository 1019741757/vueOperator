<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>每日终端统计</span>
  </div>

  <div class="innerwrap">
    <div class="info-content">
      <div class="data-choose-top" style="overflow:hidden">
        <!-- <div class="lf">选择注册时间</div> -->
        <div class="lf">
          请选择统计时间&nbsp;
          <input class="input-small" type="" name="" placeholder="开始时间" v-model="beginTime" @click="showrili(0)" />
          <Calendar v-on:choseDay="clickDay" v-if="beginshow"></Calendar>
        </div>
        <span class="lf">-</span>
        <div class="lf">
          <input class="input-small" type="" name="" placeholder="结束时间" v-model="endTime" @click="showrili(1)" />
          <Calendar v-on:choseDay="clickEnd" v-if="endshow"></Calendar>
        </div>
        <span class="lf">&nbsp;</span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="请输入网吧名称" v-model='netbarName'>
        </div>
        <span class="lf">&nbsp;</span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="请输入网吧ID" v-model='netbarId'>
        </div>
        <span class="lf">&nbsp;</span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="请输入代理商名称" v-model='agencyName'>
        </div>
        <span class="lf">&nbsp;</span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="请输入代理商ID" v-model='agencyId'>
        </div>
        <button class="button-confirm margin-l30" @click="send">查询</button>
        <button class="button-confirm margin-l30" @click="reset">重置</button>
      </div>
      <div class="data-choose-top" style="overflow:hidden">
        <div class="lf">激活终端总数：<i class="color-waring">{{GetTerminalStatistics.Object&&GetTerminalStatistics.Object.count}}台</i></div>
        <span class="lf">&nbsp;</span>
        <div class="lf">平均日活跃率：<i class="color-waring"> {{GetTerminalStatistics.Object&&GetTerminalStatistics.Object.ratio}}%</i></div>
        <span class="lf">&nbsp;</span>
      </div>
      <table>
        <tr class="table-header">
          <td>日期</td>
          <td>启动终端(次)</td>
          <td>580特权客户端(显示)</td>
          <td>580特权客户端(不显示)</td>
          <td>主页成功数</td>
          <td>主页失败数</td>
          <td>桌标释放成功数</td>
          <td>桌标释放失败数</td>
          <!-- <td>桌标启动次数</td>
          <td>桌标启动终端数</td> -->
          <td>查看</td>
        </tr>
        <tr v-for="item in GetTerminalStatisticsList.Items">
          <td>{{item.Date}}</td>
          <td>{{item.Start}}</td>
          <td>{{item.OpenWin}}</td>
          <td>{{item.NotOpenWin}}</td>
          <td>{{item.SetHomepageSuccess}}</td>
          <td>{{item.SetHomepageFail}}</td>
          <td>{{item.ShortcutSuccess}}</td>
          <td>{{item.ShortcutFail}}</td>
          <!-- <td>{{item.count}}</td>
          <td>{{item.ratio}}</td> -->
          <td><button class="button-confirm margin-l30" @click="showdetail(item)">查看</button></td>
        </tr>
        <tr class="table-header" v-if="GetTerminalStatistics">
          <td>合计</td>
          <td>{{GetTerminalStatistics.Object.Start}}</td>
          <td>{{GetTerminalStatistics.Object.OpenWin}}</td>
          <td>{{GetTerminalStatistics.Object.NotOpenWin}}</td>
          <td>{{GetTerminalStatistics.Object.SetHomepageSuccess}}</td>
          <td>{{GetTerminalStatistics.Object.SetHomepageFail}}</td>
          <td>{{GetTerminalStatistics.Object.ShortcutSuccess}}</td>
          <td>{{GetTerminalStatistics.Object.ShortcutFail}}</td>
          <!-- <td>{{GetTerminalStatistics.Object.count}}</td>
          <td>{{GetTerminalStatistics.Object.ratio}}</td> -->
          <td>无</td>
        </tr>
      </table>
      <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
      <!-- 分页 -->
      <pages :allPage="GetTerminalStatisticsList.Total" @pagesChange="getBill" :data="GetTerminalStatisticsList"></pages>
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
      endTime: "",
      beginshow: false,
      endshow: false,
      haveNone: false,
      type: "day",
      nowpages: 1,
      netbarName: "",
      netbarId: "",
      agencyName: "",
      agencyId: "",
      nowItem: "",
      innerPageSize: 10,
      GetTerminalStatisticsList: "",
      GetTerminalStatistics: "",
      GetNetBarTerminalStatisticsList: "",
      popshow: false,
      innerPageIndex: 1,
    }
  },
  computed: {
    windowpage: function() {
      if (!this.GetNetBarTerminalStatisticsList.Total) {
        return 1
      } else {
        return this.GetNetBarTerminalStatisticsList.Total / 10;
      };
    }
  },
  mounted: function() {
    this.getBill();
  },
  methods: {
    getBill: function(adder) {
      var that = this;
      this.pageIndex = this.$route.query.pages || 1;
      var _data = this.unit.getFinal.call(this, {
        netbarName: this.netbarName,
        netbarId: this.netbarId,
        agencyName: this.agencyName,
        agencyId: this.agencyId
      });
      this.vq.bindTo({
        url: "/api/TerminalStatistics/GetTerminalStatisticsList",
        data: _data,
        isAsycn: true,
        addfn: function(res) {
          that.haveNone = false;
          if (res.Items.length < 1) {
            that.haveNone = true;
          }
        }
      });
      this.vq.bindTo({
        url: "/api/TerminalStatistics/GetTerminalStatistics",
        data: _data,
        isAsycn: true,
      });
    },
    send: function() {
      this.unit.DateSend.call(this, this.getBill);
    },
    clickDay: function(day) {
      this.beginTime = day;
      this.beginshow = false;
    },
    clickEnd: function(day) {
      this.endTime = day;
      this.endshow = false;
    },
    showrili: function(type) {
      this.unit.rilishow.call(this, type);
    },
    reset: function() {
      this.beginTime = '';
      this.endTime = '';
      this.netbarName = '';
      this.netbarId = '';
      this.agencyName = '';
      this.haveNone = false;
      this.agencyId = '';
      this.send();
    },
    showdetail: function(item) {
      this.$router.push("/Terminaldaily?bengin=" + item.Date);
      this.$store.state.nowName = "网吧每日终端统计";
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
