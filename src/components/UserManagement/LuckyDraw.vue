<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>积分抽奖设置</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 表格 -->
      <el-table :data="DataList" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="PrizeId" label="奖品ID"></el-table-column>
        <el-table-column property="PrizeName" label="奖品名称"></el-table-column>
        <el-table-column property="Inventory" label="每周抽中上限"></el-table-column>
        <el-table-column label="操作"  width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="Integralsettingformation(scope.$index, scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-card>
    </div>
  </div>

  <!--编辑奖品 -->
  <el-dialog title="编辑奖品" :visible.sync="IntegralsettingName" width="600px" @close='IntegralsettingDialog'>
    <el-form :model="IntegralsettingList" :rules="rules" ref="IntegralsettingList" label-width="140px" class="demo-ruleForm">
      <el-form-item label="抽中上限：" prop="Inventory">
        <el-input-number v-model="IntegralsettingList.Inventory" step-strictly></el-input-number>
      </el-form-item>
      <p></p>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="IntegralsettingName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="IntegralsettingSubmit('IntegralsettingList')">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'LingshiManagement',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      //条件筛选
      phone: null,
      consumerId: null,
      DataList: [],
      IntegralsettingList: {
        PrizeId: "",
        PrizeName: "",
        PrizeContent: "",
        Inventory: ""
      },
      IntegralsettingName: false,
      rules: {
        Inventory: [{
          required: false,
          message: '请输入消息标题',
          trigger: 'blur'
        }, ],
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    //tabel数据获取
    getData: function() {
      var that = this;
      this.vq.bindTo({
        url: "/api/Lottery/GetLotteryPrizeList",
        type: 'get',
        data: {},
        loader: true,
        addfn: function(res) {
          that.DataList = res.Object;
        }
      })
    },
    Integralsettingformation: function(index, row) {
      this.IntegralsettingName = true;
      this.IntegralsettingList.PrizeId = row.PrizeId;
      this.IntegralsettingList.PrizeName = row.PrizeName;
      this.IntegralsettingList.PrizeContent = row.PrizeContent;
      this.IntegralsettingList.Inventory = row.Inventory;
    },
    IntegralsettingDialog: function() {
      this.IntegralsettingList.PrizeId = "";
      this.IntegralsettingList.Inventory = "";
    },
    IntegralsettingSubmit: function(IntegralsettingList) {
      this.$refs[IntegralsettingList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/Lottery/UpateLotteryPrize",
            type: 'post',
            data: this.IntegralsettingList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.IntegralsettingName = false;
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
  }
}
</script>
<style media="screen">
.el-input-number span {
  padding: 0
}
</style>
