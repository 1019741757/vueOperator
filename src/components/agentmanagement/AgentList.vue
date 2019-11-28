<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>代理商列表</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <div class="">
            <el-form-item label="申请日期：" style="margin-bottom: 5px">
              <el-date-picker v-model="Datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="DateChange" clearable></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input v-model="phone" auto-complete="off" placeholder="请输入代理商手机号 " clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="name" auto-complete="off" placeholder="请输入代理商名称 " clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="agencyId" auto-complete="off" placeholder="请输入代理商ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </div>

          <el-form-item label="所属地区：">
            <el-cascader size="large" :options="provinceAndCityData" @change="handleChange" clearable></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-select v-model="auditor" placeholder="请选择负责人" clearable @change="onSubmit">
              <el-option v-for="item in statusList" :key="item.UserName" :label="item.UserName" :value="item.UserName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="canRecommend" placeholder="是否为推荐大使" clearable @change="onSubmit">
              <el-option v-for="item in canRecommendList" :key="item.UserID" :label="item.UserName" :value="item.UserID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="settlementState" placeholder="是否结算推荐费" clearable @change="onSubmit">
              <el-option v-for="item in settlementStateList" :key="item.UserID" :label="item.UserName" :value="item.UserID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="IsNotParent" placeholder="是否有下级代理商" clearable @change="onSubmit">
              <el-option v-for="item in IsNotParentList" :key="item.UserID" :label="item.UserName" :value="item.UserID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="GetList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="AgencyRegisterDate" label="注册时间" width="180"></el-table-column>
        <el-table-column property="AgencyName" label="代理商名称"></el-table-column>
        <el-table-column property="AgencyID" label="代理商ID"></el-table-column>
        <el-table-column property="ParentName" label="上级代理商名称"></el-table-column>
        <el-table-column property="ParentId" label="上级代理商ID"></el-table-column>
        <el-table-column property="TrueName" label="真实姓名"></el-table-column>
        <el-table-column property="OpenID" label="OpenID"></el-table-column>
        <el-table-column property="AgencyPhone" label="代理商手机号" width="180"></el-table-column>
        <el-table-column property="AgencyArea" label="所在地" width="180"></el-table-column>
        <el-table-column property="QQ" label="QQ"></el-table-column>
        <el-table-column property="TotalEarning" label="总收益(元)"></el-table-column>
        <el-table-column property="FromOneSub" label="一级收益(元)"></el-table-column>
        <el-table-column property="Manufacturer" label="无盘厂商"></el-table-column>
        <el-table-column property="FromSelfBusiness" label="自有业务收益(元)"></el-table-column>
        <el-table-column property="OneSub" label="一级推荐个数">
          <template slot-scope="scope">
            <el-tag type="success" @click="OneSub(scope.row)" class="OneSub_div"> {{ scope.row.OneSub }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="Auditor" label="负责人"></el-table-column>
        <el-table-column property="ContactText" label="最后沟通内容" width="100">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p style="max-width:350px">{{ scope.row.ContactText }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">内容详情</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column property="ContactTime" label="最后沟通时间"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand">
              <el-button type="primary" size="small">
                操作菜单<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="composeValue(1,scope.row)">重置密码</el-dropdown-item>
                <el-dropdown-item :command="composeValue(2,scope.row)" v-if="!scope.row.AgencyStatus">启用账号</el-dropdown-item>
                <el-dropdown-item :command="composeValue(3,scope.row)" v-else>禁用账号</el-dropdown-item>
                <el-dropdown-item :command="composeValue(4,scope.row)">编辑信息</el-dropdown-item>
                <el-dropdown-item :command="composeValue(5,scope.row)" v-if="!scope.row.CanRecommend">开通推荐大使</el-dropdown-item>
                <el-dropdown-item :command="composeValue(6,scope.row)" v-else>关闭推荐大使</el-dropdown-item>
                <el-dropdown-item :command="composeValue(7,scope.row)" v-if="!scope.row.ExtractionSwitch">开启提现</el-dropdown-item>
                <el-dropdown-item :command="composeValue(8,scope.row)" v-else>关闭提现</el-dropdown-item>
                <el-dropdown-item :command="composeValue(9,scope.row)" v-if="scope.row.SettlementState == 2">已结算推荐费</el-dropdown-item>
                <el-dropdown-item :command="composeValue(10,scope.row)" v-else>未结算推荐费</el-dropdown-item>
                <el-dropdown-item :command="composeValue(11,scope.row)" v-if="scope.row.Special == 1">开启下级管理</el-dropdown-item>
                <el-dropdown-item :command="composeValue(12,scope.row)" v-else>关闭下级管理</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>
  <!--编辑代理商信息-->
  <el-dialog title="编辑代理商信息" :visible.sync="EditInformationCodeName" width="600px" @close='EditPrizeDialog'>
    <el-form :model="EditInformationList" :rules="rules" ref="EditInformationList" label-width="130px" class="demo-ruleForm">
      <el-form-item label="原所在地：">
        <div class="">{{EditInformationList.AgencyAreaName||''}} </div>
      </el-form-item>
      <el-form-item label="修改所在地：" prop="Contacts">
        <el-cascader size="large" :options="provinceAndCityData" v-model="selectedOptions" @change="EdithandleChange" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="上级代理商ID：" prop="ParentId">
        <el-input v-model="EditInformationList.ParentId" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="无盘厂商：" prop="Manufacturer">
        <el-input v-model="EditInformationList.Manufacturer" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="最后沟通内容：" prop="ContactText">
        <el-input type="textarea" v-model="EditInformationList.ContactText" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="EditInformationCodeName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="EditInformationSubmit('EditInformationList')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from 'element-china-area-data'
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
      startTime: '',
      endTime: '',
      phone: null,
      name: null,
      agencyId: null,
      agencyArea: null,
      auditor: null,
      canRecommend: null,
      IsNotParent: null,
      settlementState: null,
      //所属地区
      CodeToText,
      TextToCode,
      provinceAndCityData,
      ModifyInformationList: {},
      //数据
      Datevalue: {},
      GetList: {},
      statusList: [],
      canRecommendList: [{
          UserName: '是',
          UserID: 1
        },
        {
          UserName: '否',
          UserID: 2
        }
      ],
      settlementStateList: [{
          UserName: '未结',
          UserID: 1
        },
        {
          UserName: '已结',
          UserID: 2
        }
      ],
      IsNotParentList: [{
          UserName: '有',
          UserID: 1
        },
        {
          UserName: '没有',
          UserID: 2
        }
      ],
      //编辑代理商信息
      selectedOptions: [],
      EditInformationCodeName: false,
      EditInformationList: {
        AgencyId: '',
        AgencyAreaName: '',
        AgencyArea: '',
        ParentId: '',
        Manufacturer: '',
        ContactText: '',
      },
      rules: {
        ParentIdc: [{
            required: false,
            message: '请输入上级代理商ID',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ],
        Manufacturer: [{
            required: false,
            message: '请输入无盘厂商',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ],
        ContactText: [{
            required: false,
            message: '请输入最后沟通内容',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ],
      }
    }
  },
  activated() {
    this.agencyId = this.$route.query.parentId || null;
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
    //省市区选择
    handleChange(arr) {
      console.log(this.CodeToText[arr[0]] + this.CodeToText[arr[1]]);
      this.agencyArea = this.CodeToText[arr[0]] + this.CodeToText[arr[1]];
      this.getData();
    },
    //编辑代理商信息省市区选择
    EdithandleChange(arr) {
      console.log(this.CodeToText[arr[0]] + this.CodeToText[arr[1]]);
      this.EditInformationList.AgencyArea = this.CodeToText[arr[0]] + this.CodeToText[arr[1]];
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
          that.statusList = res.Object;
          that.statusList.push({
            Phone: "",
            UserId: "",
            UserName: "无负责人"
          })
        }
      });
    },
    //tabel数据获取
    getData: function() {
      var that = this;
      var getArr = {
        startTime: this.startTime,
        endTime: this.endTime,
        phone: this.phone,
        name: this.name,
        agencyId: this.agencyId,
        agencyArea: this.agencyArea,
        auditor: this.auditor,
        canRecommend: this.canRecommend,
        IsNotParent: this.IsNotParent || 0,
        settlementState: this.settlementState || 0,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/Agency/GetList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      });
    },
    //下拉操作菜单
    composeValue: function(index, row) {
      return {
        'index': index,
        'row': row
      }
    },
    handleCommand: function(command) {
      var index = command.index;
      var AgencyID = command.row.AgencyID;
      var _this = this;
      switch (index) {
        case 1:
          _this.ResetPwdCoom(AgencyID);
          break;
        case 2:
          _this.VerifyCoom(index, AgencyID);
          break;
        case 3:
          _this.VerifyCoom(index, AgencyID);
          break;
        case 4:
          _this.UpdateAgencyCoom(command.row);
          break;
        case 5:
          _this.SetShareCoom(index, AgencyID);
          break;
        case 6:
          _this.SetShareCoom(index, AgencyID);
          break;
        case 7:
          _this.ExtractionSwitch(index, AgencyID);
          break;
        case 8:
          _this.ExtractionSwitch(index, AgencyID);
        case 9:
          _this.RecommendationFee(index, AgencyID);
          break;
        case 10:
          _this.RecommendationFee(index, AgencyID);
          break;
        case 11:
          _this.SetSpecialFee(index, AgencyID);
          break;
        case 12:
          _this.SetSpecialFee(index, AgencyID);
          break;
      }
    },
    //重置密码
    ResetPwdCoom: function(AgencyID) {
      this.$confirm('确定重置密码吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var that = this;
        let parameterList = {
          agencyId: AgencyID
        };
        this.vq.sendMes({
          url: "/api/Agency/ResetPwd?agencyId=" + AgencyID,
          type: 'post',
          data: parameterList,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: '重置完成',
              type: 'success'
            });

          }
        })
      }).catch(() => {});
    },
    //禁用账号----启用账号
    VerifyCoom: function(index, AgencyID) {
      var that = this;
      if (index == 2) {
        var ounaem = "启用";
        var parameterList = {
          agencyId: AgencyID,
          state: 1
        };
      } else {
        var ounaem = "禁用";
        var parameterList = {
          agencyId: AgencyID,
          state: 2
        };
      }
      this.$confirm('确定' + ounaem + '账号吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.vq.sendMes({
          url: "/api/Agency/Verify",
          type: 'get',
          data: parameterList,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: ounaem + '成功',
              type: 'success'
            });
          }
        })
      }).catch(() => {});
    },
    //开启提现----关闭提现
    ExtractionSwitch: function(index, AgencyID) {
      var that = this;
      if (index == 7) {
        var ounaem = "开启";
        var parameterList = {
          agencyId: AgencyID,
          type: 1
        };
      } else {
        var ounaem = "关闭";
        var parameterList = {
          agencyId: AgencyID,
          type: 2
        };
      }
      this.$confirm('确定' + ounaem + '提现吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.vq.sendMes({
          url: "/api/Agency/ExtractionSwitch",
          type: 'get',
          data: parameterList,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: ounaem + '成功',
              type: 'success'
            });
          }
        })
      }).catch(() => {});
    },
    //结算推荐费状态 1未结 2已结 ,
    RecommendationFee: function(index, AgencyID) {
      var that = this;
      if (index == 9) {
        var ounaem = "未结算";
        var parameterList = {
          agencyId: AgencyID,
          type: 1
        };
      } else {
        var ounaem = "已结算";
        var parameterList = {
          agencyId: AgencyID,
          type: 2
        };
      }
      this.$confirm('确定标记为' + ounaem + '推荐费吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.vq.sendMes({
          url: "/api/Agency/SetSettlementState",
          type: 'get',
          data: parameterList,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: '标记成功',
              type: 'success'
            });
          }
        })
      }).catch(() => {});
    },
    //设置是否给代理商展示下级代理商页面
    SetSpecialFee: function(index, AgencyID) {
      var that = this;
      if (index == 11) {
        var ounaem = "开启";
        var parameterList = {
          agencyId: AgencyID,
          type: 2
        };
      } else {
        var ounaem = "关闭";
        var parameterList = {
          agencyId: AgencyID,
          type: 1
        };
      }
      this.$confirm('确定' + ounaem + '下级管理吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.vq.sendMes({
          url: "/api/Agency/SetSpecial",
          type: 'get',
          data: parameterList,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: ounaem + '成功',
              type: 'success'
            });
          }
        })
      }).catch(() => {});
    },
    //编辑代理商信息
    EditPrizeDialog: function() {
      this.$refs.EditInformationList.resetFields();
      this.EditInformationList.AgencyArea = "";
      this.EditInformationList.AgencyAreaName = "";
      this.selectedOptions = [];
    },
    UpdateAgencyCoom: function(row) {
      console.log(row);
      this.EditInformationCodeName = true;
      this.EditInformationList.AgencyId = row.AgencyID;
      this.EditInformationList.AgencyAreaName = row.AgencyArea;
      this.EditInformationList.ParentId = row.ParentId;
      this.EditInformationList.Manufacturer = row.Manufacturer;
      this.EditInformationList.ContactText = row.ContactText;
    },
    //编辑
    EditInformationSubmit: function(EditInformationList) {
      if (!this.EditInformationList.AgencyArea) {
        this.EditInformationList.AgencyArea = this.EditInformationList.AgencyAreaName
      }
      this.$refs[EditInformationList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/Agency/UpdateAgency",
            type: 'post',
            data: this.EditInformationList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.EditInformationCodeName = false;
              that.$refs[EditInformationList].resetFields();
              that.$message({
                message: '编辑成功',
                type: 'success'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    //开通推荐大使
    SetShareCoom: function(index, AgencyID) {
      var that = this;
      if (index == 5) {
        var ounaem = "开通";
        var parameterList = {
          agencyId: AgencyID,
          state: true
        };
      } else {
        var ounaem = "关闭";
        var parameterList = {
          agencyId: AgencyID,
          state: false
        };
      }
      var getUrl = "/api/Agency/SetShare?agencyId=" + parameterList.agencyId + "&state=" + parameterList.state;
      this.$confirm('确定' + ounaem + '推荐大使吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.vq.sendMes({
          url: getUrl,
          type: 'post',
          data: parameterList,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: ounaem + '成功',
              type: 'success'
            });
          }
        })
      }).catch(() => {});
    },
    OneSub: function(row) {
      this.$router.push({
        path: '/RefereeList',
        query: {
          parentId: row.AgencyID
        }
      });
    },
  }
}
</script>
