<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>充值管理</span>
  </div>

  <div class="innerwrap">
    <div class="info-content">
      <div class="data-choose-top" style="overflow:hidden">
        <!-- <div class="lf">选择注册时间</div> -->
        <div class="lf">
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
          <input type="text" class="input-small" placeholder="代理商名称" v-model='agencyName'>
        </div>
        <span class="lf">&nbsp;</span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="代理商电话" v-model="agencyPhone">
        </div>
        <span class="lf">&nbsp;</span>
        <div class="lf">
          支付类型：
          <select name="" id="" class="input-small" v-model='Rechargetype'>
            <option value="">全部</option>
            <option value="微信">微信</option>
            <option value="支付宝">支付宝</option>
            <option value="系统充值">系统充值</option>
            <option value="收益充值">收益充值</option>
          </select>
        </div>
        <button class="button-confirm margin-l30" @click="send">查询</button>
        <button class="button-confirm margin-l30" @click="reset">重置</button>
      </div>

      <div class="data-choose-top" style="overflow:hidden">
        <div class="lf">累计充值金额（元）:<i class="color-waring">{{GetAgencyRechargeSum.Object}}元</i></div>
      </div>
      <!-- 表格 -->
      <table>
        <tr class="table-header">
          <td>订单编号</td>
          <td>代理商名称</td>
          <td>代理商手机号</td>
          <td>充值金额(元)</td>
          <td>支付类型</td>
          <td>支付时间</td>
          <td>成功时间</td>
          <td>充值状态</td>
        </tr>
        <tr v-for="item in GetAgencyRechargeList.Items">
          <td>{{item.RechargeNo}}</td>
          <td>{{item.AgencyName}}</td>
          <td>{{item.AgencyPhone}}</td>
          <td>{{item.RechargeBalance}}</td>
          <td>{{item.RechargeMode}}</td>
          <td>{{item.CreateTimer}}</td>
          <td>{{item.RechargeDate}}</td>
          <td>{{item.RechargeStatus==1?"成功":"失败"}}</td>
        </tr>

      </table>
      <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
      <!-- 分页 -->
      <pages :allPage="GetAgencyRechargeList.Total" @pagesChange="getBill"></pages>
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
      Rechargetype: "", //充值方式
      beginshow: false,
      haveNone: false,
      endshow: false,
      pageIndex: 1,
      agencyName: "",
      agencyPhone: "",
      GetAgencyRechargeList: "",
      GetAgencyRechargeSum:'',//累计充值金额
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
        type: this.Rechargetype,
        agencyName: this.agencyName,
        agencyPhone: this.agencyPhone
      });
      this.vq.bindTo({
        url: "/api/Recharge/GetAgencyRechargeList",
        data: _data,
        addfn: function(res) {
          that.haveNone = false;
          if (res.Items.length < 1) {
            that.haveNone = true;
          }
        }
      });
      this.vq.bindTo({
        url: "/api/Recharge/GetAgencyRechargeSum",
        data: _data,
        addfn: function(res) {
          console.log(res);
        }
      })
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
      this.agencyName = '';
      this.haveNone = false;
      this.agencyPhone = '';
      this.send();
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
