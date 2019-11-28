<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span> 网吧支付记录 </span>
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
            <el-input v-model="number" auto-complete="off" placeholder="请输入支付编号" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="netbarName" auto-complete="off" placeholder="请输入网吧名称" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="netBarId" auto-complete="off" placeholder="请输入网吧ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="title_pop">
        <span>累计兑换奖品金额（元）：<a>{{CensusMoneyList.rechargeMoney}}</a> </span>
      </div>
      <!-- 表格 -->
      <el-table :data="GetNetFeeList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Number" label="支付编号" width="180"></el-table-column>
        <el-table-column property="NetbarName" label="网吧名称"></el-table-column>
        <el-table-column property="NetbarId" label="网吧ID"></el-table-column>
        <el-table-column property="CreateDate" label="支付时间"></el-table-column>
        <el-table-column property="RechargeMoney" label="支付金额（元）"></el-table-column>
        <el-table-column property="GiveMoney" label="奖品金额（元）">
          <template slot-scope="scope">
            <span>{{ scope.row.GiveMoney + scope.row.RechargeMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column property="Ratio" label="网费比例(%)"></el-table-column>
        <el-table-column property="Type" label="支付方式"></el-table-column>
        <el-table-column prop="State" label="支付状态" align='center' width='120' filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.State == '0' ? 'info' :scope.row.State == '1' ? 'success':scope.row.State == '2' ? 'danger':''" close-transition>
              {{scope.row.State == "0" ? "待支付":scope.row.State == "1" ? "已支付":scope.row.State == "2" ? "支付失败":''}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="Remarks" label="备注"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="success" size="small" v-if="scope.row.State == 2" @click.stop="Paymentformation(scope.$index, scope.row,0)">再次支付</el-button>
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
  name: 'PaymentRecord',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选：
      netBarId: null,
      netbarName: null,
      number: null,
      startTime: '',
      endTime: '',
      Datevalue: {},
      GetNetFeeList: {},
      CensusMoneyList: {},
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
        netBarId:this.netBarId,
        netbarName:this.netbarName,
        number:this.number,
        startTime:this.startTime,
        endTime:this.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      console.log(getArr);
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/NetFee/GetNetFeeList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          console.log(res);
          that.total = res.Total;
        }
      })
      var getArrList = {
        netBarId:this.netBarId,
        netbarName:this.netbarName,
        number:this.number,
        startTime:this.startTime,
        endTime:this.endTime,
      };
      var _data = this.unit.getFinal.call(this, getArrList, true);
      this.vq.sendMes({
        url: "/api/NetFee/CensusMoney",
        type: 'get',
        data: _data,
        loader: true,
        fn: function(res) {
          that.CensusMoneyList = res.Object;
          console.log(res.Object);
        }
      })
    },
    //再次支付
    Paymentformation:function(index, row, type) {
      this.$confirm('确定支付吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var that = this;
        let parameterList = {
          number: row.Number
        };
        this.vq.sendMes({
          url: "/api/NetbarBackstage/NetFeeRecharge",
          type: 'get',
          data: parameterList,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: '操作完成',
              type: 'success'
            });

          }
        })
      }).catch(() => {});
    },
  }
}
</script>
