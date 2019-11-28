<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>导航配置</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 表格 -->
      <el-table :data="GetNavigationConfigList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Id" label="图片ID"></el-table-column>
        <el-table-column property="Name" label="图片名称"></el-table-column>
        <el-table-column property="Describe" label="图片类型"></el-table-column>
        <el-table-column property="NavigationType" label="类型标号"></el-table-column>
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

  <!--导航配置 -->
  <el-dialog title="导航配置" :visible.sync="IntegralTaskUpdateName" width="800px" @close='IntegralTaskUpdateDialog'>
    <el-form :model="IntegralTaskUpdateList" :rules="rules" ref="IntegralTaskUpdateList" label-width="120px" class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="13">
          <el-form-item label="链接地址：" prop="Url">
            <el-input v-model="IntegralTaskUpdateList.Url" auto-complete="off" placeholder="请输入链接地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="图片名称：" prop="Name">
            <el-input v-model="IntegralTaskUpdateList.Name" auto-complete="off" placeholder="请输入图片名称"></el-input>
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
  name: 'NavigationConfiguration',
  components: {
    tabbar
  },
  data: function() {
    return {
      imageUrl: '',
      Imgurl: axios.defaults.baseURL + '/api/NavigationConfig/PostFileUpLoad',
      type: null,
      pageSize: 10,
      pageNo: 1,
      total: 0,
      GetNavigationConfigList: {},
      IntegralTaskUpdateList: {},
      IntegralTaskUpdateName: false,
      ImgspasetName: false,
      ImgspasetUrl: '',
      rules: {
        Url: [{
          required: true,
          message: '请输入链接地址',
          trigger: 'blur'
        }],
        Name: [{
            required: true,
            message: '请输入图片名称',
            trigger: 'blur'
          }],
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
        type: this.type,
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/NavigationConfig/GetNavigationConfigList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    IntegralsettingDialog: function() {
      this.ImgspasetUrl = '';
    },
    IntegralTaskUpdateDialog: function() {
      // this.$refs.IntegralTaskUpdateList.resetFields();
      // this.IntegralTaskUpdateList.ImgUrl='';
      // this.IntegralTaskUpdateList.Url='';
      // this.IntegralTaskUpdateList={};
      // this.imageUrl = '';
      // console.log(this.IntegralTaskUpdateList);
    },
    IntegralTaskUpdateformation: function(index, row) {
      this.IntegralTaskUpdateName = true;
      this.IntegralTaskUpdateList = row;
      this.imageUrl = row.ImgUrl;
    },
    IntegralTaskUpdateSubmit: function(IntegralTaskUpdateList) {
      var getArrList = {
        Id: this.IntegralTaskUpdateList.Id,
        Name: this.IntegralTaskUpdateList.Name,
        Describe: this.IntegralTaskUpdateList.Describe,
        Url: this.IntegralTaskUpdateList.Url,
        ImgUrl: this.IntegralTaskUpdateList.ImgUrl,
        Sort: this.IntegralTaskUpdateList.Sort,
        Type: this.IntegralTaskUpdateList.NavigationType,
      };
      this.$refs[IntegralTaskUpdateList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/NavigationConfig/NavigationConfigUpdate",
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
