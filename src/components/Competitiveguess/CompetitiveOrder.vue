<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>竞猜订单管理</span>
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
            <el-input v-model="phone" auto-complete="off" placeholder="请输入手机号码" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="consumerId" auto-complete="off" placeholder="请输入用户ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="orderNumber" auto-complete="off" placeholder="请输入竞猜编号" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="type" placeholder="请选择竞猜模式" clearable @change="onSubmit">
              <el-option v-for="item in QuizModeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="state" placeholder="请选择竞猜状态" clearable @change="onSubmit">
              <el-option v-for="item in QuizStateList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="GetBetOrderList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="CreatDate" sortable label="竞猜开始时间"></el-table-column>
        <el-table-column property="BetOrderNumber" label="竞猜编号"></el-table-column>
        <el-table-column property="BetMode" label="竞猜模式"></el-table-column>
        <el-table-column property="StakeIntegral" label="押注灵石"></el-table-column>
        <el-table-column property="RewardIntegral" label="获得灵石"></el-table-column>
        <el-table-column property="State" label="竞猜状态"></el-table-column>
        <el-table-column property="EndTime" label="竞猜结束时间">
          <template slot-scope="scope">
            <span v-if="scope.row.State != '进行中'">{{ scope.row.EndTime }}</span>
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
  name: 'CompetitiveOrder',
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
      orderNumber: null,
      type: '',
      state: '',
      startTime: '',
      endTime: '',
      Datevalue: {},
      GetBetOrderList: {},
      QuizModeList: [{ //竞猜状态
        id: '1',
        name: '绝地求生'
      }, {
        id: '2',
        name: '英雄联盟'
      }],
      QuizStateList: [{ //竞猜状态
        id: '1',
        name: '进行中'
      }, {
        id: '2',
        name: '竞猜成功'
      }, {
        id: '3',
        name: '竞猜失败'
      }],
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
        phone: this.phone,
        consumerId: this.consumerId,
        orderNumber: this.orderNumber,
        type: this.type,
        state: this.state,
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/BetRelevant/GetBetOrderList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
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
