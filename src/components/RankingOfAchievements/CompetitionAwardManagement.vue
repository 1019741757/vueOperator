<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span> 比赛领奖管理 </span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索  -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="比赛ID：">
            <el-input v-model="matchConfigureId" auto-complete="off" placeholder="请输入比赛ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item label="用户手机号：">
            <el-input v-model="phone" auto-complete="off" placeholder="请输入用户手机号" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item label="用户ID：">
            <el-input v-model="consumerId" auto-complete="off" placeholder="请输入用户ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="state" placeholder="请选择领奖状态" clearable @change="onSubmit">
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
      <el-table :data="tableList" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Sort" label="总胜点排名"></el-table-column>
        <el-table-column property="MachConfigureId" label="比赛ID"></el-table-column>
        <el-table-column property="ConsumerId" label="用户ID"></el-table-column>
        <el-table-column property="Integral" label="总胜点"></el-table-column>
        <el-table-column property="Phone" label="用户手机号"></el-table-column>
        <el-table-column property="Money" label="奖品金额"></el-table-column>
        <el-table-column property="RealName" label="用户姓名"></el-table-column>
        <el-table-column property="Alipay" label="支付宝账号"></el-table-column>
        <el-table-column prop="State" label="领奖状态" align='center' width='120' filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.State == '1' ? 'success':scope.row.State == '2'? 'danger':''" close-transition>
              {{scope.row.State == "1" ? "待发奖":scope.row.State == "2"? "已发奖":''}}
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
  name: 'CompetitionAwardManagement',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选
      matchConfigureId: null,
      phone: null,
      consumerId: null,
      state: null,
      tableList: [],
      statusList: [{ //设备状态
        id: '1',
        name: '待发奖'
      }, {
        id: '2',
        name: '已发奖'
      }],
    }
  },
  // created() {
  //   this.matchConfigureId = this.$route.query.matchConfigureId || null;
  //   console.log(this.$route.query.matchConfigureId);
  //   this.getData();
  // },
  activated(){
    this.matchConfigureId = this.$route.query.matchConfigureId || null;
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
      var getArr = {
        matchConfigureId: this.matchConfigureId,
        phone: this.phone,
        consumerId: this.consumerId,
        state:this.state,
        pageSize: this.pageSize,
        pageIndex: this.pageNo,
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/MatchConfigure/GetMatchWinnersList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.tableList = res.Items;
          that.total = res.Total;
        }
      });
    },
  }
}
</script>
