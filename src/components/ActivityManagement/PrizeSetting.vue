<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>奖品设置</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="奖品类型：">
            <el-select v-model="typeId" placeholder="请选择奖品类型" clearable @change="onSubmit">
              <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width:15%">
            <el-input v-model="prizeId" auto-complete="off" placeholder="请输入奖品ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:15%">
            <el-input v-model="name" auto-complete="off" placeholder="请输入奖品名称" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-row style="margin-bottom: 10px;">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="medium" plain @click="SetPrizeName=true">新增</el-button>
        </el-row>
      </div>
      <!-- 表格 -->
      <el-table :data="GetPrizeList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Id" label="奖品ID" width="180"></el-table-column>
        <el-table-column property="Name" label="奖品名称"></el-table-column>
        <el-table-column property="Satisfy" label="奖品满足条件（元）"></el-table-column>
        <el-table-column property="PrizeContent" label="奖品内容"></el-table-column>
        <el-table-column prop="PrizeType" label="奖品类型" align='center' width='120' filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag close-transition :type="scope.row.PrizeType == '1' ? 'primary' :scope.row.PrizeType == '2' ? 'warning':''">
              {{scope.row.PrizeType == "1" ? "金额":scope.row.PrizeType == "2" ? "Q币":''}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="Describe" label="描述"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="deleteselectPlaceInfo(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>
  <!--设备编码更换  POST /api/NetbarBackstage/SetPrize  -->
  <el-dialog title="新增奖品" :visible.sync="SetPrizeName" width="600px" @close='SetPrizeDialog'>
    <el-form :model="SetPrizeList" :rules="rules" ref="SetPrizeList" label-width="100px" class="demo-ruleForm">
      <el-form-item label="奖品名称：" prop="name">
        <el-input v-model="SetPrizeList.name" auto-complete="off" placeholder="请输入奖品名称"></el-input>
      </el-form-item>
      <el-form-item label="满足条件：" prop="Satisfy">
        <el-input v-model="SetPrizeList.Satisfy" auto-complete="off" placeholder="请输入要满足的金额，如无消费则为0"></el-input>
      </el-form-item>
      <el-form-item label="奖品内容：" prop="PrizeContent">
        <el-input v-model="SetPrizeList.PrizeContent" auto-complete="off" placeholder="请输入奖品内容，如为金额请填写金额数"></el-input>
      </el-form-item>
      <el-form-item label="奖品类型：" prop="PrizeType">
        <el-select v-model="SetPrizeList.PrizeType" placeholder="请选择奖品类型">
          <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述：" prop="Describe">
        <el-input type="textarea" v-model="SetPrizeList.Describe"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="SetPrizeName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="SetPrizeSubmit('SetPrizeList')">确 定</el-button>
    </div>
  </el-dialog>
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
      prizeId: null,
      name: null,
      typeId: null,
      Datevalue: {},
      GetPrizeList: {},
      //新增奖品
      SetPrizeName: false,
      SetPrizeList: {
        name: null,
        Satisfy: null,
        PrizeContent: null,
        PrizeType: null,
        Describe: null
      },
      statusList: [{ //设备状态
        id: 1,
        name: '金额'
      }, {
        id: 2,
        name: 'Q币'
      }],
      rules: {
        name: [{
          required: true,
          message: '请输入奖品名称',
          trigger: 'blur'
        }],
        Satisfy: [{
          required: true,
          message: '请输入满足条件',
          trigger: 'blur'
        }],
        PrizeContent: [{
          required: true,
          message: '请输入奖品内容',
          trigger: 'blur'
        }],
        PrizeType: [{
          required: true,
          message: '请选择奖品类型',
          trigger: 'change'
        }],
        Describe: [{
          required: true,
          message: '请输入描述',
          trigger: 'blur'
        }],
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
        prizeId: this.prizeId,
        name: this.name,
        typeId: this.typeId,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      // var getArr={NetbarName:this.NetbarName,AgencyPhone:this.AgencyPhone,AgencyName:this.AgencyName,AgencyId:this.AgencyId};
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/NetbarBackstage/GetPrizeList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          console.log(res);
          that.total = res.Total;
        }
      })
    },
    SetPrizeDialog: function() {
      this.$refs.SetPrizeList.resetFields();
    },
    //新增奖品
    SetPrizeSubmit: function(SetPrizeList) {
      this.$refs[SetPrizeList].validate((valid) => {
        if (valid) {
          var that = this;
          var getArr = {
            Id: 0,
            Name: this.SetPrizeList.name,
            Satisfy: this.SetPrizeList.Satisfy,
            PrizeContent: this.SetPrizeList.PrizeContent,
            PrizeType: this.SetPrizeList.PrizeType,
            Describe: this.SetPrizeList.Describe,
          };
          this.vq.sendMes({
            url: "/api/NetbarBackstage/SetPrize",
            type: 'post',
            data: getArr,
            loader: true,
            fn: function(res) {
              that.getData();
              that.SetPrizeName = false;
              that.$refs[SetPrizeList].resetFields();
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
    //删除奖品
    deleteselectPlaceInfo: function(index, row) {
      this.$confirm('是否删除该奖品', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var that = this;
        var getArr = {
          prizeId: row.Id,
        };
        this.vq.sendMes({
          url: "/api/NetbarBackstage/DeletePrize?prizeId=" + row.Id,
          type: 'post',
          data: getArr,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: '删除成功',
              type: 'success'
            });
          }
        })
      }).catch(() => {

      });
    },
  }
}
</script>
