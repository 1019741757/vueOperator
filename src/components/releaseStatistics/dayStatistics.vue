<template>
  <div class="wraper personinfo-wrap">
    <tabbar></tabbar>
    <div class="padding-pb fs-18 item-title">
      <span class="little-blue"></span>
      <span>每日点击量统计</span>
    </div>

    <div class="innerwrap">
      <div class="info-content">
        <!-- 检索 -->
        <div class="data-choose-top">
          <div class="lf">
            <span>请选择统计时间</span>
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
            <input type="text" class="input-small" placeholder="请输入桌标编号" v-model="Name">
          </div>
          <!-- <span class="lf"></span>
                <div class="lf">
                   <input type="text" class="input-small" placeholder="请输入桌标名称" v-model="NetbarID">
                </div>
                <span class="lf"></span> -->
          <button class="button-confirm margin-l30" @click="send">查询</button>
          <button class="button-confirm margin-l30" @click="reset">重置</button>
        </div>

        <!-- 表格 -->
        <table>
          <tr class="table-header">
            <td>日期</td>
            <td>点击量（次）</td>
          </tr>
          <tr v-for="item in dayStatisticsArr.Items">
            <td>{{item.Date}}</td>
            <td>{{item.Num}}</td>
          </tr>
        </table>
                    <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
        <!-- 分页 -->
        <floatboard v-if="boardshowAd" @hiddenWindow="hiddenWindow" :confirmWay="confirmWayAd">
          <h5 class='margin-b25'>确认操作？</h5>
        </floatboard>
        <pages :allPage="dayStatisticsArr.Total" @pagesChange="getBill"></pages>
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
    data: function () {
      return {
        NetbarID: "",
        beginTime: "",
        endTime: "",
        Name: "",
        NumL:"",
        dayStatisticsArr:[],
        type:2,
        beginshow: false,
        boardshowAd: false,
        endshow: false,
        haveNone:false,
        pageIndex: 1,
        boardshow: false,
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
        GetNetbarList: [],
        nowBar: {},
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
    mounted: function () {
      this.getBill();
    },
    methods: {
      getarr: function (str) {
        if (str) {
          return str.split(",");
        } else {
          return [];
        }
      },
      confirmWay: function () {
        var that = this;
        var _data = {};
        if (that.nowBar) {
          _data = {
            version: that.version,
            netbarId: that.nowBar.NetbarID,
          }
        } else {
          _data = {
            version: that.version ,
          }
        }
        this.vq.sendMes({
          url: "/api/Netbar/SetNetbarVersion",
          data: _data,
          fn: function () {
            that.getBill();
            that.version = "";
          }
        })
      },
      hiddenWindow: function () {
        this.boardshow = false;
        this.boardshowAd = false;
      },
      handleversion: function (item) {
        this.boardshow = true;
        if (item) {
          this.nowBar = item;
        } else {
          this.nowBar = false;
        }
      },
      changeAd: function (item) {
        this.boardshowAd = true;
        this.nowitem = item;
      },
      confirmWayAd: function () {
        var that = this;
        var open = this.nowitem.NetbarBusiness.IsNotShowAD ? 0 : 1;
        this.vq.sendMes({
          url: "/api/Netbar/SetNetbarAD",
          data: {
            isNotOpen: open,
            netbarId: this.nowitem.NetbarID,
          },
          fn: function () {
            that.getBill();
          }
        })
      },
      getBill: function (adder) {
        var that = this;
        this.pageIndex = this.$route.query.pages || 1;
        var _arrcheck = [];
        var getArr = {
            startTime: this.beginTime,
          endTime: this.endTime,
          name: this.Name,
          type:this.type,
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
          url: "/api/PVStatistics/GetArDateReportList",
          type: 'get',
          data: _data,
          loader: true,
          addfn: function (res) {
            that.haveNone = false;
            that.dayStatisticsArr =res;
               if (res.Items.length < 1) {
                that.haveNone = true;
              }
            }
        })
      },
      send: function () {
        this.unit.DateSend.call(this, this.getBill);
      },
      getViptime: function (item, type) {
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
      reset: function () {
        this.beginTime = '';
        this.endTime = '';
        this.Name = '';
        this.haveNone=false;
        for (var i = 0; i < this.checkboxArr.length; i++) {
          this.checkboxArr[i].value = false;
        }
        this.send();
      },
      clickDay: function (day) {
        this.beginTime = day;
        this.beginshow = false;
      },
      clickEnd: function (day) {
        this.endTime = day;
        this.endshow = false;
      },
      showrili: function (type) {
        this.unit.rilishow.call(this, type);
      },
      showtime: function (index) {
        var value = !this.timeArr[index];
        for (var i = 0; i < this.timeArr.length; i++) {
          this.timeArr[i] = false;
        }
        this.timeArr.splice(index, 1, value);
      },
      busHas: function (item) {
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
      productHas: function (item) {
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
.haveNoneS {
    margin-top: 50px;
    text-align: center;
    color: gray;
  } 
</style>
