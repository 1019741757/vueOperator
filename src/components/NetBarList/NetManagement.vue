<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>网吧管理</span>
  </div>

  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div class="data-choose-top">
        <div class="lf">
          <input class="input-small" type="" name="" placeholder="开始时间" v-model="beginTime" @click="showrili(0)" />
          <Calendar v-on:choseDay="clickDay" v-if="beginshow"></Calendar>
        </div>
        <span class="lf"></span>
        <div class="lf">
          <input class="input-small" type="" name="" placeholder="结束时间" v-model="endTime" @click="showrili(1)" />
          <Calendar v-on:choseDay="clickEnd" v-if="endshow"></Calendar>
        </div>
        <span class="lf"></span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="请输入网吧名称" v-model="NetbarName">
        </div>
        <span class="lf"></span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="请输入网吧ID" v-model="NetbarID">
        </div>
        <span class="lf"></span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="代理商名称" v-model='AgencyName'>
        </div>
        <span class="lf"></span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="请输入代理商手机号" v-model="AgencyPhone">
        </div>
        <span class="lf"></span>
        <div class="lf">
          <input type="text" class="input-small" placeholder="代理商ID" v-model="AgencyId">
        </div>
        <button class="button-confirm margin-l30" @click="send">查询</button>
        <button class="button-confirm margin-l30" @click="reset">重置</button>
      </div>

      <div class="data-choose-top" style="overflow:hidden">
        <!-- 去掉选项框 -->
        <div class="lf" v-for="item in checkboxArr">
          <input type="checkbox" class="small-checkbox" v-model='item.value'>{{item.checkboxname}}
        </div>
        <div class="lr">
          <button class="button-confirm" @click='handleversion()'>全部设置版本</button>
        </div>
      </div>

      <!-- 表格 -->
      <table>
        <tr class="table-header">
          <td>网吧Id</td>
          <td>网吧名称</td>
          <td>所属代理商</td>
          <td>代理商ID</td>
          <td>特权时间设置</td>
          <td>设置版本</td>
          <td>设置是否开启广告</td>
          <td>是否开启影视特权</td>
          <td>激活状态</td>
          <td>是否开启加速器桌标</td>
          <td>添加网吧账号</td>
          <td>桌面程序管理</td>
        </tr>
        <tr v-for="(item,index) in GetNetbarList.Items">
          <td>{{item.NetbarID}}</td>
          <td>{{item.NetbarName}}</td>
          <td>{{item.AgencyName}}</td>
          <td>{{item.AgencyId}}</td>
          <!-- stem特权设置 -->
          <td @click='setTime(item.NetbarID)'>
            <button class="back-confirm btn-small">设置时间</button>
          </td>
          <!-- 设置版本 -->
          <td @click='handleversion(item)'>
            <span>当前版本：{{item.UpdatingVersion}}</span>
            <button class="back-confirm btn-small">设置版本</button>
          </td>
          <td><button :class="item.NetbarBusiness.IsNotShowAD?'back-confirm color-w btn-small':'back-cancel color-w btn-small'" @click="changeAd(item)">{{item.NetbarBusiness.IsNotShowAD?'点击关闭广告':'点击开启广告'}}</button></td>
          <td><button :class="item.NetbarBusiness.IsNotShowTV?'back-confirm color-w btn-small':'back-cancel color-w btn-small'" @click="changeTV(item)">{{item.NetbarBusiness.IsNotShowTV?'点击关闭影视特权':'点击开启影视特权'}}</button></td>
          <td><button :class="item.MachineCode != ''?'back-confirm color-w btn-small':'back-cancel color-w btn-small'" @click="changeMachineCode(item)">激活状态</button></td>
          <td><button :class="item.NetbarBusiness.IsNotShowAccelerator?'back-confirm color-w btn-small':'back-cancel color-w btn-small'" @click="changeAppTableIcon(item)">{{item.NetbarBusiness.IsNotShowAccelerator?'点击关闭加速器桌标':'点击开启加速器桌标'}}</button></td>
          <td @click='addInformation(item)'>
            <button :class="item.NetbarAccountNumberState==0?'back-confirm color-w btn-small':'back-cancel color-w btn-small'" :disabled="item.NetbarAccountNumberState!=0">添加网吧后台账号</button>
          </td>
          <td @click='DesktopProgram(item)'>
            <button class="back-confirm color-w btn-small">设置</button>
          </td>
        </tr>
      </table>
      <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
      <floatboard v-if="boardshow" @hiddenWindow="hiddenWindow" :confirmWay="confirmWay">
        <h5 class='margin-b25'>设置版本</h5><input class='margin-b25' type="text" name="" v-model='version' :placeholder="GetNetbarList.Items.UpdatingVersion">
      </floatboard>
      <!-- steam特权钻石版增加时间设置 -->
      <floatboard v-if="boardVip" @hiddenWindow="hiddenWindow" :confirmWay="confirmWaySetVipTim">
        <h5 class='margin-b25'>steam特权钻石版增加时间设置</h5>
        <div>
          <div class="bus-box">
            <span>包月加速器：</span>
            <span class="fs-12">请选择天数:</span>
            <span class="bus-add-button" @click="changeMonth1(0,num)">-</span>
            <input type="text" name="" class="bus-input-num" v-model="num" disabled="disabled" />
            <span class="bus-add-button" @click="changeMonth1(1,num)">+</span>
          </div>
          <div class="bus-box">
            <span>steam特权钻石版：</span>
            <span class="fs-12">请选择月数:</span>
            <span class="bus-add-button" @click="changeMonth(0,num1)">-</span>
            <input type="text" name="" class="bus-input-num" v-model="num1" disabled="disabled" />
            <span class="bus-add-button" @click="changeMonth(1,num1)">+</span>
          </div>
        </div>
      </floatboard>
      <!-- 设置版本 -->
      <el-dialog title="设置版本" :visible.sync="SetupVersionName" width="500px">
        <el-radio-group v-model="SetupVersionValue" class="Net_elradio" v-if="GetClientVersionList.length>0">
          <el-radio :label="item.VersionNumber" v-for="(item,index) in GetClientVersionList" :key='index'>{{item.VersionNumber}}</el-radio>
        </el-radio-group>
        <div class="" v-else> 当前暂无可设置的版本号 </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="SetupVersionName = false">取 消</el-button>
          <el-button type="primary" size="small" @click.native="SetupVersionSubmit()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加网吧后台账号 -->
      <el-dialog title="添加网吧后台账号" :visible.sync="addInformationCodeName" width="500px" @close='addPrizeDialog'>
        <el-form :model="addInformationList" :rules="rules" ref="addInformationList" label-width="150px" class="demo-ruleForm">
          <el-form-item label="网吧联系人：" prop="Contacts">
            <el-input v-model="addInformationList.Contacts" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人手机号：" prop="Phone">
            <el-input v-model="addInformationList.Phone" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="addInformationCodeName = false">取 消</el-button>
          <el-button type="primary" size="small" @click.native="addInformationSubmit('addInformationList')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 桌面程序管理 -->
      <el-dialog title="桌面程序管理" :visible.sync="DesktopProgramName" width="650px">
        <el-form :model="DesktopProgramList" :rules="rules" ref="DesktopProgramList" label-width="150px" class="demo-ruleForm">
          <el-form-item label="桌面程序设置：">
            <el-radio-group v-model="DesktopProgramList.Value">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">上</el-radio>
              <el-radio :label="2">中</el-radio>
              <el-radio :label="4">下</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="DesktopProgramName = false">取 消</el-button>
          <el-button type="primary" size="small" @click.native="DesktopProgramSubmit('DesktopProgramList')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- <floatboard v-if="addNetBarAccf" @hiddenWindow="hiddenWindow" :confirmWay="addconfirmWay">
        <h5 class='margin-b25'>添加网吧后台账号</h5>
        <span class="display-inb margin-r19">网吧联系人:</span>
        <input class='margin-b25' type="text" name="" v-model='addContacts' placeholder="请输入网吧联系人"><br>
        <span>联系人手机号: </span>
        <input class='margin-b25' type="text" name="" v-model='addBindingPhone' placeholder="请输入联系人手机号"><br>
      </floatboard> -->

      <floatboard v-if="boardshowAd" @hiddenWindow="hiddenWindow" :confirmWay="confirmWayAd">
        <h5 class='margin-b25'>确认操作？</h5>
      </floatboard>
      <!-- 开启影视特权 -->
      <floatboard v-if="boardshowTV" @hiddenWindow="hiddenWindow" :confirmWay="confirmWayTV">
        <h5 class='margin-b25'>确认操作？</h5>
      </floatboard>
      <!-- 开启加速器桌标 -->
      <floatboard v-if="boardAppTableIcon" @hiddenWindow="hiddenWindow" :confirmWay="confirmWayAppTableIcon">
        <h5 class='margin-b25'>确认操作？</h5>
      </floatboard>
      <!-- 分页 -->
      <pages :allPage="GetNetbarList.Total" @pagesChange="getBill"></pages>
    </div>
  </div>


