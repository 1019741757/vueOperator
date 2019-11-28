<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>网吧版本日志</span>
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
            <el-input v-model="NetbarId" auto-complete="off" placeholder="请输入网吧ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="hour" auto-complete="off" placeholder="请输入小时" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="state" placeholder="请选择网吧状态" clearable @change="onSubmit">
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
      <el-table :data="GetNetbarVersionInfo.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="CreateTime" label="最新心跳时间" width="180"></el-table-column>
        <el-table-column property="NetbarId" label="网吧ID"></el-table-column>
        <el-table-column property="IP" label="公网IP"></el-table-column>
        <el-table-column property="ContactText" label="机器码" width="80">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div>{{scope.row.MachineCode}}</div>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">机器码</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column property="Count" label="心跳次数"></el-table-column>
        <el-table-column prop="State" label="本次心跳状态" align='center' width='120' filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.State == '0' ? 'success':scope.row.State == '1' ? 'danger':''" close-transition>
              {{scope.row.State == "0" ? "在线":scope.row.State == "1" ? "离线":''}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="Procedure1" label="主机下载程序"></el-table-column>
        <el-table-column property="Procedure2" label="主机服务程序"></el-table-column>
        <el-table-column property="Procedure3" label="客机主界面"></el-table-column>
        <el-table-column property="Procedure4" label="租号客户端"></el-table-column>
        <el-table-column property="Procedure5" label="主机状态"></el-table-column>
        <el-table-column label="日志" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="SeeInformation(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>
  <!--版本日志-->
  <el-dialog title="版本日志" :visible.sync="VersionLogName">
    <el-table :data="VersionLogNameList" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
      <el-table-column property="CreateTime" label="最新心跳时间" width="180"></el-table-column>
      <el-table-column property="NetbarId" label="网吧ID"></el-table-column>
      <el-table-column property="IP" label="公网IP"></el-table-column>
      <el-table-column property="Procedure1" label="主机下载程序"></el-table-column>
      <el-table-column property="Procedure2" label="主机服务程序"></el-table-column>
      <el-table-column property="Procedure3" label="客机主界面"></el-table-column>
      <el-table-column property="Procedure4" label="租号客户端"></el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="padding:20px 0; ">
      <el-pagination @current-change="VLhandleCurrentChange" @size-change="VLsizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="VLpageNo" layout="total, sizes, prev, pager, next, jumper" :total="VLtotal"></el-pagination>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="VersionLogNameName = false">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'VersionLog',
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
      hour: '',
      state: '',
      startTime: '',
      endTime: '',
      Datevalue: {},
      GetNetbarVersionInfo: {},
      //版本日志
      VLNetbarId: '',
      VLpageSize: 5,
      VLpageNo: 1,
      VLtotal: 0,
      VersionLogName: false,
      VersionLogNameList: [],
      statusList: [{ //设备状态
        id: '0',
        name: '在线'
      }, {
        id: '1',
        name: '离线'
      }],
      rules: {
        Contacts: [{
            required: true,
            message: '请输入网吧联系人',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
      }
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
    //页数   pageSize 改变时会触发
    VLhandleCurrentChange: function(val) {
      this.VLpageNo = val;
      this.GetNetbarVersionInfoFun();
    },
    //页码 currentPage 改变时会触发
    VLsizeCurrentChange: function(val) {
      this.VLpageSize = val;
      this.GetNetbarVersionInfoFun();
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
        netbarId: this.NetbarId,
        hour: this.hour,
        startTime: this.startTime,
        endTime: this.endTime,
        state: StateValue,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/ClientVersion/GetNetbarVersionInfo",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    //查看日志
    SeeInformation: function(index, row) {
      this.VersionLogName = true;
      this.VLNetbarId = row.NetbarId;
      this.GetNetbarVersionInfoFun();
    },
    GetNetbarVersionInfoFun: function() {
      var that = this;
      var getArr = {
        netbarId: this.VLNetbarId,
        pageSize: this.VLpageSize,
        pageIndex: this.VLpageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/ClientVersion/GetNetbarVersionInfoList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          console.log(res);
          that.VersionLogNameList = res.Items;
          that.VLtotal = res.Total;
        }
      })
    }
  }
}
</script>
