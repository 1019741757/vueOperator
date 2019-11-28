<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>网吧消息公告管理</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="请选择发送时间：" style="margin-bottom: 5px">
            <el-date-picker v-model="Datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="DateChange" clearable></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select v-model="isShow" placeholder="是否展示" clearable @change="onSubmit">
              <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-row style="margin-bottom: 10px;">
            <el-button type="primary" icon="el-icon-circle-plus-outline" size="medium" plain @click="AddMessageName=true">新增</el-button>
          </el-row>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="GetMessageList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="SendDate" label="发送时间" width="180"></el-table-column>
        <el-table-column property="Title" label="标题"></el-table-column>
        <el-table-column property="IsShow" label="是否登录展示" :formatter="formatIsShow"></el-table-column>
        <el-table-column property="ExpirationDate" label="展示到期时间"></el-table-column>
        <el-table-column label="设置是否展示" width="120">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.IsShow" active-color="#00A854" :active-value="1" inactive-color="#cccccc" :inactive-value="0" @change="changeSwitch(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="detailsInformation(scope.$index, scope.row)">详情</el-button>
            <el-button type="danger" size="small" @click.stop="deletInformation(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
    <!--POST /api/Message/AddMessage 新增消息公告 -->
    <el-dialog title="新增新闻公告消息" :visible.sync="AddMessageName" width="600px" @close='SetPrizeDialog'>
      <el-form :model="AddMessageList" :rules="rules" ref="AddMessageList" label-width="120px" class="demo-ruleForm">
        <el-form-item label="消息标题：" prop="Title">
          <el-input v-model="AddMessageList.Title" auto-complete="off" placeholder="请输入消息标题"></el-input>
        </el-form-item>
        <el-form-item label="是否登录展示：" prop="IsShow">
          <el-switch v-model="AddMessageList.IsShow" active-color="#00A854" :active-value="1" inactive-color="#cccccc" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="展示到期时间：" prop="ExpirationDate">
          <el-date-picker v-model="AddMessageList.ExpirationDate" type="date" placeholder="选择展示到期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="消息内容：" prop="Content">
          <el-input type="textarea" v-model="AddMessageList.Content" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="AddMessageName = false">取 消</el-button>
        <el-button type="primary" size="small" @click.native="AddMessageSubmit('AddMessageList')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 信息详情 -->
    <el-dialog title="消息详情" :visible.sync="centerDialogVisible" width="600px" class="CreateMessage">
      <h3 class="CreateMessage_title">{{CreateMessageList.Title}}</h3>
      <div class="CreateMessage_date">时间：{{CreateMessageList.SendDate}} </div>
      <div class="CreateMessage_body">
        {{CreateMessageList.Content}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
      </span>
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
      isShow: '',
      startTime: '',
      endTime: '',
      Datevalue: {},
      //新增信息通告
      AddMessageName: false,
      AddMessageList: {
        MessageType: 1,
        Title: '',
        IsShow: 0,
        ExpirationDate: '',
        Content: ''
      },
      GetMessageList: {},
      //信息详情
      centerDialogVisible: false,
      CreateMessageList: {},
      statusList: [{ //设备状态
        id: '0',
        name: '不展示'
      }, {
        id: '1',
        name: '展示'
      }, ],
      rules: {
        Title: [{
            required: true,
            message: '请输入消息标题',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ],
        IsShow: [{
          required: true,
          message: '请是否登录展示',
          trigger: 'change'
        }],
        ExpirationDate: [{
          required: true,
          message: '请选择展示到期时间',
          trigger: 'change'
        }],
        Content: [{
            required: true,
            message: '请输入消息内容',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 300,
            message: '长度在 1 到 300 个字符',
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
      var StateValue = null;
      if (this.state == '') {
        StateValue = '-1';
      } else {
        StateValue = this.state;
      }
      var getArr = {
        messageType: '1',
        startDate: this.startTime,
        endDate: this.endTime,
        isShow: this.isShow,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/Message/GetMessageList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    //新增信息通告
    SetPrizeDialog: function() {
      this.$refs.AddMessageList.resetFields();
    },
    //新增信息通告
    AddMessageSubmit: function(AddMessageList) {
      this.AddMessageList.ExpirationDate = this.$moment(this.AddMessageList.ExpirationDate).format("YYYY-MM-DD") + "T00:00:00";
      this.$refs[AddMessageList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/Message/AddMessage",
            type: 'post',
            data: this.AddMessageList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.AddMessageName = false;
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
    //删除信息
    deletInformation: function(index, row) {
      this.$confirm('确定删除该条消息公告吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var that = this;
        let parameterList = {
          Id: row.ID,
        };
        this.vq.sendMes({
          url: "/api/Message/DeleteMessage",
          type: 'post',
          data: parameterList,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: '删除成功',
              type: 'success'
            });

          }
        })
      }).catch(() => {});
    },
    //控制信息是否展示
    changeSwitch: function(row) {
      var that = this;
      var paramList = {
        Id: row.ID,
        MessageType: '1',
      };
      this.vq.sendMes({
        url: "/api/Message/ShowMessage",
        type: 'post',
        data: paramList,
        loader: true,
        fn: function(res) {
          that.getData();
        }
      })
    },
    //信息详情
    detailsInformation: function(index, row) {
      this.CreateMessageList = row;
      this.centerDialogVisible = true;
    },
    //表格是否展示过滤
    formatIsShow: function(row, column) {
      return row.IsShow == 0 ? '不展示' : row.IsShow == 1 ? '展示' : '未知';
    },
  }
}
</script>
<style media="screen">

</style>
