<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>网吧信息管理</span>
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
            <el-input v-model="AgencyName" auto-complete="off" placeholder="请输入代理商名称" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="AgencyId" auto-complete="off" placeholder="请输入代理商ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="NetbarId" auto-complete="off" placeholder="请输入网吧ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="AccountNumber" auto-complete="off" placeholder="请输入账号" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
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
      <el-table :data="GetNetbarUserList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="CreateTime" label="申请日期" width="180"></el-table-column>
        <el-table-column property="AgencyName" label="所属代理商"></el-table-column>
        <el-table-column property="AgencyId" label="代理商ID"></el-table-column>
        <el-table-column property="NetbarName" label="网吧名称"></el-table-column>
        <el-table-column property="NetbarId" label="网吧ID"></el-table-column>
        <el-table-column property="AccountNumber" label="网吧后台账"></el-table-column>
        <el-table-column prop="State" label="网吧状态" align='center' width='120' filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.State == '0' ? 'info' :scope.row.State == '1' ? 'success':scope.row.State == '2' ? 'danger':scope.row.State == '3' ? 'danger':''" close-transition>
              {{scope.row.State == "0" ? "申请中":scope.row.State == "1" ? "已启用":scope.row.State == "2" ? "已禁用":scope.row.State == "3" ? "已关闭活动":''}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="NetbarContacts" label="联系人姓名"></el-table-column>
        <el-table-column property="NetbarPhone" label="手机号"></el-table-column>
        <el-table-column property="QQ" label="QQ"></el-table-column>
        <el-table-column property="Ratio" label="网费比例(%)" width="120"></el-table-column>
        <el-table-column property="Contacts" label="真实姓名"></el-table-column>
        <el-table-column label="活动(关闭/开启)" width="120">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.State" active-color="#00A854" :active-value="1" inactive-color="#cccccc" :inactive-value="3" @change="changeSwitch(scope.row)" v-if="scope.row.State == 1||scope.row.State == 3"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click.stop="shenInformation(scope.$index, scope.row)" v-if="scope.row.State == 0">审核</el-button>
            <el-button type="primary" size="small" @click.stop="EditInformation(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
    <!--设备编码更换-->
    <el-dialog title="编辑网吧信息" :visible.sync="EditInformationCodeName" width="500px" @close='EditPrizeDialog'>
      <el-form :model="EditInformationList" :rules="rules" ref="EditInformationList" label-width="150px" class="demo-ruleForm">
        <el-form-item label="网吧联系人：" prop="Contacts">
          <el-input v-model="EditInformationList.Contacts" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机号：" prop="Phone">
          <el-input v-model="EditInformationList.Phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人QQ：" prop="QQ">
          <el-input v-model="EditInformationList.QQ" auto-complete="off"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="20">
            <div class="grid-content bg-purple">
              <el-form-item label="网费比例：" prop="Ratio">
                <el-input v-model="EditInformationList.Ratio" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple" style="line-height: 38px;">
             ( % )
            </div>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="EditInformationCodeName = false">取 消</el-button>
        <el-button type="primary" size="small" @click.native="EditInformationSubmit('EditInformationList')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
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
      AgencyName: null,
      AgencyId: null,
      NetbarId: null,
      AccountNumber: null,
      state: '',
      startTime: '',
      endTime: '',
      Datevalue: {},
      //修改网吧信息
      EditInformationCodeName: false,
      EditInformationList: {
        id: null,
        Contacts: null,
        Phone: null,
        QQ: null,
        Ratio: null
      },

      GetNetbarUserList: {},
      statusList: [{ //设备状态
          id: '0',
          name: '申请'
        }, {
          id: '1',
          name: '启用'
        },
        {
          id: '2',
          name: '禁用'
        }
      ],
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
        Phone: [{
            required: true,
            message: '请输入联系人手机号码',
            trigger: 'blur'
          },
          {
            pattern: /^1[2|3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码'
          }
        ],
        Ratio: [{
            required: true,
            message: '请输入网费比例',
            trigger: 'blur'
          },
          {
            pattern: /^100$|^(\d|[1-9]\d)$/,
            message: '值为正整数且小于100或等于100'
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
      var StateValue = null;
      if (this.state == '') {
        StateValue = '-1';
      } else {
        StateValue = this.state;
      }
      var getArr = {
        AccountNumber: this.AccountNumber,
        AgencyId: this.AgencyId,
        AgencyName: this.AgencyName,
        NetbarId: this.NetbarId,
        NetbarName: this.NetbarName,
        BeginTime: this.startTime,
        EndTime: this.endTime,
        State: StateValue,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/NetbarBackstage/GetNetbarUserList",
        type: 'post',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    EditPrizeDialog: function() {
      this.$refs.EditInformationList.resetFields();
    },
    //修改网吧信息、
    EditInformation: function(index, row) {
      this.EditInformationCodeName = true;
      this.EditInformationList.id = row.Id;
      this.EditInformationList.Contacts = row.NetbarContacts || null;
      this.EditInformationList.Phone = row.NetbarPhone;
      this.EditInformationList.QQ = row.QQ;
      this.EditInformationList.Ratio = row.Ratio;
    },
    EditInformationSubmit: function(EditInformationList) {
      this.$refs[EditInformationList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/NetbarBackstage/UpdateNetUser",
            type: 'post',
            data: this.EditInformationList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.EditInformationCodeName = false;
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
    //
    shenInformation: function(index, row) {
      this.$confirm('确定审核该网吧吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var that = this;
        let parameterList = {
          netbarUserId: row.Id,
        };
        this.vq.sendMes({
          url: "/api/NetbarBackstage/AuditingPass?netbarUserId=" + row.Id,
          type: 'post',
          data: parameterList,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: '审核通过',
              type: 'success'
            });

          }
        })
      }).catch(() => {});
    },
    changeSwitch: function(data) {
      var that = this;
      console.log(data);
      var paramList = {
        netbarUserId: data.Id,
        state: data.State,
      };
      this.vq.sendMes({
        url: "/api/NetbarBackstage/UpdateState",
        type: 'post',
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
