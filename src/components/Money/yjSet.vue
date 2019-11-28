<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>佣金设置</span>
  </div>

  <div class="innerwrap">
    <div class="info-content">
      <div class="data-choose-top" style="overflow:hidden">
        <!-- 表格一 -->
        <table>
          <tr>
            <td colspan="2">
              <h3>推荐奖励设置</h3>
            </td>
          </tr>
          <tr>
            <td>一级推荐奖励: <input type="text" placeholder="100" class="input-small" v-model='GetRewardRatio.RatioOfToGradeOne'>%</td>
            <td>二级推荐奖励: <input type="text" placeholder="10" class="input-small" v-model='GetRewardRatio.RatioOfToGradeTwo'>%</td>
          </tr>
          <tr>
            <td colspan="2"><button class="button-confirm" @click='showWindow(0)'>保存</button></td>
          </tr>
        </table>
        <!-- 表格二 -->
        <table class="tab2">
          <tr>
            <td colspan="2">
              <h3>弹窗收益设置（开启加速器桌标）</h3>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              开启收益设置：
              <input type="text" placeholder="请输入价格" v-model='GetOpenWindowCostPara'> 元/1000千台/月
            </td>
          </tr>
          <tr>
            <td colspan="2">
              关闭收益设置：
              <input type="text" placeholder="请输入价格" v-model="GetNotOpenWindowCostPara"> 元/1000千台/月
            </td>
          </tr>
          <tr>
            <td colspan="2"><button class="button-confirm" @click='showWindow(1)'>保存</button></td>
          </tr>
        </table>

        <table class="tab2">
          <tr>
            <td colspan="2">
              <h3>弹窗收益设置（关闭加速器桌标）</h3>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              开启收益设置：
              <input type="text" placeholder="请输入价格" v-model='GetOpenWindowCostPara1'> 元/1000千台/月
            </td>
          </tr>
          <tr>
            <td colspan="2">
              关闭收益设置：
              <input type="text" placeholder="请输入价格" v-model="GetNotOpenWindowCostPara1"> 元/1000千台/月
            </td>
          </tr>
          <tr>
            <td colspan="2"><button class="button-confirm" @click='showWindow(3)'>保存</button></td>
          </tr>
        </table>
        <table class="tab2">
          <tr>
            <td colspan="2">
              <h3>桌标收益设置</h3>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              开启收益设置：

              <input type="text" placeholder="请输入价格" v-model='GetAppTableIconCostPara'> 元/千台/月
            </td>
          </tr>
          <tr>
            <td colspan="2"><button class="button-confirm" @click='showWindow(2)'>保存</button></td>
          </tr>
        </table>
        <table class="tab2">
          <tr>
            <td colspan="2">
              <h3>活动分成佣金比例设置</h3>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              分成佣金比例：

              <input type="text" placeholder="请输入价格" v-model='GetActivitySub'> %
            </td>
          </tr>
          <tr>
            <td colspan="2"><button class="button-confirm" @click='showWindow(4)'>保存</button></td>
          </tr>
        </table>
      </div>
    </div>
    <floatboard v-if="boardshow" @hiddenWindow="hiddenWindow" :confirmWay="confirmWay">
      <h5 class='margin-b25'>确认操作？</h5>
    </floatboard>
  </div>

