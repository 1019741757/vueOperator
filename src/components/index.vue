<template>
<div class="wraper indexpage">
  <h1>欢迎进入580运营商后台</h1>
  </br>
  </br>
  <el-row :gutter="15">
    <el-card shadow="always">
      <el-row :gutter="15">
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="5">
          <div class="homepage_ul">
            <div class="homepage_li homepage_backou2">
              <span>{{GetNetbarActivityStatisticsList.PayMoney}}</span>
              <p>总已支付金额（元）</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="5">
          <div class="homepage_ul">
            <div class="homepage_li homepage_backou3">
              <span>{{GetNetbarActivityStatisticsList.ExchangeMoney}}</span>
              <p>总已兑换奖品金额（元）</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    </br>
    </br>
    <el-card shadow="always">
      <el-row :gutter="15">
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="5">
          <div class="homepage_ul">
            <div class="homepage_li homepage_backou1">
              <span>{{GetNetbarActivityStatisticsList.PartakeCount}}</span>
              <p>累计参与人数（人）</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="5">
          <div class="homepage_ul">
            <div class="homepage_li homepage_backou4">
              <span>{{GetNetbarActivityStatisticsList.NoExchangeCount}}</span>
              <p>累计未兑换次数（次）</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="5">
          <div class="homepage_ul">
            <div class="homepage_li homepage_backou5">
              <span>{{GetNetbarActivityStatisticsList.ExchangeCount}}</span>
              <p>累计已兑换次数（次）</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'index',
  components: {

  },
  data: function() {
    return {
      GetNetbarActivityStatisticsList: {}
    }
  },
  mounted: function() {
    this.getData();
  },
  methods: {
    getData: function() {
      var that = this;
      var getArr = {};
      this.vq.bindTo({
        url: "/api/NetbarBackstage/GetNetbarActivityStatistics",
        type: 'get',
        data: getArr,
        loader: true,
        addfn: function(res) {
          that.GetNetbarActivityStatisticsList = res.Object;
          console.log(res.Object);
        }
      })
    }
  },

}
</script>
<style>
.homepage_ul {
  display: -webkit-box;
  display: -ms-flexbox;
  text-align: center;
}

.homepage_ul .homepage_li {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 6% 2% 4%;
  border-radius: 8px;
}

.homepage_ul .homepage_li span {
  font-size: 28px;
  line-height: 40px;
}

.homepage_ul .homepage_li p {
  color: #929292;
}

.homepage_ul .homepage_li:first-child p {
  color: #fff;
  font-size: 16px;
}

.homepage_backou1 {
  background-color: #f6ae3f;
  color: #fff;
}

.homepage_backou2 {
  background-color: #69cdc5;
  color: #fff;
}

.homepage_backou3 {
  background-color: #ff6d60;
  color: #fff;
}

.homepage_backou4 {
  background-color: #6985ce;
  color: #fff;
}

.homepage_backou5 {
  background-color: #c275ff;
  color: #fff;
}

.homepage_backou6 {
  background-color: #ef7e5c;
  color: #fff;
}
</style>
