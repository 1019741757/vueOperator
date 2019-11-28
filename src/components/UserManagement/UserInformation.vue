<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>用户信息管理</span>
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
            <el-input v-model="consumerId" auto-complete="off" placeholder="请输入用户ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="state" placeholder="请选择账号状态" clearable @change="onSubmit">
              <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="isAuthorize" placeholder="请选择是否微信授权" clearable @change="onSubmit">
              <el-option v-for="item in isAuthorizeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="GetConsumerList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="DateTime" label="注册时间" width="180"></el-table-column>
        <el-table-column property="Id" label="用户ID"></el-table-column>
        <el-table-column property="Phone" label="手机号"></el-table-column>
        <el-table-column property="WeChat" label="opendID"></el-table-column>
        <el-table-column property="GameTime" label="累计游戏时长"></el-table-column>
        <el-table-column label="账号状态(禁用/启用)" width="150">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.State" active-color="#00A854" :active-value="0" inactive-color="#cccccc" :inactive-value="1" @change="changeSwitch(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column property="NetbarContacts" label="灵豆值"></el-table-column> -->
        <el-table-column label="用户等级" width="180">
          <template slot-scope="scope">
            <p style="color:#e60816">LV{{ scope.row.Level }}</p>
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
  name: 'UserInformation',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选：
      phone: null,
      consumerId: null,
      state: '',
      isAuthorize: null,
      startTime: '',
      endTime: '',
      Datevalue: {},
      GetConsumerList: {},
      statusList: [{ //账号状态
          id: '0',
          name: '启用'
        },
        {
          id: '1',
          name: '禁用'
        }
      ],
      isAuthorizeList: [{ //是否微信授权
          id: '0',
          name: '否'
        }, {
          id: '1',
          name: '是'
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
      var StateValue = null;
      if (this.state == '') {
        StateValue = '-1';
      } else {
        StateValue = this.state;
      }
      var getArr = {
        phone: this.phone,
        consumerId: this.consumerId,
        state: this.state,
        isAuthorize: this.isAuthorize,
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/Consumer/GetConsumerList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    changeSwitch: function(data) {
      var that = this;
      var paramList = {
        consumerId: data.Id,
        state: data.State,
      };
      this.vq.sendMes({
        url: "/api/Consumer/UpateState",
        type: 'get',
        data: paramList,
        loader: true,
        fn: function(res) {
          that.getData();
        }
      })
    }
  }
}
</script>
