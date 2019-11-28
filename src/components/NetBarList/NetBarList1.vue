<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>网吧列表</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
          <el-form-item label="日期筛选：" style="margin-bottom: 5px">
            <el-date-picker v-model="Datevalue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="DateChange" clearable></el-date-picker>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="NetbarId" auto-complete="off" placeholder="网吧ID" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="NetbarName" auto-complete="off" placeholder="网吧名称" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="AgencyPhone" auto-complete="off" placeholder="代理商电话" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-input v-model="AgencyId" auto-complete="off" placeholder="代理商id" clearable @clear="onSubmit" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="NetbarAccountNumberState" placeholder="网吧帐号状态" clearable @change="onSubmit">
              <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否激活：">
            <el-select v-model="IsActivation" placeholder="是否激活" clearable @change="onSubmit">
              <el-option v-for="item in IsActivationList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="Auditor" placeholder="请选择负责人" clearable @change="onSubmit">
              <el-option v-for="item in AuditorList" :key="item.UserName" :label="item.UserName" :value="item.UserName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-checkbox-group v-model="TypeList" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in checkboxArr" :label="city.checkboxid" :key="city.checkboxid">{{city.checkboxname}}</el-checkbox>
          </el-checkbox-group>
        </el-form>
      </div>
      <!-- 表格 -->
      <el-table :data="GetNetbarList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="NetbarID" label="网吧Id" width="80"></el-table-column>
        <el-table-column property="NetbarName" label="网吧名称"></el-table-column>
        <el-table-column property="CreateTime" label="添加时间" width="160"></el-table-column>
        <el-table-column property="AgencyName" label="所属代理商"></el-table-column>
        <el-table-column property="AgencyPhone" label="代理商手机号"></el-table-column>
        <el-table-column property="AgencyId" label="代理商ID"></el-table-column>
        <el-table-column property="AgencyId" label="地址">
          <template slot-scope="scope">
          <p>{{scope.row.ProName}}{{scope.row.CityName}}</p>
          </template>
        </el-table-column>
        <el-table-column property="Auditor" label="负责人"></el-table-column>
        <el-table-column property="NetbarBusiness" label="业务状态" :formatter="formatNetbarBusiness" width="160"></el-table-column>
        <el-table-column property="ProductPowerInfos" label="特权状态" :formatter="formatProductPowerInfos" width="160"></el-table-column>
        <el-table-column property="IPs" label="IP"></el-table-column>
        <el-table-column property="ContactText" label="特权到期时间" width="130">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div>
                <p>steam特权钻石版</p>
                <p>到期：<span style="color:#e60816">{{getViptime(scope.row.ProductPowerInfos,'steam特权钻石版')}} </span></p>
                <p>包月加速器</p>
                <p>到期：<span style="color:#e60816">{{getViptime(scope.row.ProductPowerInfos,'包月加速器')}} </span></p>
              </div>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">特权到期时间</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- <el-table-column label="设置是否开启广告" width="140">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.NetbarBusiness.IsNotShowAD" active-color="#00A854" :active-value="true" inactive-color="#cccccc" :inactive-value="false" @change="changeSwitch(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="设置版本" width="130">
          <template slot-scope="scope">
            <p>当前版本：<span style="color:#e60816">{{scope.row.UpdatingVersion}} </span></p>
            <el-button type="primary" size="small" @click.stop="EditInformation(scope.$index, scope.row)">设置版本</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
    <!--设备编码更换-->
    <el-dialog title="设置版本" :visible.sync="EditInformationCodeName" width="500px" @close='EditPrizeDialog'>
      <el-form :model="EditInformationList" :rules="rules" ref="EditInformationList" label-width="150px" class="demo-ruleForm">
        <el-form-item label="设置版本：" prop="version">
          <el-input v-model="EditInformationList.version" auto-complete="off"></el-input>
        </el-form-item>
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
      NetbarId: null,
      NetbarName: null,
      AgencyPhone: null,
      AgencyId: null,
      AgencyName: '',
      NetbarAccountNumberState: '',
      Type: '',
      IsActivation: '',
      Auditor: '',
      startTime: '',
      endTime: '',
      TypeList: [], //负责人
      Datevalue: {},
      //修改网吧信息
      EditInformationCodeName: false,
      EditInformationList: {
        version: null,
        NetbarID: null
      },
      GetNetbarList: {},
      //网吧账号状态
      statusList: [{ //设备状态
          id: '1',
          name: '未申请'
        }, {
          id: '2',
          name: '申请中'
        },
        {
          id: '3',
          name: '已通过'
        }
      ],
      //是否激活
      IsActivationList: [{ //设备状态
        id: '1',
        name: '激活'
      }, {
        id: '2',
        name: '未激活'
      }],
      //负责人
      AuditorList: [{
        Phone: "",
        UserId: "",
        UserName: "无负责人"
      }],
      checkboxArr: [{
        checkboxname: "580特权客户端显示",
        checkboxid: 1,
        value: false
      }, {
        checkboxname: "580特权客户端不显示",
        checkboxid: 32,
        value: false
      }, {
        checkboxname: "主页业务",
        checkboxid: 2,
        value: false
      }, {
        checkboxname: "桌标业务",
        checkboxid: 4,
        value: false
      }, {
        checkboxname: "加速器特权",
        checkboxid: 8,
        value: false
      }, {
        checkboxname: "steam特权钻石版",
        checkboxid: 16,
        value: false
      }],
      rules: {
        version: [{
            required: true,
            message: '请输入要设置的版本号',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
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
          var GeegstatusList = res.Object;
          that.GeegstatusList = GeegstatusList;
          for (var i = 0; i < GeegstatusList.length; i++) {
            that.AuditorList.push(GeegstatusList[i]);
          }
        }
      });
    },
    handleCheckedCitiesChange(value) {
      console.log(value);
      var typeValue = 0;
      for (var i = 0; i < value.length; i++) {
        typeValue += value[i];
      };
      this.Type = typeValue;
      this.getData();
    },
    //tabel数据获取
    getData: function() {
      var that = this;
      var StateValue = null;
      if (this.NetbarAccountNumberState == '') {
        StateValue = '0';
      } else {
        StateValue = this.NetbarAccountNumberState;
      }
      var getArr = {
        StartTime: this.startTime + "T00:00:00",
        EndTime: this.endTime + "T00:00:00",
        NetbarId: this.NetbarId,
        NetbarName: this.NetbarName,
        AgencyPhone: this.AgencyPhone,
        AgencyId: this.AgencyId,
        AgencyName: this.AgencyName,
        NetbarAccountNumberState: StateValue,
        Type: this.Type,
        IsActivation: this.IsActivation,
        Auditor: this.Auditor,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/Netbar/GetNetbarList",
        type: 'post',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    //设置版本
    EditPrizeDialog: function() {
      this.$refs.EditInformationList.resetFields();
    },
    //设置版本
    EditInformation: function(index, row) {
      this.EditInformationCodeName = true;
      this.EditInformationList.NetbarID = row.NetbarID;
    },
    //设置版本
    EditInformationSubmit: function(EditInformationList) {
      this.$refs[EditInformationList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/Netbar/SetNetbarVersion",
            type: 'get',
            data: this.EditInformationList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.EditInformationCodeName = false;
              that.$message({
                message: '设置成功',
                type: 'success'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    //设置是否开启广告
    changeSwitch: function(data) {
      var that = this;
      console.log(data);
      var paramList = {
        isNotOpen: data.NetbarBusiness.IsNotShowAD ? 1 : 0,
        netbarId: data.NetbarID,
      };
      this.vq.sendMes({
        url: "/api/Netbar/SetNetbarAD",
        type: 'get',
        data: paramList,
        loader: true,
        fn: function(res) {
          that.getData();
        }
      })
    },
    getViptime: function(item, type) {
      var itemVip = false;
      var word = "";
      for (var i = 0; i < item.length; i++) {
        if (item[i].Name == type) {
          itemVip = item[i];
        }
      }
      if (!itemVip) {
        return '未开通'
      } else {
        if (itemVip.IsExpire == '未到期') {
          return itemVip.ExpireDateTime
        } else {
          return '已过期'
        }
      }
    },
    //表格状态过滤
    formatNetbarBusiness: function(item, column) {
      var str = "";
      if (item) {
        if (item.NetbarBusiness.IsNotOpenWindow) {
          str += '580特权客户端显示  ';
        } else {
          str += '580特权客户端不显示  ';
        }
        if (item.NetbarBusiness.IsNotSetAppTableIcon) {
          str += '  桌标业务开启';
        }
        if (item.NetbarBusiness.IsNotSetHomePage) {
          str += '  主页开启';
        }
      } else {

      }
      return str;
    },
    //表格状态过滤
    formatProductPowerInfos: function(item, column) {
      var str = ""
      if (item.ProductPowerInfos.length == 0) {
        return "steam特权黄金版";
      } else {
        for (var i = 0; i < item.ProductPowerInfos.length; i++) {
          if (item.ProductPowerInfos[i].IsExpire != '已到期') {
            str += item.ProductPowerInfos[i].Name;
          }
        }
        if (str == '') {
          return "steam特权黄金版";
        }
        return str;
      }
    },
  }
}
</script>
