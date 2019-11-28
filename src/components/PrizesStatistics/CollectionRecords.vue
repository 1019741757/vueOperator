<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>领取兑换记录</span>
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
            <el-input v-model="phone" auto-complete="off" placeholder="请输入手机号" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="netbarName" auto-complete="off" placeholder="请输入网吧名称" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="netbarId" auto-complete="off" placeholder="请输入网吧ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="activityName" auto-complete="off" placeholder="请输入活动名称" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="activityId" auto-complete="off" placeholder="请输入活动ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="state" placeholder="请选择兑换状态" clearable @change="onSubmit">
              <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="GetReceiveLogList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="NetbarName" label="网吧名称" width="180"></el-table-column>
        <el-table-column property="NetbarId" label="网吧ID"></el-table-column>
        <el-table-column property="ActivityName" label="活动名称"></el-table-column>
        <el-table-column property="ActivityId" label="活动ID"></el-table-column>
        <el-table-column property="CreateTime" label="领取时间" width="200"></el-table-column>
        <el-table-column property="ExchangeTime" label="兑换时间" width="200"></el-table-column>
        <el-table-column property="Phone" label="兑换手机号"></el-table-column>
        <el-table-column property="CDK" label="兑换码"></el-table-column>
        <el-table-column property="PrizeName" label="奖品名称"></el-table-column>
        <!-- <el-table-column property="PrizeContent" label="奖品金额（元）"></el-table-column> -->
        <el-table-column prop="State" label="兑换状态" align='center' width='120' filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.State == '1' ? 'info' :scope.row.State == '2' ? 'success':scope.row.State == '3' ? 'danger':''" close-transition>
              {{scope.row.State == "1" ? "未兑换":scope.row.State == "2" ? "已兑换":scope.row.State == "3" ? "已过期":''}}
            </el-tag>
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
      netbarId: null,
      netbarName: null,
      activityId: null,
      activityName: null,
      phone:null,
      state: null,
      startTime: '',
      endTime: '',
      Datevalue: {},
      GetReceiveLogList: {},
      statusList: [{ //设备状态
          id: 1,
          name: '未兑换'
        }, {
          id: 2,
          name: '已兑换'
        },
        {
          id: 3,
          name: '已过期'
        }
      ],
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
        netbarId: this.netbarId,
        netbarName: this.netbarName,
        activityId: this.activityId,
        activityName: this.activityName,
        phone: this.phone,
        state: this.state,
        startTime: this.startTime,
        EndTime: this.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/NetbarBackstage/GetReceiveLogList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
        that.total = res.Total;
        }
      })
    },


  }
}
</script>
