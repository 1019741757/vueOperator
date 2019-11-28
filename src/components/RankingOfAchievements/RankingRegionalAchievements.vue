<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span> 区域战绩排名设置 </span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索  -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="请选择开始日期：" style="margin-bottom: 5px">
            <el-date-picker v-model="Datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="DateChange" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="比赛名称：">
            <el-input v-model="activityName" auto-complete="off" placeholder="比赛名称" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item label="参与者：">
            <el-input v-model="participant" auto-complete="off" placeholder="请输入参与者" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-row style="margin-bottom: 10px;">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="medium" @click="AddingCompetitions()" plain>添加区域比赛</el-button>
        </el-row>
      </div>
      <!-- 表格 -->
      <el-table :data="tableList" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Id" label="比赛ID"></el-table-column>
        <el-table-column property="ActivityName" label="比赛名称"></el-table-column>
        <el-table-column property="StartTime" label="开始日期"></el-table-column>
        <el-table-column property="EndTime" label="结束日期"></el-table-column>
        <el-table-column property="Participant" label="参与的网吧"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="EditCompetitions(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>
  <!--添加区域比赛-->
  <el-dialog title="添加区域比赛" :visible.sync="AddingCompetitionsName" width="700px" @close='AddingCompetitionsDialog'>
    <el-form :model="AddingCompetitionsList" :rules="rules" ref="AddingCompetitionsList" label-width="140px" class="demo-ruleForm">
      <el-form-item label="比赛时间设置：" style="margin-bottom: 5px">
        <el-date-picker v-model="AddingDatevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="AddingDateChange" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="活动名称：" prop="ActivityName">
        <el-input v-model="AddingCompetitionsList.ActivityName" auto-complete="off" style="width:350px;"></el-input>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12" v-for="(item,index) in InternetCafeIDList" :key="index">
          <el-form-item :label="'网吧ID'+(index+1)+'：'" prop="InternetID">
            <el-input v-model="InternetCafeIDList[index].InternetID" auto-complete="off" placeholder="请输入网吧ID"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="padding-left:140px;">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click.native="AddInternet()">添加网吧</el-button>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="AddingCompetitionsName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="AddingCompetitionsSubmit('AddingCompetitionsList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--编辑区域比赛-->
  <el-dialog title="添加区域比赛" :visible.sync="EditCompetitionsName" width="700px" @close='EditCompetitionsDialog'>
    <el-form :model="EditCompetitionsList" :rules="rules" ref="EditCompetitionsList" label-width="140px" class="demo-ruleForm">
      <el-form-item label="比赛时间设置：" style="margin-bottom: 5px">
        <el-date-picker v-model="EditDatevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="EditDateChange" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="活动名称：" prop="ActivityName">
        <el-input v-model="EditCompetitionsList.ActivityName" auto-complete="off" style="width:350px;"></el-input>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12" v-for="(item,index) in EditInternetCafeIDList" :key="index">
          <el-form-item :label="'网吧ID'+(index+1)+'：'" prop="InternetID">
            <el-input v-model="EditInternetCafeIDList[index].InternetID" auto-complete="off" placeholder="请输入网吧ID"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="padding-left:140px;">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click.native="EditInternet()">添加网吧</el-button>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="EditCompetitionsName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="EditCompetitionsSubmit('EditCompetitionsList')">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'RankingRegionalAchievements',
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
      activityName: null,
      participant: null,
      state: '',
      tableList: [],
      //添加区域比赛
      AddingCompetitionsName: false,
      AddingCompetitionsList: {},
      AddingDatevalue: {},
      AddingStartTime: '',
      AddingEndTime: '',
      InternetCafeIDList: [{
        InternetID: ''
      }, {
        InternetID: ''
      }],
      //编辑区域比赛
      EditCompetitionsName: false,
      EditCompetitionsList: {},
      EditDatevalue: {},
      EditStartTime: '',
      EditEndTime: '',
      EditInternetCafeIDList: [],
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
    AddingDateChange: function() {
      if (this.AddingDatevalue) {
        var date1 = this.AddingDatevalue[0];
        var date2 = this.AddingDatevalue[1];
        this.AddingStartTime = this.$moment(date1).format("YYYY-MM-DD");
        this.AddingEndTime = this.$moment(date2).format("YYYY-MM-DD");
      } else {
        this.AddingStartTime = '';
        this.AddingEndTime = '';
      }
    },
    EditDateChange: function() {
      if (this.EditDatevalue) {
        var date1 = this.EditDatevalue[0];
        var date2 = this.EditDatevalue[1];
        this.EditStartTime = this.$moment(date1).format("YYYY-MM-DD") + 'T00:00:00';
        this.EditEndTime = this.$moment(date2).format("YYYY-MM-DD") + 'T00:00:00';
      } else {
        this.EditStartTime = '';
        this.EditEndTime = '';
      }
    },
    //tabel数据获取
    getData: function() {
      var that = this;
      var getArr = {
        activityName: this.activityName,
        participant: this.participant,
        pageSize: this.pageSize,
        pageIndex: this.pageNo,
        startTime: this.startTime,
        endTime: this.endTime
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/ElectronicSports/GetElectronicSportsList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.tableList = res.Items;
          that.total = res.Total;
        }
      });
    },
    //添加区域比赛
    AddInternet: function() {
      this.InternetCafeIDList.push({
        InternetID: ''
      })
    },
    AddingCompetitions: function() {
      this.AddingCompetitionsName = true;
    },
    AddingCompetitionsDialog: function() {
      this.$refs.AddingCompetitionsList.resetFields();
      this.AddingStartTime = '';
      this.AddingEndTime = '';
      this.InternetCafeIDList = [{
        InternetID: ''
      }, {
        InternetID: ''
      }];
    },
    AddingCompetitionsSubmit: function(AddingCompetitionsList) {
      var Participant = [];
      for (var i = 0; i < this.InternetCafeIDList.length; i++) {
        if (this.InternetCafeIDList[i].InternetID != '') {
          Participant.push(this.InternetCafeIDList[i].InternetID)
        }
      }
      this.$refs[AddingCompetitionsList].validate((valid) => {
        if (valid) {
          var getArr = {
            Id: '',
            ActivityName: this.AddingCompetitionsList.ActivityName,
            StartTime: this.AddingStartTime + 'T00:00:00',
            EndTime: this.AddingEndTime + 'T00:00:00',
            Participant: Participant.join(",")
          };
          var _data = this.unit.getFinal.call(this, getArr, true);
          var that = this;
          this.vq.sendMes({
            url: "/api/ElectronicSports/CreateElectronicSports",
            type: 'post',
            data: _data,
            loader: true,
            fn: function(res) {
              that.getData();
              that.AddingCompetitionsName = false;
              that.$refs.AddingCompetitionsList.resetFields();
              that.$message({
                message: '新增成功',
                type: 'success'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    //修改区域比赛
    EditInternet: function() {
      this.EditInternetCafeIDList.push({
        InternetID: ''
      })
    },
    EditCompetitions: function(index, row) {
      this.EditCompetitionsName = true;
      this.EditCompetitionsList = row;
      this.EditDatevalue = [row.StartTime, row.EndTime];
      this.EditStartTime = row.StartTime;
      this.EditEndTime =  row.EndTime;
      var Participant = row.Participant.split(",");
      for (var i = 0; i < Participant.length; i++) {
        this.EditInternetCafeIDList.push({
          InternetID: Participant[i]
        })
      }
    },
    EditCompetitionsDialog: function() {
      this.$refs.EditCompetitionsList.resetFields();
      this.EditInternetCafeIDList = [];
    },
    EditCompetitionsSubmit: function(EditCompetitionsList) {
      var Participant = [];
      for (var i = 0; i < this.EditInternetCafeIDList.length; i++) {
        if (this.EditInternetCafeIDList[i].InternetID != '') {
          Participant.push(this.EditInternetCafeIDList[i].InternetID)
        }
      }
      this.$refs[EditCompetitionsList].validate((valid) => {
        if (valid) {
          var getArr = {
            Id: this.EditCompetitionsList.Id,
            ActivityName: this.EditCompetitionsList.ActivityName,
            StartTime: this.EditStartTime,
            EndTime: this.EditEndTime,
            Participant: Participant.join(",")
          };
          var _data = this.unit.getFinal.call(this, getArr, true);
          var that = this;
          this.vq.sendMes({
            url: "/api/ElectronicSports/UpdateElectronicSports",
            type: 'post',
            data: _data,
            loader: true,
            fn: function(res) {
              console.log(res);
              that.getData();
              that.EditCompetitionsName = false;
              that.$refs.EditCompetitionsList.resetFields();
              that.$message({
                message: '修改成功',
                type: 'success'
              });
            },

          })
        } else {
          return false;
        }
      });
    },
  }
}
</script>
