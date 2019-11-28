<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>意见反馈</span>
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
            <el-input v-model="phone" auto-complete="off" placeholder="请输入手机号码" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="NetbarId" auto-complete="off" placeholder="请输入网吧ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="type" placeholder="请选择问题类别" clearable @change="onSubmit">
              <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="state" placeholder="请选择处理状态" clearable @change="onSubmit">
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
      <el-table :data="GetProposalList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="CreateTime" label="提交时间" width="180"></el-table-column>
        <el-table-column property="ConsumerId" label="用户ID"></el-table-column>
        <el-table-column property="NetbarId" label="网吧ID"></el-table-column>
        <el-table-column property="Phone" label="手机号"></el-table-column>
        <el-table-column property="Type" label="提交的问题"></el-table-column>
        <el-table-column property="Content" label="问题详情"></el-table-column>
        <el-table-column property="OrderNumber" label="订单信息"></el-table-column>
        <el-table-column property="HandleState" label="处理状态"></el-table-column>
        <el-table-column property="HandleTime" label="处理时间"></el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click.stop="HandleInformation(scope.$index, scope.row)" v-if="scope.row.HandleState == '待处理'">处理</el-button>
            <el-button type="danger" size="small" @click.stop="deleteInformation(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>
  <!--发送消息 -->
  <el-dialog title="处理成功，已标记为处理，发送消息！" :visible.sync="SendMessageName" width="800px" @close='SendMessageDialog'>
    <el-form :model="SendMessageList" :rules="rules" ref="SendMessageList" label-width="120px" class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="消息标题：" prop="Title">
            <el-input v-model="SendMessageList.Title" auto-complete="off" placeholder="请输入消息标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="消息类别：">
            <span>回复</span>
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
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'Feedback',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选：
      name: null,
      NetbarId: null,
      phone: null,
      type: '',
      state: '',
      startTime: '',
      endTime: '',
      Datevalue: {},
      //发送消息
      SendMessageName: false,
      SendMessageList: {},
      //修改网吧信息
      EditInformationCodeName: false,
      EditInformationList: {
        id: null,
        Contacts: null,
        Phone: null,
        QQ: null,
        Ratio: null
      },
      GetProposalList: {},
      typeList: [{ //设备状态
        id: 'steam或游戏登录不上',
        name: 'steam或游戏登录不上'
      }, {
        id: '游戏登录上后账号被封或玩不了',
        name: '游戏登录上后账号被封或玩不了'
      }, {
        id: '其他',
        name: '其他'
      }],
      statusList: [{ //设备状态
        id: '0',
        name: '待处理'
      }, {
        id: '1',
        name: '已处理'
      }],
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
        name: this.name,
        netbarId: this.netbarId,
        type: this.type,
        phone: this.phone,
        state: this.state,
        State: this.state,
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/Proposal/GetProposalList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    //删除
    deleteInformation: function(index, row) {
      this.$confirm('确定删除该条意见吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var that = this;
        let parameterList = {
          id: row.Id,
        };
        this.vq.sendMes({
          url: "/api/Proposal/PropsalDeleteById?id=" + row.Id,
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
    HandleInformation: function(index, row) {
      this.$confirm('确定处理该条意见吗', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var that = this;
        let parameterList = {
          id: row.Id,
        };
        this.vq.sendMes({
          url: "/api/Proposal/UpdateHandlState?id=" + row.Id,
          type: 'post',
          data: parameterList,
          loader: true,
          fn: function(res) {
            that.getData();
            that.SendMessage(row);
          }
        })
      }).catch(() => {});

    },
    // BoxHandleInformation: function(ConsumerId) {
    //   this.$confirm('处理成功，已标记为处理，是否需要发送消息？', '提示', {
    //     cancelButtonText: '否',
    //     confirmButtonText: '是',
    //     type: 'success'
    //   }).then(() => {
    //     this.$router.push({
    //       path: '/UserMessageManagement',
    //       query: {
    //         ProposalId: ConsumerId
    //       }
    //     });
    //   }).catch(() => {});
    // },
    //发送消息
    SendMessage: function(row) {
      this.SendMessageName = true;
      this.SendMessageList.ConsumerId = row.ConsumerId;
      this.SendMessageList.ProposalId = row.Id;
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
              that.$router.push({
                path: '/UserMessageManagement',
                query: {
                  ConsumerId: that.SendMessageList.ConsumerId
                }
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
