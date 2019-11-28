<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>网吧消费账单</span>
  </div>

  <div class="innerwrap">
    <div class="info-content">
      <div class="data-choose-top" style="overflow:hidden">
        <!-- <div class="lf">选择注册时间</div> -->
        <div class="lf">
          选择消费时间&nbsp;
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
          <input type="text" class="input-small" placeholder="请输入网吧名称" v-model='barname'>
        </div>
        <span class="lf">&nbsp;</span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="代理商名称" v-model='$store.state.barbillconsume.AgencyName'>
        </div>
        <span class="lf">&nbsp;</span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="代理商ID" v-model="$store.state.barbillconsume.AgencyId">
        </div>
        <button class="button-confirm margin-l30" @click="send">查询</button>
        <button class="button-confirm margin-l30" @click="reset">重置</button>
      </div>
      <div class="data-choose-top" style="overflow:hidden">
        <div class="lf">网吧特权消费总计:<i class="color-waring">{{GetNetbarConsumeBill.Object&&GetNetbarConsumeBill.Object.orderPriceSum}}元</i></div>
        <span class="lf">&nbsp;</span>
        <div class="lf">steam特权钻石版消费总计:<i class="color-waring">{{GetNetbarConsumeBill.Object&&GetNetbarConsumeBill.Object.Steam}}元</i></div>
        <span class="lf">&nbsp;</span>
        <div class="lf">加速器特权消费总计:<i class="color-waring">{{GetNetbarConsumeBill.Object&&GetNetbarConsumeBill.Object.Accelerator}}元</i></div>
        <span class="lf">&nbsp;</span>
      </div>
      <!-- 表格 -->
      <table>
        <tr class="table-header">

          <td>网吧名称</td>
          <td>所属代理商名称</td>
          <td>代理商ID</td>
          <td>steam特权钻石版</td>
          <td>加速器特权</td>
          <td>合计(元)</td>
        </tr>
        <tr v-for="item in GetNetbarConsumeBillList.Items">

          <td>{{item.NetbarName}}</td>
          <td>{{item.AgencyName}}</td>
          <td>{{item.AgencyId}}</td>
          <td>{{item.ProductDetailed.Steam}}</td>
          <td>{{item.ProductDetailed.Accelerator}}</td>
          <td>{{item.PriceSum}}</td>
        </tr>
      </table>
      <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
      <!-- 分页 -->
      <pages :allPage="GetNetbarConsumeBillList.Total" @pagesChange="getBill"></pages>
    </div>
  </div>

</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
import Calendar from 'vue-calendar-component';
import pages from '../pages.vue'

export default {
  name: 'barbill',
  components: {
    tabbar,
    Calendar,
    pages
  },
  data: function() {
    return {
      beginTime: "",
      endTime: "",
      beginshow: false,
      endshow: false,
      haveNone: false,
      pageIndex: 1,
      name: "",
      agencyId: "",
      barname: '',
      GetNetbarConsumeBillList: {},
      GetNetbarConsumeBill: {}
    }
  },
  mounted: function() {
    this.getBill();
  },
  methods: {
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
      this.$store.state.barbillconsume.AgencyName = '';
      this.$store.state.barbillconsume.AgencyId = '';
      this.barname = '';
      this.haveNone = false;
      this.send();
    },
    getBill: function(adder) {
      var that = this;
      this.pageIndex = this.$route.query.pages || 1;
      var _ob = this.$store.state.barbillconsume;
      _ob.netbarName = this.barname;
      var _data = this.unit.getFinal.call(this, _ob);
      this.vq.bindTo({
        url: "/api/Consume/GetNetbarConsumeBillList",
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
        url: "/api/Consume/GetNetbarConsumeBill",
        data: _data,
        isAsycn: true
      });
    },
    send: function() {
      this.unit.DateSend.call(this, this.getBill);
    },
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
