<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>提现管理</span>
  </div>

  <div class="innerwrap">
    <div class="info-content">
      <div class="data-choose-top" style="overflow:hidden">
        <!-- <div class="lf">选择注册时间</div> -->
        <div class="lf">
          申请时间筛选：&nbsp;
          <input class="input-small" type="" name="" placeholder="开始时间" v-model="beginTime" @click="showrili(0)" />
          <Calendar v-on:choseDay="clickDay" v-if="beginshow"></Calendar>
        </div>
        <span class="lf">-</span>
        <div class="lf">
          <input class="input-small" type="" name="" placeholder="结束时间" v-model="endTime" @click="showrili(1)" />
          <Calendar v-on:choseDay="clickEnd" v-if="endshow"></Calendar>
        </div>
        <span class="lf"></span>
        <div class="lf">
          转账时间筛选：&nbsp;
          <input class="input-small" type="" name="" placeholder="开始时间" v-model="trbeginTime" @click="showrili(2)" />
          <Calendar v-on:choseDay="trclickDay" v-if="trbeginshow"></Calendar>
        </div>
        <span class="lf">-</span>
        <div class="lf">
          <input class="input-small" type="" name="" placeholder="结束时间" v-model="trendTime" @click="showrili(3)" />
          <Calendar v-on:choseDay="trclickEnd" v-if="trendshow"></Calendar>
        </div>
      </div>

      <div class="data-choose-top" style="overflow:hidden">
        提现状态：
        <select name="" id="" class="input-small" v-model="state">
          <option value="-1">全部</option>
          <option value="1">已审核待支付</option>
          <option value="0">待审核</option>
          <option value="2">拒绝</option>
          <option value="4">支付成功</option>
          <option value="3">支付失败</option>
        </select>
        &nbsp;
        <input type="text" class="input-small" placeholder="提现编号查询" v-model='thirdOrderNo'>
        <input type="text" class="input-small" placeholder="代理商ID" v-model='agencyId'>
        <button class="button-confirm margin-l30" @click="send">查询</button>
        <button class="button-confirm margin-l30" @click="reset">重置</button>
      </div>


      <div class="data-choose-top" style="overflow:hidden">
        <div class="lf">申请提现总金额:<i class="color-waring">{{TotalWithdrawMoney.Object&&TotalWithdrawMoney.Object.EarningOfPayedTotal}}元</i></div>
        <span class="lf">&nbsp;</span>
        <div class="lf">实际转账总金额:<i class="color-waring">{{TotalWithdrawMoney.Object&&TotalWithdrawMoney.Object.EarningOfTransferTotal}}元</i></div>
        <span class="lf">&nbsp;</span>
        <div class="lf">手续费总金额:<i class="color-waring">{{TotalWithdrawMoney.Object&&TotalWithdrawMoney.Object.EarningOfCommissionTotal}}元</i></div>
      </div>
      <!-- 表格 -->
      <table>
        <tr class="table-header">
          <td>申请时间</td>
          <td>转账时间</td>
          <td>代理商名称</td>
          <td>代理商ID</td>
          <td>申请提现金额(元)</td>
          <td>实际转账金额(元)</td>
          <td>手续费</td>
          <td>提现编号</td>
          <td>提现状态</td>
          <td>转账凭证</td>
          <td>转账方式</td>
          <td>备注</td>
          <td>操作</td>
        </tr>

        <tr v-for="item in GetWithdrawMoneyList.Items">
          <td>{{item.CreateDate}}</td>
          <td>{{item.State==4?item.FinishDate:""}}</td>
          <td>{{item.AgencyName}}</td>
          <td>{{item.AgencyId}}</td>
          <td>{{item.Amount}}</td>
          <td>{{item.ToAccountAmount}}</td>
          <td>{{item.Commission}}</td>
          <td>{{item.Id}}</td>
          <td>{{status(item.State)}}</td>
          <td>{{item.ThirdOrderNo}}</td>
          <td>{{item.TypeName}}</td>
          <td>{{item.Remark}}</td>
          <td v-if="item.State==0" style="width:152px">
            <button class="button-blue" @click="showWindow(item,0)">通过</button>
            <button class="button-blue" @click="showWindow(item,1)">不通过</button>
          </td>
          <td v-else style="width:152px">
            不可操作
          </td>
        </tr>
      </table>
      <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
    </div>
    <!-- 分页 -->
    <pages :allPage="GetWithdrawMoneyList.Total" @pagesChange="getBill"></pages>
  </div>
  <floatboard v-if="boardshow" @hiddenWindow="hiddenWindow" :confirmWay="confirmWay">
    <h4>确认操作?</h4>
  </floatboard>
  <floatboard v-if="boardshowcancel" @hiddenWindow="hiddenWindow" :confirmWay="confirmWay"> <span>输入拒绝理由：</span><input type="text" name="" v-model='rejectreason' /></floatboard>
</div>
</template>

