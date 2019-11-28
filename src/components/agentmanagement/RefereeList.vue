<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span> 推挤下级列表 </span>
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
            <el-input v-model="parentId" auto-complete="off" placeholder="上级代理商ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="agencyId" auto-complete="off" placeholder="代理商ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="title_pop">
        <span>累计兑换奖品金额（元）：<a>{{CensusMoneyList.rechargeMoney}}</a> </span>
      </div> -->
      <!-- 表格 -->
      <el-table :data="dataList" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="AgencyPhone" label="代理商手机号" width="180"></el-table-column>
        <el-table-column property="AgencyName" label="代理商名称"></el-table-column>
        <el-table-column property="AgencyID" label="代理商ID"></el-table-column>
        <el-table-column property="TotalEarning" label="收益（元）"></el-table-column>
        <el-table-column property="ClientActiveCount" label="激活终端数（台）"></el-table-column>
        <el-table-column property="ParentName" label="所属上级代理商"></el-table-column>
        <el-table-column property="ParentId" label="所属上级代理商ID">
          <template slot-scope="scope">
            <el-tag type="success" @click="OneSub(scope.row)" class="OneSub_div"> {{ scope.row.ParentId }}</el-tag>
          </template>
        </el-table-column>
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
  name: 'RefereeList',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选：
      parentId: null,
      agencyId: null,
      startTime: '',
      endTime: '',
      Datevalue: {},
      dataList: [],
      CensusMoneyList: {},
    }
  },
  created() {
    this.parentId = this.$route.query.parentId || null;
    console.log(this.$route.query.parentId);
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
        name: null,
        phone: null,
        parentId: this.parentId,
        agencyId: this.agencyId,
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      console.log(getArr);
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/Agency/GetChildLevel1",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          console.log(res);
          that.dataList = res.Items;
          that.total = res.Total;
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
