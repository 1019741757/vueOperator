<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>灵石管理</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="筛选条件：">
            <el-input v-model="phone" auto-complete="off" placeholder="请输入手机号" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="consumerId" auto-complete="off" placeholder="请输入用户ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="ConsumerIntegralList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Phone" label="用户手机号"></el-table-column>
        <el-table-column property="Id" label="用户ID"></el-table-column>
        <el-table-column property="AvailableIntegral" label="当前灵石数"></el-table-column>
        <el-table-column property="Integral" label="累计总获得灵石数"></el-table-column>
        <el-table-column property="AllConsume" label="累计总消耗灵石数"></el-table-column>
        <el-table-column property="AllTaskGet" label="累计赚取获得数"></el-table-column>
        <el-table-column property="AllExchangeConsume" label="累计兑换消耗数"></el-table-column>
        <el-table-column property="AllBetConsume" label="累计竞猜消耗数"></el-table-column>
        <el-table-column property="AllBetGet" label="累计竞猜获得数"></el-table-column>
        <el-table-column property="AllRecordGet" label="战绩排名获得数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="Integralsettingformation(scope.$index, scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>

  <!--积分设置 -->
  <el-dialog title="积分设置" :visible.sync="IntegralsettingName" width="600px" @close='IntegralsettingDialog'>
    <el-form :model="IntegralsettingList" :rules="rules" ref="IntegralsettingList" label-width="140px" class="demo-ruleForm">
      <el-form-item label="积分设置：" prop="integral">
        <el-input-number v-model="IntegralsettingList.integral" step-strictly></el-input-number>
      </el-form-item>
      <p></p>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="IntegralsettingName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="IntegralsettingSubmit('IntegralsettingList')">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'LingshiManagement',
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
      ConsumerIntegralList: {},
      IntegralsettingList: {
        type: 0,
        integral: 1,
        consumerId: null
      },
      IntegralsettingName: false,
      rules: {
        integral: [{
          required: false,
          message: '请输入消息标题',
          trigger: 'blur'
        }, ],
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
        type: null,
        phone: this.phone,
        consumerId: this.consumerId,
        orderby: 0,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/Consumer/ConsumerIntegralList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    Integralsettingformation: function(index, row) {
      this.IntegralsettingName = true;
      this.IntegralsettingList.consumerId = row.Id;
    },
    IntegralsettingDialog: function() {
      this.IntegralsettingList.type = 0;
      this.IntegralsettingList.integral = 1;
    },
    IntegralsettingSubmit: function(IntegralsettingList) {
      if (this.IntegralsettingList.integral < 0) {
        this.IntegralsettingList.type = 1;
        this.IntegralsettingList.integral = Math.abs(this.IntegralsettingList.integral);
      }
      this.$refs[IntegralsettingList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/Consumer/ConsumerIntegralUpdate?type=" + this.IntegralsettingList.type + "&consumerId=" + this.IntegralsettingList.consumerId + "&integral=" + this.IntegralsettingList.integral,
            type: 'post',
            data: this.IntegralsettingList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.IntegralsettingName = false;
              that.$message({
                message: '设置成功',
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
.el-input-number span {
  padding: 0
}
</style>
