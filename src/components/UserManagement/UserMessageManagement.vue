<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>用户消息管理</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="发送日期：" style="margin-bottom: 5px">
            <el-date-picker v-model="Datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="DateChange" clearable></el-date-picker>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="phone" auto-complete="off" placeholder="请输入手机号" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="consumerId" auto-complete="off" placeholder="请输入消费者ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="state" placeholder="请选择查看状态" clearable @change="onSubmit">
              <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-select v-model="isAuthorize" placeholder="请选择是否微信授权" clearable @change="onSubmit">
              <el-option v-for="item in isAuthorizeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="danger" @click="batchSendMessage">批量发送消息</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="GetConsumerMsgList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="ConsumerId" label="用户ID" width="120"></el-table-column>
        <el-table-column property="Phone" label="手机号"></el-table-column>
        <el-table-column property="SendTime" label="消息发送时间"></el-table-column>
        <el-table-column property="Title" label="最新消息标题"></el-table-column>
        <el-table-column property="ReadState" label="查看状态"></el-table-column>
        <el-table-column property="Type" label="消息类别"></el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click.stop="detailsInformation(scope.$index, scope.row)">详情</el-button>
            <el-button type="danger" size="small" @click.stop="SendMessage(scope.$index, scope.row)">发送消息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>
  <!-- 消息详情 -->
  <el-dialog title="消息详情" :visible.sync="centerDialogVisibleName" width="600px" class="CreateMessage">
    <h3 class="CreateMessage_title">{{CreateMessageList.Title}}</h3>
    <div class="CreateMessage_date">消息发送时间：{{CreateMessageList.SendTime}} </div>
    <div class="CreateMessage_body">
      {{CreateMessageList.Content}}
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisibleName = false">关 闭</el-button>
    </span>
  </el-dialog>
  <!--发送消息 -->
  <el-dialog title="发送消息" :visible.sync="SendMessageName" width="800px" @close='SendMessageDialog'>
    <el-form :model="SendMessageList" :rules="rules" ref="SendMessageList" label-width="120px" class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="消息标题：" prop="Title">
            <el-input v-model="SendMessageList.Title" auto-complete="off" placeholder="请输入消息标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="消息类别：">
            <span>推送</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="消息内容：" prop="Content">
            <el-input type="textarea" v-model="SendMessageList.Content" auto-complete="off" placeholder="请输入消息内容" :autosize="{ minRows: 8, maxRows: 14}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="SendMessageName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="SendMessageSubmit('SendMessageList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--批量发送消息 -->
  <el-dialog title="批量发送消息" :visible.sync="batchSendMessageName" width="800px" @close='batchSendMessageDialog'>
    <el-form :model="batchSendMessageList" :rules="rules" ref="batchSendMessageList" label-width="120px" class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="消息标题：" prop="Title">
            <el-input v-model="batchSendMessageList.Title" auto-complete="off" placeholder="请输入消息标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="消息类别：">
            <span>推送</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="消息内容：" prop="Content">
            <el-input type="textarea" v-model="batchSendMessageList.Content" auto-complete="off" placeholder="请输入消息内容" :autosize="{ minRows: 8, maxRows: 14}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="batchSendMessageName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="batchSendMessageSubmit('batchSendMessageList')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'UserMessageManagement',
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
      GetConsumerMsgList: {},
      CreateMessageList: {}, //消息详情
      centerDialogVisibleName: false,
      statusList: [{ //查看状态
          id: '1',
          name: '未读'
        },
        {
          id: '2',
          name: '已读'
        }
      ],
      //发送消息
      SendMessageName: false,
      SendMessageList: {},
      //批量发送消息
      batchSendMessageName: false,
      batchSendMessageList: {},
      rules: {
        Title: [{
            required: true,
            message: '请输入任务名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ],
        Content: [{
            required: true,
            message: '请输入消息内容',
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
  created() {
    this.consumerId = this.$route.query.ConsumerId || null;
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
        url: "/api/Consumer/GetConsumerMsgList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    //消息详情
    detailsInformation: function(index, row) {
      this.CreateMessageList = row;
      this.centerDialogVisibleName = true;
    },
    //发送消息
    SendMessage: function(index, row) {
      this.SendMessageName = true;
      this.SendMessageList.ConsumerId = row.ConsumerId;
    },
    SendMessageDialog: function() {
      this.$refs.SendMessageList.resetFields();
    },
    SendMessageSubmit: function(SendMessageList) {
      this.$refs[SendMessageList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/Consumer/ConsumerMsgCreate",
            type: 'post',
            data: this.SendMessageList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.SendMessageName = false;
              that.$refs[SendMessageList].resetFields();
              that.$message({
                message: '发送成功',
                type: 'success'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    //批量发送消息
    batchSendMessage: function() {
      this.batchSendMessageName = true;
    },
    batchSendMessageDialog: function() {
      this.$refs.batchSendMessageList.resetFields();
    },
    batchSendMessageSubmit: function(batchSendMessageList) {
      this.$refs[batchSendMessageList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/Consumer/ConsumerMsgAllPush",
            type: 'post',
            data: this.batchSendMessageList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.batchSendMessageName = false;
              that.$refs[batchSendMessageList].resetFields();
              that.$message({
                message: '发送成功',
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
