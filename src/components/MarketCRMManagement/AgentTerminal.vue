<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>代理商终端管理</span>
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
          <el-row style="margin-bottom: 10px;">
            <el-button type="primary" size="medium" plain @click="SetAuditorBox">更改负责人</el-button>
          </el-row>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="GetTerminalManagement.Items" tooltip-effect="dark" show-summary :summary-method="getSummaries" @selection-change="handleSelectionChange" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column property="AgencyName" label="代理商名称" width="180"></el-table-column>
        <el-table-column property="AgencyID" label="代理商ID"></el-table-column>
        <el-table-column property="TotalCount" label="已激活终端数（台）"></el-table-column>
        <el-table-column property="NetbarCount" label="所拥有的网吧数（家）"></el-table-column>
        <el-table-column property="OffLineCount" label="网吧离线数（家）"></el-table-column>
        <el-table-column property="Auditor" label="负责人"></el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>



  <!--POST /api/Message/AddMessage 新增消息公告 -->
  <el-dialog title="更改负责人" :visible.sync="SetAuditorName" width="600px" @close='SetAuditorDialog'>
    <el-form :model="SetAuditorList" :rules="rules" ref="SetAuditorList" label-width="120px" class="demo-ruleForm">
      <el-form-item label="选择负责人：" prop="Auditor">
        <el-select v-model="SetAuditorList.Auditor" clearable>
          <el-option v-for="item in GeegstatusList" :key="item.UserName" :label="item.UserName" :value="item.UserName">
          </el-option>
        </el-select>
      </el-form-item>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="SetAuditorName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="SetAuditorSubmit('SetAuditorList')">确 定</el-button>
    </div>
  </el-dialog>
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
      agencyName: null,
      agencyId: null,
      fzr: null,
      startTime: '',
      endTime: '',
      Datevalue: {},
      GetTerminalManagement: {},
      statusList: [{
        Phone: "",
        UserId: "",
        UserName: "无负责人"
      }],
      GeegstatusList: [],
      GetTerminalManagementSumList:[],
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
          var GeegstatusList = res.Object;
          that.GeegstatusList = GeegstatusList;
          for (var i = 0; i < GeegstatusList.length; i++) {
            that.statusList.push(GeegstatusList[i]);
          }
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
        url: "/api/CRM/GetTerminalManagement",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      });
      this.vq.bindTo({
        url: "/api/CRM/GetTerminalManagementSum",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.GetTerminalManagementSumList = ['合计','','', res.Object.TotalCount, res.Object.NetbarCount, res.Object.OffLineCount,''];
        }
      });
    },
    //合计
    getSummaries: function(param) {
      return this.GetTerminalManagementSumList;
    },
    //修改负责人
    SetAuditorBox: function() {
      if (this.SetAuditorList.AgencyIds.length > 0) {
        this.SetAuditorName = true;
      } else {
        this.$message({
          message: '请选择代理商',
          type: 'warning'
        });
      }

    },
    handleSelectionChange: function(val) {
      var _AgencyIdsList = [];
      for (var i = 0; i < val.length; i++) {
        _AgencyIdsList.push(val[i].AgencyID)
      }
      this.SetAuditorList.AgencyIds = _AgencyIdsList;
    },
    SetAuditorDialog: function() {
      this.$refs.SetAuditorList.resetFields();
    },
    //新增信息通告
    SetAuditorSubmit: function(SetAuditorList) {
      this.$refs[SetAuditorList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/CRM/SetAuditor",
            type: 'post',
            data: this.SetAuditorList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.SetAuditorName = false;
              that.$message({
                message: '更改成功',
                type: 'success'
              });
            }
          })
        } else {
          return false;
        }
      });
    },

  }
}
</script>
