<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>竞猜模式设置</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-button type="success" icon="el-icon-setting" @click.stop="RuleSetting">规则设置</el-button>
        <br />
        <br />
      </div>
      <!-- 表格 -->
      <el-table :data="GameModelList.Object" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Id" sortable label="竞猜ID"></el-table-column>
        <el-table-column property="MinTitle" label="竞猜类型"></el-table-column>
        <el-table-column property="MaxTitle" label="竞猜模式"></el-table-column>
        <el-table-column property="GameType" label="游戏类型"></el-table-column>
        <el-table-column property="CreateTime" label="创建时间"></el-table-column>
        <el-table-column property="EndTime" label="下架时间"></el-table-column>
        <el-table-column property="LoginDevice" label="图片">
          <template slot-scope="scope">
            <el-button type="danger" size="small" icon="el-icon-picture-outline" circle @click.stop="SeeImages(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="IntegralTaskUpdateformation(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-card>
    </div>
  </div>
  <!--规则设置 -->
  <el-dialog title="规则设置" :visible.sync="SetGameBetRatioName" width="800px" @close='SetGameBetRatioDialog'>
    <el-form :model="SetGameBetRatioList" :rules="rules" ref="SetGameBetRatioList" label-width="280px" class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="20">
          <el-form-item label="每日竞猜使用灵石最高上限设置：">
            <el-input-number v-model="SetGameBetRatioList.EverydayUseIntegral" :min="1" :max="9999" label="数值在1~9999之间"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="每个竞猜模式每日使用灵石最高上限设置：">
            <el-input-number v-model="SetGameBetRatioList.EachBetUesIntegral" :min="1" :max="9999" label="数值在1~9999之间"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="竞猜成功奖励比例设置：">
            <el-slider v-model="SetGameBetRatioList.RewardIntegral" range :marks="marksList"></el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="竞猜成功奖励比例：">
            <span>{{SetGameBetRatioList.RewardIntegral[0]}}%~{{SetGameBetRatioList.RewardIntegral[1]}}%</span>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="竞猜失败奖励比例设置：">
            <el-slider v-model="SetGameBetRatioList.DeductionIntegral" range :marks="marksList"></el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="竞猜失败奖励比例：">
            <span>{{SetGameBetRatioList.DeductionIntegral[0]}}%~{{SetGameBetRatioList.DeductionIntegral[1]}}%</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="SetGameBetRatioName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="SetGameBetRatioSubmit('SetGameBetRatioList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--编辑 -->
  <el-dialog title="任务设置" :visible.sync="IntegralTaskUpdateName" width="800px" @close='IntegralTaskUpdateDialog'>
    <el-form :model="IntegralTaskUpdateList" :rules="rules" ref="IntegralTaskUpdateList" label-width="120px" class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="竞猜类型：">
            <el-input v-model="IntegralTaskUpdateList.MinTitle" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="竞猜模式：">
            <el-input v-model="IntegralTaskUpdateList.MaxTitle" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="游戏类型：">
            <el-input v-model="IntegralTaskUpdateList.GameType" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下架时间：" prop="EndTime">
            <el-date-picker v-model="IntegralTaskUpdateList.EndTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传照片：">
            <el-upload class="avatar-uploader" :action="Imgurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="IntegralTaskUpdateName = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="IntegralTaskUpdateSubmit('IntegralTaskUpdateList')">确 定</el-button>
    </div>
  </el-dialog>
  <!--图片展示 -->
  <el-dialog title="图片展示" :visible.sync="ImgspasetName" width="600px">
    <div class="ImgspasetUrl">
      <img v-if="ImgspasetUrl" :src="ImgspasetUrl">
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="ImgspasetName = false">取 消</el-button>
    </div>
  </el-dialog>


</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'QuizMode',
  components: {
    tabbar
  },
  data: function() {
    return {
      imageUrl: '',
      Imgurl: axios.defaults.baseURL + '/api/NavigationConfig/PostFileUpLoad',
      GameModelList: {},
      IntegralTaskUpdateList: {},
      IntegralTaskUpdateName: false,
      ImgspasetName: false,
      ImgspasetUrl: '',
      //规则设置
      SetGameBetRatioName: false,
      SetGameBetRatioList: {
        EverydayUseIntegral: 1,
        EachBetUesIntegral: 1,
        RewardIntegral: [0, 0],
        DeductionIntegral: [0, 0]
      },
      marksList: {
        50: {
          style: {
            color: '#1989FA'
          },
          label: this.$createElement('strong', '50%')
        }
      },
      rules: {
        Title: [{
            required: true,
            message: '请输入任务名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 15,
            message: '长度在 1 到 15 个字符',
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
        Ratio: [{
            required: true,
            message: '请输入网费比例',
            trigger: 'blur'
          },
          {
            pattern: /^100$|^(\d|[1-9]\d)$/,
            message: '值为正整数且小于100或等于100'
          }
        ],
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    //图片上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.IntegralTaskUpdateList.ImgUrl = file.response.Object;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    SeeImages: function(index, row) {
      this.ImgspasetUrl = row.ImgUrl;
      this.ImgspasetName = true;
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
        type: null,
        orderby: 0,
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/BetRelevant/GameModelList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {}
      })
    },
    IntegralTaskUpdateDialog: function() {
      this.imageUrl = '';
    },
    IntegralTaskUpdateformation: function(index, row) {
      this.IntegralTaskUpdateName = true;
      this.IntegralTaskUpdateList = row;
    },
    IntegralTaskUpdateSubmit: function(IntegralTaskUpdateList) {
      var EndTime = this.$moment(this.IntegralTaskUpdateList.TermOfValidity).format("YYYY-MM-DD");
      var getArrList = {
        Id: this.IntegralTaskUpdateList.Id,
        MinTitle: this.IntegralTaskUpdateList.MinTitle,
        MaxTitle: this.IntegralTaskUpdateList.MaxTitle,
        GameType: this.IntegralTaskUpdateList.GameType,
        EndTime: this.IntegralTaskUpdateList.EndTime,
        ImgUrl: this.IntegralTaskUpdateList.ImgUrl,
      };
      this.$refs[IntegralTaskUpdateList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/BetRelevant/GameBetUpdate",
            type: 'post',
            data: getArrList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.IntegralTaskUpdateName = false;
              that.$message({
                message: '修改成功',
                type: 'success'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    //规则设置

    RuleSetting: function() {
      var that = this;
      this.vq.bindTo({
        url: "/api/BetRelevant/GetGameBetRatio",
        type: 'get',
        data: {},
        loader: true,
        addfn: function(res) {
          console.log(res.Object);
          that.SetGameBetRatioList = {
            EverydayUseIntegral: res.Object.EverydayUseIntegral,
            EachBetUesIntegral: res.Object.EachBetUesIntegral,
            RewardIntegral: [res.Object.MinRewardIntegral, res.Object.MaxRewardIntegral],
            DeductionIntegral: [res.Object.MinDeductionIntegral, res.Object.MaxDeductionIntegral],
          };
          that.SetGameBetRatioName = true;
        }
      })
    },
    SetGameBetRatioDialog: function() {},
    //
    SetGameBetRatioSubmit: function(SetGameBetRatioList) {
      var getArrList = {
        EverydayUseIntegral: this.SetGameBetRatioList.EverydayUseIntegral,
        EachBetUesIntegral: this.SetGameBetRatioList.EachBetUesIntegral,
        MinRewardIntegral: this.SetGameBetRatioList.RewardIntegral[0],
        MaxRewardIntegral: this.SetGameBetRatioList.RewardIntegral[1],
        MinDeductionIntegral: this.SetGameBetRatioList.DeductionIntegral[0],
        MaxDeductionIntegral: this.SetGameBetRatioList.DeductionIntegral[1],
      };
      this.$refs[SetGameBetRatioList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/BetRelevant/SetGameBetRatio",
            type: 'post',
            data: getArrList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.SetGameBetRatioName = false;
              that.$message({
                message: '规则设置成功',
                type: 'success'
              });
            }
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style media="screen">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-table .caret-wrapper {
  padding: 0;
}
</style>