<script>
import pages from '../pages.vue'
import floatboard from "../floatboard"
import tabbar from "../tabbar.vue"
import axios from "axios"
import Calendar from 'vue-calendar-component';
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
      trbeginTime: "",
      trendTime: "",
      beginshow: false,
      endshow: false,
      trbeginshow: false,
      haveNone: false,
      trendshow: false,
      // pageSize:5,
      pageIndex: 1,
      state: "",
      agencyId: "",
      thirdOrderNo: "",
      TotalWithdrawMoney: "",
      GetWithdrawMoneyList: [],
      boardshow: "",
      nowItem: "",
      nowType: "",
      rejectreason: "",
      boardshowcancel: false,
    }
  },
  created: function() {
    this.getBill();
  },
  mounted: function() {
    this.getBill();
  },
  methods: {
    hiddenWindow: function() {
      this.boardshow = false;
      this.boardshowcancel = false;
    },
    confirmWay: function() {
      var id = this.nowItem.Id;
      var that = this;
      var type = !this.nowType;
      var _data = {
        withdrawId: id,
        isAudit: type
      };
      var _url = "/api/Agency/WithdrawMoneyAudit?withdrawId=" + id + "&isAudit=" + type;
      if (this.nowType == 1) {
        _data.remark = this.rejectreason;
        _url = "/api/Agency/WithdrawMoneyAudit?withdrawId=" + id + "&isAudit=" + type + "&remark=" + this.rejectreason;
      }
      this.vq.sendMes({
        url: _url,
        type: "post",
        fn: function(res) {
          that.getBill();
        },
        err: function(err) {
          that.$store.state.primaryshow = true,
            that.$store.state.primaryInfo = err.response.data.Message;
        },
        data: _data
      })
    },
    showWindow: function(item, type) {
      if (type == 0) {
        this.boardshow = true;
      } else {
        this.boardshowcancel = true;
      }

      this.nowItem = item;
      this.nowType = type;
    },
    reset: function() {
      this.beginTime = '';
      this.endTime = '';
      this.trbeginTime = '';
      this.trendTime = '';
      this.thirdOrderNo = '';
      this.haveNone = false;
      this.state = '';
      this.getBill();
    },
    getBill: function(adder) {
      var that = this;
      this.pageIndex = this.$route.query.pages || 1;
      var _data = {
        startApplyTime: this.beginTime == "" ? "" : that.unit.timeEncode(new Date(this.beginTime)),
        endApplyTime: this.endTime == "" ? "" : that.unit.timeEncode(new Date(this.endTime)),
        startTransferTime: this.trbeginTime == "" ? "" : that.unit.timeEncode(new Date(this.trbeginTime)),
        endTransferTime: this.trendTime == "" ? "" : that.unit.timeEncode(new Date(this.trendTime)),
        thirdOrderNo: this.thirdOrderNo,
        state: this.state,
        agencyId: this.agencyId
      };

      var finalDate = {};

      for (var item in _data) {
        if (!_data[item]) {
          if (item == "startApplyTime") {
            //finalDate.startApplyTime=that.unit.timeEncode(new Date(new Date().setDate(new Date().getDate() - 6)));
          }
          if (item == "endApplyTime") {
            // finalDate.endApplyTime=that.unit.timeEncode(new Date(new Date().setDate(new Date().getDate()-1)));
          }
          if (item == "startTransferTime") {
            // finalDate.startTransferTime=that.unit.timeEncode(new Date(new Date().setDate(new Date().getDate() - 6)));
          }
          if (item == "endTransferTime") {
            // finalDate.endTransferTime=that.unit.timeEncode(new Date(new Date().setDate(new Date().getDate()-1)));
          }
        } else {
          finalDate[item] = _data[item];
        }
      };
      if (this.state) {
        finalDate.state = this.state;
      }
      if (this.thirdOrderNo) {
        finalDate.tid = this.thirdOrderNo;
      }
      var _data = this.unit.getFinal.call(this, finalDate, true);
      this.vq.v(this).bindTo({
        url: "/api/Agency/GetWithdrawMoneyList",
        data: _data,
        isAsycn: true,
        addfn: function(res) {
          that.haveNone = false;
          if (res.Items.length < 1) {
            that.haveNone = true;
          }
        }
      });
      this.vq.v(this).bindTo({
        url: "/api/Agency/TotalWithdrawMoney",
        data: _data,
        type: "get",
        isAsycn: true
      })
    },
    send: function() {
      this.getBill();
    },
    clickDay: function(day) {
      this.beginTime = day;
      this.beginshow = false;
    },
    clickEnd: function(day) {
      this.endTime = day;
      this.endshow = false;
    },
    trclickDay: function(day) {
      this.trbeginTime = day;
      this.trbeginshow = false;
    },
    status: function(num) {
      var arr = ['待审核', "已审核待支付", "拒绝", "支付失败", "支付成功"];
      return arr[num];
    },
    trclickEnd: function(day) {
      this.trendTime = day;
      this.trendshow = false;
    },
    showrili: function(type) {
      if (type === 0) {
        this.beginshow = !this.beginshow;
      } else if (type == 1) {
        this.endshow = !this.endshow
      } else if (type == 2) {
        this.trbeginshow = !this.trbeginshow;
      } else {
        this.trendshow = !this.trendshow;
      }
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
