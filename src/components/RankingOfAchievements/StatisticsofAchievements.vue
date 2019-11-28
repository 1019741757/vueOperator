<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>战绩排名统计</span>
  </div>
  <div class="innerwrap">
    <div class="info-content" style="position: relative;">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="按年统计：" style="margin-bottom: 5px">
            <el-date-picker v-model="year" type="year" placeholder="选择年" @change="onSubmit" value-format="yyyy">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="按月统计：" style="margin-bottom: 5px">
            <el-date-picker v-model="month" type="month" placeholder="选择月" @change="onSubmit" value-format="MM">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="phone" auto-complete="off" placeholder="请输入手机号码" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item v-if="isRemove == 1">
            <el-select v-model="sortRuleType" placeholder="请选择排序规则" clearable @change="onSubmit">
              <el-option v-for="item in PUBGsortRuleTypeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else>
            <el-select v-model="sortRuleType" placeholder="请选择排序规则" clearable @change="onSubmit">
              <el-option v-for="item in LOLsortRuleTypeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="overflow:hidden;position: absolute;right: 31px;top: 96px;">
        <div class="lf">累计参与人数：<i class="color-waring">{{GameDateSummery.SummeryConsumer||0}} 人</i></div>
        <span class="lf">&nbsp;</span>
        <div class="lf">累计奖励灵石数：<i class="color-waring">{{GameDateSummery.SummeryIntegral||0}} 个</i></div>
      </div>
      <!-- 绝地求生排名统计 -->
      <el-tabs v-model="isRemove" type="card" @tab-click="handleClick">
        <el-tab-pane label="绝地求生排名统计" name="1">
          <el-table :data="GameDateRankList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
            <el-table-column property="Ranking" label="序号"></el-table-column>
            <el-table-column property="Phone" label="用户手机号"></el-table-column>
            <el-table-column property="PUBG_Count" label="场次"></el-table-column>
            <el-table-column property="PUBG_TheFirstCount" label="吃鸡数"></el-table-column>
            <el-table-column property="PUBG_TopTenCount" label="前十数"></el-table-column>
            <el-table-column property="PUBG_KillCount" label="总击杀"></el-table-column>
            <el-table-column property="PUBG_Integral" label="本月积分"></el-table-column>
            <el-table-column property="PUBG_Settlement" label="奖励灵石数"></el-table-column>
          </el-table>
          <el-row type="flex" justify="end" style="padding:20px 0; ">
            <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="英雄联盟排名统计" name="2">
          <el-table :data="GameDateRankList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
            <el-table-column property="Ranking" label="序号"></el-table-column>
            <el-table-column property="Phone" label="用户手机号"></el-table-column>
            <el-table-column property="LOL_Count" label="场次"></el-table-column>
            <el-table-column property="LOL_PentaKillCount" label="五杀数"></el-table-column>
            <el-table-column property="LOL_QuadraKillCount" label="四杀数"></el-table-column>
            <el-table-column property="LOL_TripleKillCount" label="三杀数"></el-table-column>
            <el-table-column property="LOL_LegendaryCount" label="超神数"></el-table-column>
            <el-table-column property="LOL_KillCount" label="击杀数"></el-table-column>
            <el-table-column property="LOL_Integral" label="本月积分"></el-table-column>
            <el-table-column property="LOL_Settlement" label="奖励灵石数"></el-table-column>
          </el-table>
          <el-row type="flex" justify="end" style="padding:20px 0; ">
            <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="云顶之奕排名统计" name="3">
          <el-table :data="GameDateRankList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
            <el-table-column property="Ranking" label="序号"></el-table-column>
            <el-table-column property="Phone" label="用户手机号"></el-table-column>
            <el-table-column property="LOL_YunCount" label="场次"></el-table-column>
            <el-table-column property="LOL_YunIntegral" label="本月积分"></el-table-column>
          </el-table>
          <el-row type="flex" justify="end" style="padding:20px 0; ">
            <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'StatisticsofAchievements',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选：
      year: '2019',
      month: '',
      phone: null,
      sortRuleType: '',
      isRemove: '1',
      GameDateSummery: {},
      GameDateRankList: {},
      PUBGsortRuleTypeList: [{ //设备状态
        id: '0',
        name: '积分排序'
      }, {
        id: '1',
        name: '吃鸡排序'
      }, {
        id: '2',
        name: '击杀排序'
      }],
      LOLsortRuleTypeList: [{ //设备状态
        id: '0',
        name: '积分排序'
      }, {
        id: '3',
        name: '超神排序'
      }, {
        id: '4',
        name: '(LOL)击杀排序'
      }],
      rules: {
        Reason: [{
          required: true,
          message: '请输入离线原因',
          trigger: 'blur'
        }],
      }
    }
  },
  created() {
    this.getData();
    this.GameDate();
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
      this.GameDate();
    },
    handleClick(tab, event) {
      this.sortRuleType = null;
      this.getData();
      this.GameDate();
    },
    //tabel数据获取
    getData: function() {
      this.GameDateRankList = [];
      var that = this;
      var getArr = {
        gameType: this.isRemove || null,
        year: this.year || null,
        month: this.month || null,
        phone: this.phone || null,
        sortRuleType: this.sortRuleType,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/BetRelevant/GameDateRankList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    //tabel数据获取
    GameDate: function() {
      var that = this;
      var getArr = {
        gameType: this.isRemove,
        year: this.year,
        month: this.month,
        phone: this.phone,
      };
      var _data = this.vq.filterParams(getArr);
      this.vq.bindTo({
        url: "/api/BetRelevant/GameDateSummery",
        type: 'get',
        data: _data,
        isAsycn: true,
        addfn: function(res) {
          that.GameDateSummery = res.Object;
        }
      })
    },
  }
}
</script>
