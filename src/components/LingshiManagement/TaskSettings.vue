<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>赚取任务设置</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 表格 -->
      <el-table :data="GetIntegralTaskList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Id" label="任务ID"></el-table-column>
        <el-table-column property="Title" label="任务名称"></el-table-column>
        <el-table-column property="IntegralReward" label="奖励灵石数"></el-table-column>
        <el-table-column property="Integrallimit" label="每日获得灵石最高上线"></el-table-column>
        <el-table-column property="CreateTime" label="创建时间"></el-table-column>
        <el-table-column property="TermOfValidity" label="下架时间"></el-table-column>
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
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
  </div>

  <!--积分设置 -->
  <el-dialog title="任务设置" :visible.sync="IntegralTaskUpdateName" width="800px" @close='IntegralTaskUpdateDialog'>
    <el-form :model="IntegralTaskUpdateList" :rules="rules" ref="IntegralTaskUpdateList" label-width="120px" class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="任务名称：" prop="Title">
            <el-input v-model="IntegralTaskUpdateList.Title" auto-complete="off" placeholder="请输入任务名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="奖励灵石数：" prop="IntegralReward">
            <el-input v-model="IntegralTaskUpdateList.IntegralReward" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每日获得上限：" prop="Integrallimit">
            <el-input v-model="IntegralTaskUpdateList.Integrallimit" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务排序：" prop="Sort">
            <el-input v-model="IntegralTaskUpdateList.Sort" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下架时间：" prop="TermOfValidity">
            <el-date-picker v-model="IntegralTaskUpdateList.TermOfValidity" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="首页展示：" prop="IsShow">
            <el-switch v-model="IntegralTaskUpdateList.IsShow" active-color="#cccccc" inactive-color="#13ce66">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="任务内容：" prop="Content">
            <el-input type="textarea" v-model="IntegralTaskUpdateList.Content" auto-complete="off" placeholder="请输入任务内容" :autosize="{ minRows: 8, maxRows: 14}"></el-input>
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


  <!--积分设置 -->
  <el-dialog title="图片展示" :visible.sync="ImgspasetName" width="600px" @close='IntegralsettingDialog'>
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
  name: 'UserLoginog',
  components: {
    tabbar
  },
  data: function() {
    return {
      imageUrl: '',
      Imgurl: axios.defaults.baseURL + '/api/NavigationConfig/PostFileUpLoad',
      pageSize: 10,
      pageNo: 1,
      total: 0,
      GetIntegralTaskList: {},
      IntegralTaskUpdateList: {},
      IntegralTaskUpdateName: false,
      ImgspasetName: false,
      ImgspasetUrl: '',
      rules: {
        Title: [{
            required: true,
            message: '请输入任务名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
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
        phone: this.phone,
        consumerId: this.consumerId,
        netbarId: this.netbarId,
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/IntegralTask/GetIntegralTaskList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    IntegralsettingDialog: function() {

    },
    IntegralTaskUpdateDialog: function() {

    },
    IntegralTaskUpdateformation: function(index, row) {
      this.IntegralTaskUpdateName = true;
      this.IntegralTaskUpdateList = row;
      this.imageUrl = row.ImgUrl;
    },
    IntegralTaskUpdateSubmit: function(IntegralTaskUpdateList) {
      var EndTime = this.$moment(this.IntegralTaskUpdateList.TermOfValidity).format("YYYY-MM-DD");
      var getArrList = {
        Id: this.IntegralTaskUpdateList.Id,
        Sort: this.IntegralTaskUpdateList.Sort,
        Title: this.IntegralTaskUpdateList.Title,
        Content: this.IntegralTaskUpdateList.Content,
        IntegralReward: this.IntegralTaskUpdateList.IntegralReward,
        Integrallimit: this.IntegralTaskUpdateList.Integrallimit,
        ImgUrl: this.IntegralTaskUpdateList.ImgUrl,
        ImgUrl2: this.IntegralTaskUpdateList.ImgUrl,
        IsShow: this.IntegralTaskUpdateList.IsShow,
        EndTime: EndTime
      };
      this.$refs[IntegralTaskUpdateList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/IntegralTask/IntegralTaskUpdate",
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
</style>