</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
import Calendar from 'vue-calendar-component';
import pages from '../pages.vue';
import floatboard from "../floatboard";
export default {
  name: 'barbill',
  components: {
    tabbar,
    Calendar,
    pages,
    floatboard
  },
  data: function() {
    return {
      num: 0,
      num1: 0,
      NetbarID: "",
      beginTime: "",
      endTime: "",
      beginshow: false,
      boardshowAd: false,
      boardshowTV: false,
      boardAppTableIcon: false,
      endshow: false,
      haveNone: false,
      pageIndex: 1,
      boardshow: false,
      addNetBarAccf: false,
      boardVip: false,
      barname: "",
      version: "",
      phone: "",
      name: "",
      code: "",
      timeArr: [],
      NetbarName: "",
      AgencyPhone: "",
      AgencyName: "",
      AgencyId: "",
      buttonClass: 'back-confirm',
      buttonword: '关闭广告',
      addBindingPhone: '',
      addContacts: '',
      GetNetbarList: [],
      NetbarBusiness: [],
      nowBar: {},
      //设置版本
      SetupVersionName: false,
      SetupVersionValue: '',
      GetClientVersionList: [],
      //添加网吧后台账号
      addInformationCodeName: false,
      addInformationList: {
        Contacts: '',
        Phone: '',
      },
      //桌面程序的管理
      DesktopProgramName: false,
      DesktopProgramList: {
        NetbarIds: null,
        Value: null
      },
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
      },
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
      }]
    }
  },
  mounted: function() {
    this.getBill();
  },
  methods: {
    // 点击加减号改变时间
    changeMonth: function(type, num1) {
      var _powerlist = this.num1;
      if (type == 0) {
        if (_powerlist <= 0) {
          _powerlist = 0
        } else {
          _powerlist--;
        }
      } else {
        if (_powerlist >= 12) {
          _powerlist = 12;
        } else {
          _powerlist++;
        }
      }
      this.num1 = _powerlist
      //  this.viparr.splice(index,1,_powerlist);
      //  console.log(this.viparr,111222);
    },
    // 点击加减号改变时间
    changeMonth1: function(type, num) {
      var _powerlist1 = this.num;
      if (type == 0) {
        if (_powerlist1 <= 0) {
          _powerlist1 = 0
        } else {
          _powerlist1 -= 3;
        }
      } else {
        if (_powerlist1 >= 3) {
          _powerlist1 = 3;
        } else {
          _powerlist1 += 3;
        }
      }
      this.num = _powerlist1
      //  this.viparr.splice(index,1,_powerlist);
      //  console.log(this.viparr,111222);
    },
    getarr: function(str) {
      if (str) {
        return str.split(",");
      } else {
        return [];
      }
    },
    // 设置特权时间
    confirmWaySetVipTim: function() {
      var that = this;
      let _data = {
        NetbarId: this.NetbarID,
        'ProductInfoDto': [{
            'ProductID': 1,
            'Count': this.num
          },
          {
            'ProductID': 2,
            'Count': this.num1
          }
        ]
      }
      this.vq.sendMes({
        url: "/api/Netbar/OpenPrivileges",
        type: 'post',
        data: _data,
        fn: function(res) {
          that.$store.state.primaryshow = true;
          if (res.StatusCode == 200) {
            that.$store.state.primaryInfo = '修改成功';
            // alert("设置成功")
          } else {
            that.$store.state.primaryInfo = '添加失败'
            // alert("设置失败")
          }
          that.getBill();
        }
      })
      this.NetbarID = ""
    },
    hiddenWindow: function() {
      this.boardshow = false;
      this.boardshowAd = false;
      this.boardshowTV = false;
      this.addNetBarAccf = false;
      this.boardVip = false;
      this.boardAppTableIcon = false;
    },
    //设置版本
    handleversion: function(item) {
      console.log(item);
      if (item) {
        this.nowBar = item;
        var getArr = {
          pageSize: 1000,
          pageIndex: 1
        };
      } else {
        this.nowBar = false;
        var getArr = {
          state: 2,
          pageSize: 1000,
          pageIndex: 1
        };
      }
      var that = this;
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/ClientVersion/GetClientVersionList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.GetClientVersionList = res.Items;
          that.SetupVersionName = true;
        }
      })
    },
    SetupVersionSubmit: function() {
      var that = this;
      var _data = {};
      if (that.nowBar) {
        _data = {
          version: that.SetupVersionValue,
          netbarId: that.nowBar.NetbarID,
        }
      } else {
        _data = {
          version: that.SetupVersionValue,
        }
      }
      this.vq.sendMes({
        url: "/api/Netbar/SetNetbarVersion",
        data: _data,
        fn: function() {
          that.getBill();
          that.SetupVersionName = false;
          that.$message({
            message: '设置成功',
            type: 'success'
          });
        }
      })
    },
    //添加网吧后台账号
    addPrizeDialog: function() {
      this.$refs.addInformationList.resetFields();
    },
    //添加网吧后台账号
    addInformation: function(row) {
      this.addInformationList.NetbarId = row.NetbarID;
      this.addInformationCodeName = true;
    },
    //Submit添加网吧后台账号
    addInformationSubmit: function(addInformationList) {
      this.$refs[addInformationList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/NetbarBackstage/CreateNetbarUser",
            type: 'post',
            data: {
              NetbarId: this.addInformationList.NetbarId,
              BindingPhone: this.addInformationList.Phone,
              Contacts: this.addInformationList.Contacts
            },
            loader: true,
            fn: function(res) {
              that.getBill();
              that.addInformationCodeName = false;
              that.$refs.addInformationList.resetFields();
              that.$message({
                message: '添加成功',
                type: 'success'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    // addNetBarAcc: function(item) {
    //   this.addNetBarAccf = true;
    //   if (item) {
    //     this.nowBar = item;
    //   } else {
    //     this.nowBar = false;
    //   }
    // },
    //添加网吧后台账号
    addconfirmWay: function() {
      var that = this;
      this.vq.sendMes({
        url: "/api/NetbarBackstage/CreateNetbarUser",
        type: 'post',
        data: {
          NetbarId: this.nowBar.NetbarID,
          BindingPhone: this.addBindingPhone,
          Contacts: this.addContacts
        },
        fn: function() {
          that.getBill();
        }
      })
    },
    DesktopProgram: function(row) {
      this.DesktopProgramName = true;
      this.DesktopProgramList.NetbarIds = [row.NetbarID];
      this.DesktopProgramList.Value = row.NetbarBusiness.DesktopProgramState;
    },
    DesktopProgramSubmit: function() {
      var that = this;
      this.vq.sendMes({
        url: "/api/Netbar/SetDesktopProgram",
        type: 'post',
        data: this.DesktopProgramList,
        fn: function() {
          that.getBill();
          that.DesktopProgramName = false;
          that.$message({
            message: '设置成功',
            type: 'success'
          });
        },
        err: function() {
          that.DesktopProgramName = false;
          that.$message({
            message: '设置失败',
            type: 'success'
          });
        }
      })
    },
    setTime: function(item) {
      this.boardVip = true;
      this.NetbarID = item;
    },
    changeAd: function(item) {
      this.boardshowAd = true;
      this.nowitem = item;
    },
    changeTV: function(item) {
      this.boardshowTV = true;
      this.nowitem = item;
    },
    changeMachineCode: function(item) {
      this.$confirm('确定重置网吧激活状态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var that = this;
        this.vq.sendMes({
          url: "/api/Netbar/ResetNetbar?netbarId=" + item.NetbarID,
          type: 'post',
          data: {
            NetbarId: item.NetbarID
          },
          fn: function() {
            that.getBill();
          }
        })
      }).catch(() => {});
    },
    changeAppTableIcon: function(item) {
      this.boardAppTableIcon = true;
      this.nowitem = item;
    },
    confirmWayAd: function() {
      var that = this;
      var open = this.nowitem.NetbarBusiness.IsNotShowAD ? 0 : 1;
      this.vq.sendMes({
        url: "/api/Netbar/SetNetbarAD",
        data: {
          isNotOpen: open,
          netbarId: this.nowitem.NetbarID,
        },
        fn: function() {
          that.getBill();
        }
      })
    },
    // 是否开启加速器桌标
    confirmWayAppTableIcon: function() {
      var that = this;
      var open = this.nowitem.NetbarBusiness.IsNotShowAccelerator ? 0 : 1;
      this.vq.sendMes({
        url: "/api/Netbar/SetIsNotShowAccelerator",
        data: {
          isNotOpen: open,
          netbarId: this.nowitem.NetbarID,
        },
        fn: function() {
          that.getBill();
        }
      })
    }, // 是否开启影视特权
    confirmWayTV: function() {
      var that = this;
      var open = this.nowitem.NetbarBusiness.IsNotShowTV ? 0 : 1;
      this.vq.sendMes({
        url: "/api/Netbar/SetNetbarTV",
        data: {
          isNotOpen: open,
          netbarId: this.nowitem.NetbarID,
        },
        fn: function() {
          that.getBill();
        }
      })
    },
    // 分页
    getBill: function(adder) {
      var that = this;
      this.pageIndex = this.$route.query.pages || 1;
      var _arrcheck = [];
      var getArr = {
        StartTime: this.beginTime,
        EndTime: this.endTime,
        NetbarName: this.NetbarName,
        NetbarID: this.NetbarID,
        AgencyPhone: this.AgencyPhone,
        AgencyName: this.AgencyName,
        AgencyId: this.AgencyId
      };
      var _type = 0;
      for (var i = 0; i < this.checkboxArr.length; i++) {
        if (this.checkboxArr[i].value) {
          _type += this.checkboxArr[i].checkboxid;
        }
      };
      if (_type != 0) {
        getArr.Type = _type;
      }

      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/Netbar/GetNetbarList",
        type: 'post',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.haveNone = false;
          that.timeArr = [];
          for (var i = 0; i < res.Items.length; i++) {
            that.timeArr.push(false);
          }
          if (res.Items.length < 1) {
            that.haveNone = true;
          }
        }
      })
    },
    send: function() {
      this.unit.DateSend.call(this, this.getBill);
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
    reset: function() {
      this.beginTime = '';
      this.endTime = '';
      this.NetbarName = '';
      this.NetbarID = '';
      this.AgencyPhone = '';
      this.AgencyName = "";
      this.AgencyId = "";
      this.type = [];
      this.haveNone = false;
      for (var i = 0; i < this.checkboxArr.length; i++) {
        this.checkboxArr[i].value = false;
      }
      this.send();
    },
    clickDay: function(day) {
      this.beginTime = day;
      this.beginshow = false;
    },
    clickEnd: function(day) {
      this.endTime = day;
      this.endshow = false;
    },
    showrili: function(type) {
      this.unit.rilishow.call(this, type);
    },
    showtime: function(index) {
      var value = !this.timeArr[index];
      for (var i = 0; i < this.timeArr.length; i++) {
        this.timeArr[i] = false;
      }
      this.timeArr.splice(index, 1, value);
    },
    busHas: function(item) {
      var str = "";
      if (item) {
        if (item.IsNotOpenWindow) {
          str += '<p>580特权客户端显示</p>';
        } else {
          str += '<p>580特权客户端不显示</p>';
        }
        if (item.IsNotSetAppTableIcon) {
          str += '<p>桌标业务开启</p>';
        }
        if (item.IsNotSetHomePage) {
          str += '<p>主页开启</p>';
        }
      } else {

      }
      return str;
    },
    productHas: function(item) {
      var str = ""
      if (item.length == 0) {
        return "无特权";
      } else {
        for (var i = 0; i < item.length; i++) {
          str += '<span>' + item[i].Name + '</span>';
        }

        return str;
      }
    }
  }
}
</script>
<style scoped>
table tr td {
  font-size: 14px;
}

.small-checkbox {
  width: 13px;
  height: 13px;
}

.dnumber {
  border: 1px solid #ccc;
  padding: 8px 10px;
}

.data-choose-top {
  padding-bottom: 25px;
}

.hasfloat {
  position: relative;
}

.float-td {
  position: absolute;
  background-color: #ffbcbc;
  z-index: 99;
}

h2 {
  text-align: left;
  border-left: 5px solid green;
  padding-left: 10px;
}

.display-inb {
  display: inline-block;
}

.margin-r50 {
  margin-right: 53px;
}

.margin-r19 {
  margin-right: 16px;
}

.bus-add-button {
  display: inline-block;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  background-color: #ddd;
  border-radius: 40px;
  font-size: 24px;
  padding: 0px;
  cursor: pointer;
}

.bus-input-num {
  width: 50px;
  height: 25px;
  line-height: 25px;
}

.bus-box {
  margin-bottom: 25px;
}

.haveNoneS {
  margin-top: 50px;
  text-align: center;
  color: gray;
}

.Net_elradio .el-radio {
  width: 26%;
  margin-bottom: 5px;
}
</style>
