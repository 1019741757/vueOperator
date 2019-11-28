<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>网吧主页增值管理</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="条件筛选：">
            <el-input v-model="AgencyId" auto-complete="off" placeholder="请输入代理商ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="NetbarId" auto-complete="off" placeholder="请输入网吧ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-select v-model="state" placeholder="请选择增值业务状态" clearable @change="onSubmit">
              <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <br />
          <el-form-item label="业务ID筛选：">
            <el-checkbox-group v-model="TypeList" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in GetLowerHairList" :label="city.Id" :key="city.Id">{{city.Id}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-row style="margin-bottom: 10px;">
            <el-button type="primary" size="medium" plain @click="SetAuditorBox">一键设置</el-button>
          </el-row>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="GetNetbarLowerHairList.Items" tooltip-effect="dark" @selection-change="handleSelectionChange" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="NetbarID" label="网吧ID"></el-table-column>
        <el-table-column property="NetbarName" label="网吧名称"></el-table-column>
        <el-table-column property="AgencyId" label="代理商ID"></el-table-column>
        <el-table-column label="增值业务状态(关闭/开启)" width="180">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.IsNotSetHomePage" active-color="#00A854" :active-value="true" inactive-color="#cccccc" :inactive-value="false" @change="changeSwitch(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column property="LowerHairIds" label="业务ID"></el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10,50,100]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>
  <!--POST /api/Message/AddMessage 新增消息公告 -->
  <el-dialog title="更改增值业务状态" :visible.sync="SetAuditorName" width="600px" @close='SetAuditorDialog'>
    <el-form :model="SetAuditorList" :rules="rules" ref="SetAuditorList" label-width="180px" class="demo-ruleForm">
      <el-form-item label="选择增值业务状态：" prop="IsOpen">
        <el-select v-model="SetAuditorList.IsOpen" clearable>
          <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择需要设置的状态：">
        <el-checkbox-group v-model="SetAuditorList.LowerHairIds">
          <el-checkbox v-for="city in GetLowerHairList" :label="city.Id" :key="city.Id">{{city.Id}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="SetAuditorName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="SetAuditorSubmit('SetAuditorList')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'InternetBarAppreciation',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选：
      AgencyId: null,
      NetbarId: null,
      state: '',
      GetLowerHairList: {},
      TypeList: [],
      GetNetbarLowerHairList: {},
      statusList: [{ //设备状态
        id: 'true',
        name: '开启'
      }, {
        id: 'false',
        name: '关闭'
      }],
      SetAuditorName: false,
      SetAuditorList: {
        NetbarIds: [],
        IsOpen: null,
        LowerHairIds: [],
      },
      rules: {
        IsOpen: [{
          required: true,
          message: '请选择增值业务状态',
          trigger: 'change'
        }],

      }
    }
  },
  created() {
    this.getData();
    this.GetLowerHair();
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
    //业务ID获取
    GetLowerHair: function() {
      var that = this;
      this.vq.bindTo({
        url: "/api/Netbar/GetLowerHairList",
        type: 'get',
        loader: true,
        addfn: function(res) {
          that.GetLowerHairList = res.Object;
        }
      })
    },
    handleCheckedCitiesChange() {
      console.log(this.TypeList.sort());
      this.getData();
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
        AgencyId: this.AgencyId,
        NetbarId: this.NetbarId,
        State: StateValue,
        lowerHairIds: this.TypeList.sort(),
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/Netbar/GetNetbarLowerHairList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          console.log(res);
          that.total = res.Total;
        }
      })
    },
    changeSwitch: function(data) {
      var that = this;
      console.log(data);
      var paramList = {
        NetbarIds: [data.NetbarID],
        IsOpen: data.IsNotSetHomePage,
      };
      this.vq.sendMes({
        url: "/api/Netbar/SetLowerHair",
        type: 'post',
        data: paramList,
        loader: true,
        fn: function(res) {
          that.getData();
        }
      })
    },
    //修改负责人
    SetAuditorBox: function() {
      if (this.SetAuditorList.NetbarIds.length > 0) {
        this.SetAuditorName = true;
      } else {
        this.$message({
          message: '请选择网吧',
          type: 'warning'
        });
      }

    },
    handleSelectionChange: function(val) {
      var _NetbarIDList = [];
      for (var i = 0; i < val.length; i++) {
        _NetbarIDList.push(val[i].NetbarID)
      }
      this.SetAuditorList.NetbarIds = _NetbarIDList;
    },
    SetAuditorDialog: function() {
      this.$refs.SetAuditorList.resetFields();
      this.SetAuditorList.LowerHairIds=[];
    },
    //新增信息通告
    SetAuditorSubmit: function(SetAuditorList) {
      this.$refs[SetAuditorList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/Netbar/SetNetbarLowerHair",
            type: 'post',
            data: this.SetAuditorList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.SetAuditorName = false;
              that.$message({
                message: '更改成功',
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
