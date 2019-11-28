<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span> 网吧激活终端统计 </span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索  -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="网吧创建时间：" style="margin-bottom: 5px">
            <el-date-picker v-model="Datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="DateChange" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="网吧ID：">
            <el-input v-model="netbarId" auto-complete="off" placeholder="请输入网吧ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="agencyId" auto-complete="off" placeholder="请输入代理商ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="state" placeholder="请选择网吧状态" clearable @change="onSubmit">
              <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="Auditor" placeholder="请选择负责人" clearable @change="onSubmit">
              <el-option v-for="item in AuditorList" :key="item.UserName" :label="item.UserName" :value="item.UserName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="data-choose-top" style="line-height: 35px;">
        <div class="lf">激活终端数合计：<i class="color-waring">{{ActivationTerminalSumValue}}台</i></div>
        <br />
      </div>
      <!-- 表格 -->
      <el-table :data="tableList" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="NetbarName" label="网吧名称"></el-table-column>
        <el-table-column property="NetbarId" label="网吧ID"></el-table-column>
        <el-table-column property="Count" label="激活终端数"></el-table-column>
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
  name: 'InternetbarTerminal',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选
      startTime: '',
      endTime: '',
      Datevalue: {},
      agencyId: null,
      netbarId: null,
      state: '',
      tableList: [],
      ActivationTerminalSumValue: '',
      Auditor:'',
      //负责人
      AuditorList: [{
        Phone: "",
        UserId: "",
        UserName: "无负责人"
      }],
      //网吧账号状态
      statusList: [{ //设备状态
        id: '1',
        name: '在线'
      }, {
        id: '2',
        name: '离线'
      }],
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
          var GeegstatusList = res.Object;
          that.GeegstatusList = GeegstatusList;
          for (var i = 0; i < GeegstatusList.length; i++) {
            that.AuditorList.push(GeegstatusList[i]);
          }
        }
      });
    },
    //tabel数据获取
    getData: function() {
      var that = this;
      var getArr = {
        netbarId: this.netbarId,
        agencyId: this.agencyId,
        state: this.state,
        auditor:this.Auditor,
        pageSize: this.pageSize,
        pageIndex: this.pageNo,
        startTime: this.startTime,
        endTime: this.endTime
      };
      console.log(this.Auditor);
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/Netbar/GetNetbarActivationTerminal",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.tableList = res.Items;
          that.total = res.Total;
        }
      });
      var getArrList = {
        netbarId: this.netbarId || null,
        agencyId: this.agencyId || null,
        state: this.state || null,
        auditor:this.Auditor,
        startTime: this.startTime,
        endTime: this.endTime
      };
      var _data1 = this.vq.filterParams(getArrList);
      this.vq.bindTo({
        url: "/api/Netbar/GetNetbarActivationTerminalSum",
        type: 'get',
        data: _data1,
        loader: true,
        addfn: function(res) {
          that.ActivationTerminalSumValue = res.Object;
          // console.log(res.Object);
        }
      });
    }
  }
}
</script>
