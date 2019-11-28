<template>
<div class="slidebar back-theme" @mousewheel='sidebar'>
  <div class="">
    <div class="slidebar-content">
      <div class="user-info margin-b25">
        <div class="user-img margin-b10"><img src="../assets/img/userlogo.jpg"></div>
        <p class="color-w margin-b10  fs-16">您好,{{UserName}}</p>
      </div>
      <div class="menu-wrap" ref="wrape">
        <div class="list-menu" :style="{transform:'translate(0px,'+top+'px)'}" ref='menu'>
          <div class="list-menu-li fs-18 " @click="toindex">
            <div class="main-menu-name padding-pb"><span class="iconfont icon-shouye fs-18"></span>
              <font>首页</font>
            </div>
          </div>
          <div class="list-menu-li fs-18" v-for="(item,index) in menulist">
            <div class="main-menu-name padding-pb" @click="showmenu(index)"><span :class='["iconfont","fs-18",item.imgclass]'></span>
              <font>{{item.name}}</font><span class="iconfont icon-xiala1"></span>
            </div>
            <div class="slidebar-droper" v-show="menushow[index]">
              <div v-for="(sonitem,sonindex) in item.sonlist" @click="slidebarChange(sonitem.sonname,index,sonitem.url,item.imgclass)">
                <router-link :to="sonitem.url" tag="div" active-class="droper-li-on">
                  <div class="droper-li padding-pb"><span class="little-blue"></span>
                    <font>{{sonitem.sonname}}</font>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'slidebar',
  mounted: function() {
    this.UserName = this.vq.cookier.getCookie("UserName");
  },
  data: function() {
    return {
      menushow: [false, false, false, false, false, false, false, false, false, false, false, false, false],
      EarningOfPaying: "",
      UserName: "",
      menulist: [{
          name: "代理商管理",
          sonlist: [{
            url: "/AgentList",
            sonname: "代理商列表"
          }, {
            url: "/RefereeList",
            sonname: "推荐下级列表"
          }, {
            url: "/agentaccountmanage",
            sonname: "代理商账号审核"
          }, {
            url: "/ReginLog1",
            sonname: "登录日志"
          }, {
            url: "/error",
            sonname: "错误预警日志"
          }],
          imgclass: "icon-wode"
        },
        {
          name: "网吧业务管理",
          sonlist: [{
            url: "/NetBarList1",
            sonname: "网吧列表"
          }, {
            url: "/NetManagement",
            sonname: "网吧管理"
          }, {
            url: "/InformationManagement",
            sonname: "网吧信息管理"
          },  {
            url: "/OfflineRecordingofInternetCafe",
            sonname: "网吧离线记录"
          }, {
            url: "/StateStatistics",
            sonname: "网吧状态统计"
          }, {
            url: "/VersionManagement",
            sonname: "客户端版本管理"
          }, {
            url: "/VersionLog",
            sonname: "网吧版本日志"
          }, {
            url: "/InternetBarAppreciation",
            sonname: "网吧增值业务管理"
          }, {
            url: "/ValueAddedSettings",
            sonname: "网吧业务设置"
          }],
          imgclass: "icon-yewu"
        },
        {
          name: "网吧用户管理",
          sonlist: [{
            url: "/UserInformation",
            sonname: "用户信息管理"
          }, {
            url: "/UserMessageManagement",
            sonname: "用户消息管理"
          }, {
            url: "/UserLoginog",
            sonname: "用户登陆日志"
          }, {
            url: "/Feedback",
            sonname: "意见反馈"
          }, {
            url: "/LingshiManagement",
            sonname: "灵石管理"
          }, {
            url: "/LuckyDraw",
            sonname: "积分抽奖设置"
          }, {
            url: "/LuckyList",
            sonname: "积分抽奖记录"
          }],
          imgclass: "icon-yewu"
        },
        {
          name: "活动管理",
          sonlist: [{
            url: "/ActivityStatistics",
            sonname: "活动统计"
          }, {
            url: "/PrizeSetting",
            sonname: "奖品设置"
          }, {
            url: "/ExchangeStatistics",
            sonname: "网吧领取兑换统计"
          }, {
            url: "/CollectionRecords",
            sonname: "领取兑换记录"
          }, {
            url: "/PaymentRecord",
            sonname: "网吧支付记录"
          }, {
            url: "/InternetCafebill",
            sonname: "网吧账单"
          }],
          imgclass: "icon-yewu"
        },
        {
          name: "市场CRM管理",
          sonlist: [{
            url: "/MarketPerformance",
            sonname: "市场业绩管理"
          }, {
            url: "/AgentTerminal",
            sonname: "代理商终端管理"
          }, {
            url: "/MonthlySettlementBills",
            sonname: "单桌标有效终端月账单"
          }, {
            url: "/AgencySettlementBills",
            sonname: "单桌标结算终端代理商账单"
          }, {
            url: "/AgencyMonthlySettlementBills",
            sonname: "单桌标结算记录"
          }],
          imgclass: "icon-yewu"
        },
        {
          name: "赚取灵石管理",
          sonlist: [{
            url: "/LingshiStatistics",
            sonname: "赚取灵石统计"
          }, {
            url: "/TaskSettings",
            sonname: "赚取任务设置"
          }],
          imgclass: "icon-yewu"
        },
        {
          name: "竞猜管理",
          sonlist: [{
            url: "/QuizStatistics",
            sonname: "游戏竞猜统计"
          }, {
            url: "/QuizMode",
            sonname: "竞猜模式设置"
          }, {
            url: "/CompetitiveOrder",
            sonname: "竞猜订单管理"
          }],
          imgclass: "icon-yewu"
        },
        {
          name: "战绩排名管理",
          sonlist: [{
            url: "/PUBGrankingsettings",
            sonname: "奖励设置"
          }, {
            url: "/StatisticsofAchievements",
            sonname: "战绩排名统计"
          }, {
            url: "/RankingRegionalAchievements",
            sonname: "区域战绩排名设置"
          }, {
            url: "/TopRankManagement",
            sonname: "总榜战绩排名管理"
          }, {
            url: "/CompetitionAwardManagement",
            sonname: "比赛领奖管理"
          }],
          imgclass: "icon-yewu"
        },
        {
          name: "业务统计",
          sonlist: [{
            url: "/dlsGetBill",
            sonname: "代理商收益账单"
          }, {
            url: "/dlsBillDetail",
            sonname: "代理商每日收益详情"
          }, {
            url: "/dlsCostBill",
            sonname: "代理商消费账单"
          }, {
            url: "/BarBill",
            sonname: "网吧收益账单"
          }, {
            url: "/BarBillConsume",
            sonname: "网吧消费账单"
          }, {
            url: "/TerminalTotal",
            sonname: "每日终端统计"
          }, {
            url: "/Terminaldaily",
            sonname: "网吧每日终端统计"
          }, {
            url: "/InternetbarTerminal",
            sonname: "网吧激活终端统计"
          }],
          imgclass: "icon-shuju"
        },
        {
          name: "财务相关",
          sonlist: [{
            url: "/yjSet",
            sonname: "参数设置"
          }, {
            url: "/czManner",
            sonname: "充值管理"
          }, {
            url: "/cpxsTotal",
            sonname: "产品销售统计"
          }, {
            url: "/dlsyuer",
            sonname: "代理商账户余额统计"
          }, {
            url: "/tixianManner",
            sonname: "提现管理"
          }, {
            url: "/consumerecord",
            sonname: "消费记录查询"
          }, {
            url: "/accountCheck",
            sonname: "对账预警管理"
          }],
          imgclass: "icon-caiwu"
        },
        {
          name: "业务功能设置",
          sonlist: [{
            url: "/zhiruBannerSet",
            sonname: "植入广告设置"
          }, {
            url: "/sfzbSet",
            sonname: "释放桌标设置"
          }, {
            url: "/zhuyeSet",
            sonname: "主页设置"
          }, {
            url: "/AgentNews",
            sonname: "代理商消息公告管理"
          }, {
            url: "/InternetbarNews",
            sonname: "网吧消息公告管理"
          }, {
            url: "/NavigationConfiguration",
            sonname: "导航配置"
          }],
          imgclass: "icon-wode"
        },
        {
          name: "steam特权管理",
          sonlist: [{
            url: "/steamtime",
            sonname: "网吧steam时长统计"
          }, {
            url: "/steamorder",
            sonname: "特权订单管理"
          }, {
            url: "/GameInventory",
            sonname: "游戏库存不足"
          }],
          imgclass: "icon-wode"
        },
        {
          name: "释放桌标点击量",
          sonlist: [{
            url: "/totalStatistics",
            sonname: "按桌标名称的点击量统计"
          }, {
            url: "/dayStatistics",
            sonname: "每日点击量统计"
          }],
          imgclass: "icon-wode"
        },
      ],
      GetAgencyInfo: {},
      top: 0
    }
  },
  methods: {
    sidebar: function(e) {
      var that = this;
      var height = this.$refs.wrape.clientHeight;
      var inheight = this.$refs.menu.clientHeight;
      setTimeout(function() {
        if (e.wheelDelta < 0) {
          if (height < inheight && -inheight < that.top * 2) {
            that.top -= 30;
          }
        } else {
          if (that.top < 0) {
            that.top += 30;
          }
        }
      }, 30)
    },
    showmenu: function(num) {
      var _nowNum = this.menushow[num];
      this.menushow.splice(num, 1, !_nowNum);
    },
    toindex: function() {
      this.$store.state.openlist = [];
      this.$router.push("/");
      this.$store.state.nowName = '首页';
    },
    slidebarChange: function(name, num, url, iconname) {
      var _has = false;
      for (var i = 0; i < this.$store.state.openlist.length; i++) {
        if (this.$store.state.openlist[i][0] == name) {
          _has = true;
        } else {

        }
      }
      if (_has) {
        this.$router.push("" + url);
      } else {
        this.$store.state.openlist.push([name, num, url, iconname]);
      }
      if (this.$store.state.openlist.length > 7) {
        this.$store.state.openlist.splice(0, 1);
      }
      if (name == "代理商每日收益详情") {
        this.$store.state.everyDayGet.AgencyPhone = '';
        this.$store.state.everyDayGet.AgencyName = '';
        this.$store.state.everyDayGet.AgencyId = "";
      }
      if (name == "网吧收益账单") {
        this.$store.state.everyDayGet.AgencyName = '';
        this.$store.state.everyDayGet.AgencyId = '';;
      }
      this.$store.state.nowName = name;
    }
  }
}
</script>

