<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>市场业绩管理</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="申请日期：" style="margin-bottom: 5px">
            <el-date-picker v-model="Datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="DateChange" clearable></el-date-picker>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="agencyName" auto-complete="off" placeholder="请输入代理商名称 " clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="agencyId" auto-complete="off" placeholder="请输入代理商ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="fzr" placeholder="请选择负责人" clearable @change="onSubmit">
              <el-option v-for="item in statusList" :key="item.UserName" :label="item.UserName" :value="item.UserName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="GetPerformanceManagement.Items" tooltip-effect="dark" show-summary :summary-method="getSummaries" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Date" label="日期" width="180"></el-table-column>
        <el-table-column property="AllEarning" label="代理商总日收益（元）"></el-table-column>
        <el-table-column property="Win" label="日活跃终端数（台）"></el-table-column>
        <el-table-column property="Price" label="销售额"></el-table-column>
        <el-table-column property="Count" label="新增终端数"></el-table-column>
        <el-table-column property="Auditor" label="负责人"></el-table-column>
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
  name: 'barbill',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选：
      agencyName: '',
      agencyId: '',
      fzr: '',
      startTime: '',
      endTime: '',
      Datevalue: {},
      GetPerformanceManagement: {},
      GetPerformanceManagementSumList: [],
      statusList: [],
      //新增负责人
      SetAuditorName: false,
      SetAuditorList: {
        AgencyIds: [],
        Auditor: null
      },
      rules: {
        Auditor: [{
          required: true,
          message: '请选择代理商负责人',
          trigger: 'change'
        }],

      }
    }
  },
  created() {
    this.getData();
    this.GetFzr();
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
    //获取负责人
    GetFzr: function() {
      var that = this;
      this.vq.bindTo({
        url: "/api/CRM/GetFzr",
        type: 'get',
        loader: true,
        addfn: function(res) {
          that.statusList = res.Object;
          that.statusList.push({
            Phone: "",
            UserId: "",
            UserName: "无负责人"
          })
        }
      });
    },
    //tabel数据获取
    getData: function() {
      var that = this;
      var getArr = {
        startTime: this.startTime,
        endTime: this.endTime,
        agencyId: this.agencyId,
        agencyName: this.agencyName,
        fzr: this.fzr,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/CRM/GetPerformanceManagement",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      });
      this.vq.bindTo({
        url: "/api/CRM/GetPerformanceManagementSum",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.GetPerformanceManagementSumList = ['合计', res.Object.AllEarning, res.Object.Win, res.Object.Price, res.Object.Count];
        }
      });
    },
    //合计
    getSummaries: function(param) {
      return this.GetPerformanceManagementSumList;
    }
  }
}
</script>
