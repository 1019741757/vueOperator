<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span> 单桌标结算记录 </span>
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
            <el-input v-model="agencyId" auto-complete="off" placeholder="代理商ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="agencyName" auto-complete="off" placeholder="代理商名称" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="settlementState" placeholder="请选择结算状态" clearable @change="onSubmit">
              <el-option v-for="item in StatusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="dataList" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="CreateDate" label="月份" width="180"></el-table-column>
        <el-table-column property="AgencyId" label="代理商ID"></el-table-column>
        <el-table-column property="ClientCount" label="结算终端数"></el-table-column>
        <el-table-column property="Money" label="结算金额（元）"></el-table-column>
        <el-table-column prop="State" label="结算状态" align='center' filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.State == '1' ? 'danger':scope.row.State == '2' ? 'success':''" close-transition>
              {{scope.row.State == "1" ? "未结算":scope.row.State == "2" ? "已结算":''}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="UpdateTime" label="结算时间"></el-table-column>
        <el-table-column property="Remarks" label="结算备注">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top"  v-if="scope.row.Remarks">
              <p style="max-width:350px">{{ scope.row.Remarks }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">结算备注</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column property="ParentId" label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click.stop="Verifyformation(scope.$index, scope.row)" v-if="scope.row.State == 1">标记为已结算</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>
  <!--标记为已结算-->
  <el-dialog title="标记为已结算" :visible.sync="VerifyformationCodeName" width="600px" @close='VerifyformationDialog'>
    <el-form :model="VerifyformationList" :rules="rules" ref="VerifyformationList" label-width="140px" class="demo-ruleForm">
      <el-form-item label="结算金额（元）：" prop="money">
        <el-input type="text" v-model="VerifyformationList.money" auto-complete="off" placeholder="请输入结算金额，确认后不可修改"></el-input>
      </el-form-item>
      <el-form-item label="结算备注：" prop="remarks">
        <el-input type="textarea" v-model="VerifyformationList.remarks" auto-complete="off" :autosize="{ minRows: 8, maxRows: 14}" placeholder="请输入结算备注，例如线下转账方式，转账凭证编号等"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="VerifyformationCodeName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="VerifyInformationSubmit('VerifyformationList')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'AgencyMonthlySettlementBills',
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
      settlementState: null,
      startTime: '',
      endTime: '',
      Datevalue: {},
      dataList: [],
      StatusList: [{ //竞猜状态
        id: '1',
        name: '未结算'
      }, {
        id: '2',
        name: '已结算'
      }],
      //标记为已结算
      VerifyformationCodeName: false,
      VerifyformationList: {
        money: '',
        remarks: ''
      },
      rules: {
        money: [{
            required: true,
            message: '请输入结算金额',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ],
        remarks: [{
            required: true,
            message: '请输入结算备注',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
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
        agencyId: this.agencyId,
        agencyName: this.agencyName,
        settlementState: this.settlementState,
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/TerminalStatistics/AgencyMonthlySettlementBills",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.dataList = res.Items;
          that.total = res.Total;
        }
      })
    },
    //标记为已结算
    Verifyformation: function(index, row) {
      this.VerifyformationCodeName = true;
      this.VerifyformationList.jsId = row.Id;
    },
    VerifyformationDialog: function() {
      this.$refs.VerifyformationList.resetFields();
    },
    VerifyInformationSubmit: function(VerifyformationList) {
      this.$refs[VerifyformationList].validate((valid) => {
        if (valid) {
          var that = this;
          let parameterList = {
            Id: this.VerifyformationList.jsId,
            Money: this.VerifyformationList.money,
            Remarks: this.VerifyformationList.remarks,
          };
          this.vq.sendMes({
            url: "/api/TerminalStatistics/Settlement",
            type: 'post',
            data: parameterList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.VerifyformationCodeName = false;
              that.$message({
                message: '标记成功',
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
<style media="screen">
  /* .cell>span{
    padding: 0
  } */
</style>
