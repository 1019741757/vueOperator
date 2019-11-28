<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span> 总榜战绩排名管理 </span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索  -->
      <el-row style="margin-bottom: 10px;">
        <el-button type="primary" icon="el-icon-circle-plus-outline" size="medium" @click="AddingCompetitions()" plain>添加比赛</el-button>
      </el-row>
      <!-- 表格 -->
      <el-table :data="tableList" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Id" label="比赛ID"></el-table-column>
        <el-table-column property="Name" label="比赛名称"></el-table-column>
        <el-table-column property="StartDate" label="开始日期"></el-table-column>
        <el-table-column property="EndDate" label="结束日期"></el-table-column>
        <el-table-column property="Title" label="标题内容"></el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="EditCompetitions(scope.$index, scope.row)">编辑</el-button>
            <el-button type="success" size="small" @click.stop="ListofRewards(scope.$index, scope.row)">生成奖励清单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>
  <!--添加比赛-->
  <el-dialog title="添加比赛" :visible.sync="AddingCompetitionsName" width="1200px" @close='AddingCompetitionsDialog'>
    <el-form :model="AddingCompetitionsList" :rules="rules" ref="AddingCompetitionsList" label-width="120px" class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="比赛时间设置：">
            <el-date-picker v-model="AddingDatevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="AddingDateChange" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="比赛名称：" prop="Name">
            <el-input v-model="AddingCompetitionsList.Name" placeholder="请输入比赛名称" auto-complete="off" style="width:350px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item,index) in InternetCafeIDList" :key="index">
          <el-row :gutter="1">
            <el-col :span="9">
              <el-form-item label="名次区间：" label-width="120px">
                <el-input v-model="item.Min" auto-complete="off" placeholder="名次"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="line-height: 36px;text-align: center;">
              至
            </el-col>
            <el-col :span="4">
              <el-input v-model="item.Max" auto-complete="off" placeholder="名次"></el-input>
            </el-col>
            <el-col :span="9">
              <el-form-item label="奖金为：" label-width="100px">
                <el-input v-model="item.Money" auto-complete="off" placeholder="请输入奖金金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="line-height: 36px;text-align: center;">
              <span  @click="removeItem(item)"><i class="el-icon-delete" style="cursor: pointer;color: #ec0f0f;"></i></span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div style="padding:0 120px 20px;">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click.native="AddInternet()">添加</el-button>
      </div>
      <el-form-item label="标题内容：" prop="Title">
        <el-input type="textarea" v-model="AddingCompetitionsList.Title"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="AddingCompetitionsName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="AddingCompetitionsSubmit('AddingCompetitionsList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--编辑比赛-->
  <el-dialog title="编辑比赛" :visible.sync="EditCompetitionsName" width="1200px" @close='EditCompetitionsDialog'>
    <el-form :model="EditCompetitionsList" :rules="rules" ref="EditCompetitionsList" label-width="140px" class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="比赛时间设置：">
            <el-date-picker v-model="EditDatevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="EditDateChange" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="比赛名称：" prop="Name">
            <el-input v-model="EditCompetitionsList.Name" placeholder="请输入比赛名称" auto-complete="off" style="width:350px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item,index) in EditInternetCafeIDList" :key="index">
          <el-row :gutter="1">
            <el-col :span="9">
              <el-form-item label="名次区间：" label-width="120px">
                <el-input v-model="item.Min" auto-complete="off" placeholder="名次"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="line-height: 36px;text-align: center;">
              至
            </el-col>
            <el-col :span="4">
              <el-input v-model="item.Max" auto-complete="off" placeholder="名次"></el-input>
            </el-col>
            <el-col :span="9">
              <el-form-item label="奖金为：" label-width="80px">
                <el-input v-model="item.Money" auto-complete="off" placeholder="请输入奖金金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="line-height: 36px;text-align: center;">
              <span  @click="editremoveItem(item)"><i class="el-icon-delete" style="cursor: pointer;color: #ec0f0f;"></i></span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div style="padding:0 120px 20px;">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click.native="EditInternet()">添加</el-button>
      </div>
      <el-form-item label="标题内容：" prop="Title">
        <el-input type="textarea" v-model="EditCompetitionsList.Title"></el-input>
      </el-form-item>
    </el-form>
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
  name: 'TopRankManagement',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选
      tableList: [],
      //添加比赛
      AddingCompetitionsName: false,
      AddingCompetitionsList: {},
      AddingDatevalue: {},
      AddingStartTime: '',
      AddingEndTime: '',
      InternetCafeIDList: [{
          "Min": '',
          "Max": '',
          "Money": '',
          "Remark": ""
        },
        {
          "Min": '',
          "Max": '',
          "Money": '',
          "Remark": ""
        }
      ],
      //编辑区域比赛
      EditCompetitionsName: false,
      EditCompetitionsList: {},
      EditDatevalue: {},
      EditStartTime: '',
      EditEndTime: '',
      EditInternetCafeIDList: [],
      rules: {
        Title: [{
            required: true,
            message: '请输入标题内容',
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
        matchConfigureId: '',
        pageSize: this.pageSize,
        pageIndex: this.pageNo,
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/MatchConfigure/GetMatchConfigureList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.tableList = res.Items;
          that.total = res.Total;
        }
      });
    },
    //添加比赛
    AddInternet: function() {
      this.InternetCafeIDList.push({
        "Min": '',
        "Max": '',
        "Money": '',
        "Remark": ""
      })
    },
    removeItem: function (item) {
       var index = this.InternetCafeIDList.indexOf(item);
      this.InternetCafeIDList.splice(index, 1);
     },
    AddingCompetitions: function() {
      this.AddingCompetitionsName = true;
    },
    AddingCompetitionsDialog: function() {
      this.$refs.AddingCompetitionsList.resetFields();
      this.AddingDatevalue = [];
      this.AddingStartTime = '';
      this.AddingEndTime = '';
      this.InternetCafeIDList = [{
        "Min": '',
        "Max": '',
        "Money": '',
        "Remark": ""
      }, {
        "Min": '',
        "Max": '',
        "Money": '',
        "Remark": ""
      }]
    },
    AddingCompetitionsSubmit: function(AddingCompetitionsList) {
      this.$refs[AddingCompetitionsList].validate((valid) => {
        if (valid) {
          var getArr = {
            Id: '',
            Name: this.AddingCompetitionsList.Name,
            Title: this.AddingCompetitionsList.Title,
            StartDate: this.AddingStartTime + 'T00:00:00',
            EndDate: this.AddingEndTime + 'T00:00:00',
            Bonus: this.InternetCafeIDList
          };
          var _data = this.unit.getFinal.call(this, getArr, true);
          var that = this;
          this.vq.sendMes({
            url: "/api/MatchConfigure/CreateMatchConfigure",
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
        "Min": '',
        "Max": '',
        "Money": '',
        "Remark": ""
      })
    },
    editremoveItem: function (item) {
       var index = this.EditInternetCafeIDList.indexOf(item);
      this.EditInternetCafeIDList.splice(index, 1);
     },
    EditCompetitions: function(index, row) {
      this.EditCompetitionsName = true;
      var that = this;
      var getArr = {
        matchConfigureId: row.Id,
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/MatchConfigure/GetMatchConfigureList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          var _row = res.Items[0];
          that.EditCompetitionsList = _row;
          that.EditDatevalue = [_row.StartDate, _row.EndDate];
          that.EditStartTime = _row.StartDate;
          that.EditEndTime = _row.EndDate;
          that.EditInternetCafeIDList = _row.Bonus || [];
        }
      });
    },
    EditCompetitionsDialog: function() {
      this.$refs.EditCompetitionsList.resetFields();
      this.EditInternetCafeIDList = [];
    },
    EditCompetitionsSubmit: function(EditCompetitionsList) {
      this.$refs[EditCompetitionsList].validate((valid) => {
        if (valid) {
          var getArr = {
            Id: this.EditCompetitionsList.Id,
            Name: this.EditCompetitionsList.Name,
            Title: this.EditCompetitionsList.Title,
            StartDate: this.EditStartTime,
            EndDate: this.EditEndTime,
            Bonus: this.EditInternetCafeIDList
          };
          var _data = this.unit.getFinal.call(this, getArr, true);
          var that = this;
          this.vq.sendMes({
            url: "/api/MatchConfigure/UpdateMatchConfigure",
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
    //生成奖励清单
    ListofRewards: function(index, row) {
      this.$confirm('确定生成奖励清单吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var that = this;
        var getArr = {
          machConfigureId: row.Id,
        };
        this.vq.sendMes({
          url: "/api/MatchConfigure/GenerateWinners?machConfigureId=" + row.Id,
          type: 'post',
          data: getArr,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: '操作成功',
              type: 'success'
            });
            that.$router.push({
              path: '/CompetitionAwardManagement',
              query: {
                matchConfigureId: row.Id
              }
            });
            that.$store.state.nowName="比赛领奖管理";
          },
          err:function(err){
            that.$message({
              message: '已生成，请勿重复操作',
              type: 'danger'
            });
            that.$router.push({
              path: '/CompetitionAwardManagement',
              query: {
                matchConfigureId: row.Id
              }
            });
            that.$store.state.nowName="比赛领奖管理";
          }
        })
      }).catch(() => {});
    }
  }
}
</script>
