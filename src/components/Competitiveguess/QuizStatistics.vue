<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>游戏竞猜统计</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="申请日期：" style="margin-bottom: 5px">
            <el-date-picker v-model="Datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="DateChange" clearable></el-date-picker>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="GameBetStatistics.Object" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Id" sortable label="竞猜ID"></el-table-column>
        <el-table-column property="MaxTitle" label="竞猜模式"></el-table-column>
        <el-table-column property="StakeCount" sortable label="累计押注次数"></el-table-column>
        <el-table-column property="SuccessCount" sortable label="累计竞猜成功次数"></el-table-column>
        <el-table-column property="FailCount" sortable label="累计竞猜失败次数"></el-table-column>
        <el-table-column property="IntegralSuccessSum" label="累计成功获得灵石数"></el-table-column>
        <el-table-column property="IntegralFailSum" sortable label="累计失败扣除灵石数"></el-table-column>
        <el-table-column property="ConsumerCompleteCount" sortable label="累计完成用户数"></el-table-column>
        <el-table-column property="ConsumerCount" sortable label="累计参与用户数"></el-table-column>
      </el-table>
      </el-card>
    </div>
  </div>
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'QuizStatistics',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选
      phone: null,
      consumerId: null,
      netbarId: null,
      startTime: '',
      endTime: '',
      Datevalue: {},
      GameBetStatistics: {}
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
      var StateValue = null;
      if (this.state == '') {
        StateValue = '-1';
      } else {
        StateValue = this.state;
      }
      var getArr = {
        type: null,
        orderby: null,
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/BetRelevant/GameBetStatistics",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {}
      })
    }
  }
}
</script>
<style media="screen">
.el-table .caret-wrapper {
  padding: 0;
}
</style>