<style>
.slidebar {
  width: 220px;
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 999;
}

.img-content {
  float: left;
  width: 220px;
  text-align: center;
  background-color: #51567b;
}

.img-content img {
  width: 100%;
}

.user-info {
  text-align: center;
  padding-top: 88px;
}

.list-menu .iconfont {
  font-size: 20px;
}

.list-menu-li {
  border-top: 1px solid #4f5373;
  border-bottom: 1px solid #3c3f5a;
  color: #bec1dd;
  position: relative;
}

.list-menu-li .icon-xiala1 {
  font-size: 24px;
  top: 5px;
  position: absolute;
  right: 0px;
}

.main-menu-name {
  padding-left: 25px;
  cursor: pointer;
}

.slidebar-droper {
  font-size: 14px;
}

.droper-li {
  padding-left: 50px;
  position: relative;
}

.droper-li:hover {
  background-color: #51567b;
}

.droper-li:hover .little-blue {
  display: block;
}

.droper-li-on {
  background-color: #51567b;
}

.droper-li-on .little-blue {
  display: block !important;
}

.droper-li .little-blue {
  position: absolute;
  left: 0px;
  height: 44px;
  top: 0px;
  display: none;
}

.menu-wrap {
  position: absolute;
  width: 100%;
  bottom: 0px;
  top: 215px;
  overflow: hidden;

}
</style>
