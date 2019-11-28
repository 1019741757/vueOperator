<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span> 单桌标有效终端月账单 </span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="条件筛选：" style="margin-bottom: 5px">
            <el-date-picker v-model="Datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="DateChange" clearable></el-date-picker>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="agencyId" auto-complete="off" placeholder="代理商ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="title_pop">
        <span>单桌标激活终端总数：<a>{{MonthlySettlementBillsSumList.AllClientCount}} 台</a> </span>
        <span>累计结算终端：<a>{{MonthlySettlementBillsSumList.ClientCount}} 台</a> </span>
        <span>已结算终端数：<a>{{MonthlySettlementBillsSumList.Settled}} 台</a> </span>
        <span>未结算终端数：<a>{{MonthlySettlementBillsSumList.Unsettled}} 台</a> </span>
        <span>已结算金额：<a>{{MonthlySettlementBillsSumList.Money}} 元</a> </span>
      </div>
      <!-- 表格 -->
      <el-table :data="dataList" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="CreateDateStr" label="月份" width="180"></el-table-column>
        <el-table-column property="ClientCount" label="结算终端（台）"></el-table-column>
        <el-table-column property="Unsettled" label="未结算终端（台）"></el-table-column>
        <el-table-column property="Settled" label="已结算终端（台）"></el-table-column>
        <el-table-column property="Money" label="已结算金额（元）"></el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'MonthlySettlementBills',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选：
      agencyId: null,
      startTime: '',
      endTime: '',
      Datevalue: {},
      dataList: [],
      MonthlySettlementBillsSumList: {},
    }
  },
  created() {
    this.getData();
  },
  methods: {
    //页数   pageSize 改变时会触发
    handleCurrentChange: function(val) {
      this.pageNo = val;
      this.getData();
    },
    //页码 currentPage 改变时会触发
    sizeCurrentChange: function(val) {
      this.pageSize = val;
      this.getData();
    },
    onSubmit: function() {
      this.pageNo = 1;
      this.getData();
    },
    //活动时间
    DateChange: function() {
      if (this.Datevalue) {
        var date1 = this.Datevalue[0];
        var date2 = this.Datevalue[1];
        this.startTime = this.$moment(date1).format("YYYY-MM-DD");
        this.endTime = this.$moment(date2).format("YYYY-MM-DD");
        this.getData();
      } else {
        this.startTime = '';
        this.endTime = '';
        this.getData();
      }
    },
    //tabel数据获取
    getData: function() {
      var that = this;
      var getArr = {
        agencyId: this.agencyId,
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      console.log(getArr);
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/TerminalStatistics/MonthlySettlementBills",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.dataList = res.Items;
          that.total = res.Total;
        }
      })
      this.vq.bindTo({
        url: "/api/TerminalStatistics/MonthlySettlementBillsSum",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          console.log(res);
          that.MonthlySettlementBillsSumList = res.Object;
        }
      })
    },
    OneSub: function(row) {
      this.$router.push({
        path: '/AgentList',
        query: {
          parentId: row.ParentId
        }
      });
    },
  }
}
</script>