</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
import floatboard from "../floatboard";
export default {
  name: 'barbill',
  components: {
    tabbar,
    floatboard
  },
  mounted: function() {
    var that = this;
    this.vq.v(this).sendAll({
      reqList: [{
          url: "/api/Configure/GetNotOpenWindowCostPara",
          fn: function(res) {
            that.GetNotOpenWindowCostPara = res.Object;
          },
          loader: true,
        },
        {
          url: "/api/Configure/GetOpenWindowCostPara",
          fn: function(res, reslast) {
            that.GetOpenWindowCostPara = res.Object;
          },
          loader: true,
        },
        {
          url: "/api/Configure/GetAppTableIconCostPara",
          fn: function(res, reslast) {
            that.GetAppTableIconCostPara = res.Object;
          },
          loader: true,
        },
        {
          url: "/api/Configure/GetActivitySub",
          fn: function(res, reslast) {
            that.GetActivitySub = res.Object;
          },
          loader: true,
        },
        {
          url: "/api/Configure/GetRewardRatio",
          fn: function(res, reslast) {
            that.GetRewardRatio = res.Object;
          },
          loader: true,
        },
        {
          url: "/api/Configure/GetNotOpenWindowNotShowShortcutCostPara",
          fn: function(res) {
            that.GetNotOpenWindowCostPara1 = res.Object;
          },
          loader: true,
        },
        {
          url: "/api/Configure/GetOpenWindowNotShowShortcutCostPara",
          fn: function(res, reslast) {
            that.GetOpenWindowCostPara1 = res.Object;
          },
          loader: true,
        },
      ],
      isAsycn: true
    });
  },
  data: function() {
    return {
      beginTime: "",
      endTime: "",
      beginshow: false,
      endshow: false,
      GetNotOpenWindowCostPara: "",
      GetNotOpenWindowCostPara1: "",
      GetOpenWindowCostPara: "",
      GetOpenWindowCostPara1: "",
      GetAppTableIconCostPara: "",
      GetActivitySub: "",
      GetRewardRatio: "",
      boardshow: false,
      type: -1
    }
  },
  methods: {
    confirmWay: function() {
      if (this.type == 0) {
        this.saveRatio();
      } else if (this.type == 1) {
        this.savewindow();
      } else if (this.type == 2) {
        this.saveBus();
      } else if (this.type == 3) {
        this.notsavewindow();
      } else if (this.type == 4) {
        this.Activitywindow();
      }
    },
    showWindow: function(type) {
      this.boardshow = true;
      this.type = type;
    },
    hiddenWindow: function() {
      this.boardshow = false;
    },
    saveRatio: function() {
      var that = this;
      var _data = this.GetRewardRatio;
      this.vq.v(this).sendMes({
        url: "/api/Configure/SetRewardRatio",
        data: _data,
        fn: function(res) {
          that.unit.MessHandle.call(that, res);
        }
      })
    },
    saveBus: function() {
      var that = this;
      this.vq.v(this).sendMes({
        url: "/api/Configure/SetAppTableIconPara",
        data: {
          value: that.GetAppTableIconCostPara
        },
        fn: function(res, reslast) {
          that.unit.MessHandle.call(that, res);
        },
        loader: true,
        isAsycn: true
      }, );
    },
    Activitywindow: function() {
      var that = this;
      this.vq.v(this).sendMes({
        url: "/api/Configure/SetActivitySub",
        data: {
          value: that.GetActivitySub
        },
        fn: function(res, reslast) {
          that.unit.MessHandle.call(that, res);
        },
        loader: true,
        isAsycn: true
      }, );
    },
    savewindow: function() {
      var that = this;
      this.vq.v(this).sendAll({
        reqList: [{
            url: "/api/Configure/SetNotOpenWindowPara",
            data: {
              value: that.GetNotOpenWindowCostPara
            },
            fn: function(res) {
              that.unit.MessHandle.call(that, res);
            },
            loader: true,
          },
          {
            url: "/api/Configure/SetOpenWindowPara",
            data: {
              value: that.GetOpenWindowCostPara
            },
            fn: function(res, reslast) {

            },
            loader: true,
          },
        ],
        isAsycn: true
      });
    },
    notsavewindow: function() {
      var that = this;
      this.vq.v(this).sendAll({
        reqList: [{
            url: "/api/Configure/SetNotOpenWindowNotShowShortcutCostPara",
            data: {
              value: that.GetNotOpenWindowCostPara1
            },
            fn: function(res) {
              that.unit.MessHandle.call(that, res);
            },
            loader: true,
          },
          {
            url: "/api/Configure/SetOpenWindowNotShowShortcutCostPara",
            data: {
              value: that.GetOpenWindowCostPara1
            },
            fn: function(res, reslast) {},
            loader: true,
          },
        ],
        isAsycn: true
      });
    }
  },
}
</script>
<style scoped>
.tab2 {
  margin: 25px 0;
}

table tr td {
  font-size: 14px;
  border: none;
}

.data-choose-top {
  padding-bottom: 25px;
}
</style>
