<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>网吧离线记录</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="记录产生时间：" style="margin-bottom: 5px">
            <el-date-picker v-model="Datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="DateChange" clearable></el-date-picker>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="NetbarId" auto-complete="off" placeholder="网吧ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="NetbarName" auto-complete="off" placeholder="网吧名称" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="AgencyId" auto-complete="off" placeholder="代理商id" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="machineCode" auto-complete="off" placeholder="机器码" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="clientState" placeholder="当前时终端状态" clearable @change="onSubmit">
              <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="记录产生时服务器状态：">
            <el-select v-model="serverState" placeholder="记录产生时服务器状态" clearable @change="onSubmit">
              <el-option v-for="item in IsActivationList" :key="item.id" :label="item.name" :value="item.id">
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
      <!-- 表格 -->
      <el-table :data="GetNetbarOfflineLogsList" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="CreateTime" label="记录产生时间"></el-table-column>
        <el-table-column property="CurrentDate" label="终端最后在线时间"></el-table-column>
        <el-table-column property="NetbarId" label="网吧ID" width="80"></el-table-column>
        <el-table-column property="NetbarName" label="网吧名称"></el-table-column>
        <el-table-column property="AgencyId" label="代理商ID" width="100"></el-table-column>
        <el-table-column property="Auditor" label="负责人" width="100"></el-table-column>
        <el-table-column property="MachineCode" label="服务器主机码"></el-table-column>
        <el-table-column property="ClientState" label="当前时终端状态" width="130"></el-table-column>
        <el-table-column property="ServerState" label="记录产生时服务器状态" width="130"></el-table-column>
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
  name: 'OfflineRecordingofInternetCafe',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选：
      NetbarId: null,
      NetbarName: null,
      AgencyPhone: null,
      AgencyId: null,
      AgencyName: '',
      Auditor: '',
      machineCode: '',
      serverState: '',
      clientState: '',
      startTime: '',
      endTime: '',
      TypeList: [], //负责人
      Datevalue: {},
      GetNetbarOfflineLogsList: [],
      //负责人
      AuditorList: [{
        Phone: "",
        UserId: "",
        UserName: "无负责人"
      }],
      //网吧账号状态
      statusList: [{ //设备状态
        id: '在线',
        name: '在线'
      }, {
        id: '离线',
        name: '离线'
      }],
      //是否激活
      IsActivationList: [{ //设备状态
        id: '在线',
        name: '在线'
      }, {
        id: '离线',
        name: '离线'
      }],
      rules: {
        version: [{
            required: true,
            message: '请输入要设置的版本号',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
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
        StartTime: this.startTime + "T00:00:00",
        EndTime: this.endTime + "T00:00:00",
        netbarId: this.NetbarId,
        netbarName: this.NetbarName,
        agencyPhone: this.AgencyPhone,
        agencyId: this.AgencyId,
        agencyName: this.AgencyName,
        machineCode: this.machineCode,
        serverState: this.serverState,
        clientState: this.clientState,
        Auditor: this.Auditor,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/NetbarState/GetNetbarOfflineLogs",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          console.log(res.Items);
          that.GetNetbarOfflineLogsList = res.Items;
          that.total = res.Total;
        }
      })
    },
  }
}
</script>
