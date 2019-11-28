<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>客户端版本管理</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <el-form :inline="true" class="demo-form-inline" style="padding: 0 5px">
        <el-row style="margin-bottom: 10px;">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="medium" plain @click="AddedVersionNamebox">新增</el-button>
        </el-row>
      </el-form>
      <!-- 表格 -->
      <el-table :data="GetClientVersionList.Items" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="VersionNumber" label="大版本号" width="180"></el-table-column>
        <!-- <el-table-column property="VersionInfos" label="版本信息"></el-table-column> -->
        <el-table-column prop="State" label="版本信息" align='center' width='120' filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click.stop="VersionInformationbox(scope.$index, scope.row)">版本信息</el-button>
          </template>
        </el-table-column>
        <el-table-column property="CreateTime" label="更新时间"></el-table-column>
        <el-table-column prop="State" label="版本状态" align='center' width='120' filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.State == '1' ? 'success':scope.row.State == '2' ? 'danger':''" close-transition>
              {{scope.row.State == "1" ? "预发版":scope.row.State == "2" ? "正式版":''}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="EditorialVersionbox(scope.$index, scope.row)" v-if="scope.row.State != 2">编辑</el-button>
            <el-button type="success" size="small" @click.stop="OfficialRelease(scope.$index, scope.row)" v-if="scope.row.State != 2">发布正式版</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination @current-change="handleCurrentChange" @size-change="sizeCurrentChange" :page-sizes="[10, 15, 20]" :page-size="10" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-row>
      </el-card>
    </div>
    <!--版本信息-->
    <el-dialog title="版本信息" :visible.sync="VersionInformationName">
      <div class="">
        <p v-for="(item,index) in VersionInfosList"  :key="index"> {{item}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="VersionInformationName = false"> 关 闭 </el-button>
      </div>
    </el-dialog>
    <!--添加版本-->
    <el-dialog title="添加版本" :visible.sync="AddedVersionName" width="800px" @close='AddedVersionDialog'>
      <el-form :model="AddedVersionList" :rules="rules" ref="AddedVersionList" label-width="140px" class="demo-ruleForm">
        <el-form-item label="当前最新版本号：" prop="VersionNumber">{{VersionNumber}}</el-form-item>
        <el-form-item label="大版本号：" prop="VersionNumber">
          <el-input v-model="AddedVersionList.VersionNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本信息：" prop="VersionInfos">
          <el-input type="textarea" v-model="AddedVersionList.VersionInfos" :autosize="{ minRows: 12, maxRows: 12}" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="AddedVersionName = false">取 消</el-button>
        <el-button type="primary" size="small" @click.native="AddedVersionSubmit('AddedVersionList')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑版本-->
    <el-dialog title="编辑版本" :visible.sync="EditorialVersionName" width="800px" @close='EditorialVersionDialog'>
      <el-form :model="EditorialVersionList" :rules="rules" ref="EditorialVersionList" label-width="140px" class="demo-ruleForm">
        <el-form-item label="当前最新版本号：" prop="VersionNumber">{{VersionNumber}}</el-form-item>
        <el-form-item label="大版本号：" prop="VersionNumber">
          <el-input v-model="EditorialVersionList.VersionNumber" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="版本信息：" prop="VersionInfos">
          <el-input type="textarea" v-model="EditorialVersionList.VersionInfos" :autosize="{ minRows: 12, maxRows: 12}" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="EditorialVersionName = false">取 消</el-button>
        <el-button type="primary" size="small" @click.native="EditorialVersionSubmit('EditorialVersionList')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'VersionManagement',
  components: {
    tabbar
  },
  data: function() {
    return {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      GetClientVersionList: [],
      //添加版本
      AddedVersionName: false,
      AddedVersionList: {},
      //修改版本
      EditorialVersionName: false,
      EditorialVersionList: {
        VersionNumber: '',
        VersionInfos: ''
      },
      VersionNumber: '', //当前最新版本号
      VersionInformationName: false,
      VersionInfosList: '',
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
    onSubmit: function() {
      this.pageNo = 1;
      this.getData();
    },
    //tabel数据获取
    getData: function() {
      var that = this;
      var getArr = {
        pageSize: this.pageSize,
        pageIndex: this.pageNo
      };
      var _data = this.unit.getFinal.call(this, getArr, true);
      this.vq.bindTo({
        url: "/api/ClientVersion/GetClientVersionList",
        type: 'get',
        data: _data,
        loader: true,
        addfn: function(res) {
          that.total = res.Total;
        }
      })
    },
    //版本信息
    VersionInformationbox: function(index, row) {
      this.VersionInformationName = true;
      this.VersionInfosList = JSON.parse(row.VersionInfos);
    },
    //获取当前最新版本号
    GetNewestClientVersionFun: function() {
      var that = this;
      this.vq.bindTo({
        url: "/api/ClientVersion/GetNewestClientVersion",
        type: 'get',
        data: {},
        loader: true,
        addfn: function(res) {
          that.VersionNumber = res.Object.VersionNumber;
          console.log(res.Object.VersionNumber);
        }
      })
    },
    //添加版本
    AddedVersionNamebox: function() {
      this.AddedVersionName = true;
      this.GetNewestClientVersionFun();
    },
    AddedVersionDialog: function() {
      this.$refs.AddedVersionList.resetFields();
    },
    AddedVersionSubmit: function(AddedVersionList) {
      // var VersionInfosJson = JSON.parse(this.AddedVersionList.VersionInfos);
      this.$refs[AddedVersionList].validate((valid) => {
        if (valid) {
          var getArr = {
            VersionNumber: this.AddedVersionList.VersionNumber,
            VersionInfos: this.AddedVersionList.VersionInfos,
            State: '',
            Remark: '',
            XmlUrl: ''
          };
          var _data = this.unit.getFinal.call(this, getArr, true);
          var that = this;
          this.vq.sendMes({
            url: "/api/ClientVersion/CreateVersion",
            type: 'post',
            data: _data,
            loader: true,
            fn: function(res) {
              that.getData();
              that.AddedVersionName = false;
              that.$refs.AddedVersionList.resetFields();
              that.$message({
                message: '新增成功',
                type: 'success'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    //编辑版本
    EditorialVersionbox: function(index, row) {
      this.EditorialVersionList.VersionNumber = row.VersionNumber;
      this.EditorialVersionList.VersionInfos = row.VersionInfos;
      this.GetNewestClientVersionFun();
      this.EditorialVersionName = true;
    },
    EditorialVersionDialog: function() {
      this.EditorialVersionList.VersionNumber = '';
      this.EditorialVersionList.VersionInfos = '';
      this.$refs.EditorialVersionList.resetFields();
    },
    EditorialVersionSubmit: function(EditorialVersionList) {
      this.$refs[EditorialVersionList].validate((valid) => {
        if (valid) {
          var getArr = {
            VersionNumber: this.EditorialVersionList.VersionNumber,
            VersionInfos: this.EditorialVersionList.VersionInfos,
            State: '',
            Remark: '',
            XmlUrl: ''
          };
          var _data = this.unit.getFinal.call(this, getArr, true);
          var that = this;
          this.vq.sendMes({
            url: "/api/ClientVersion/CreateVersion",
            type: 'post',
            data: _data,
            loader: true,
            fn: function(res) {
              that.getData();
              that.EditorialVersionName = false;
              that.$refs.EditorialVersionList.resetFields();
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
    //发布版本
    OfficialRelease: function(index, row) {
      this.$confirm('确定发布该版本吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var getArr = {
          VersionNumber: row.VersionNumber,
          VersionInfos: row.VersionInfos,
          State: 2,
          Remark: '',
          XmlUrl: ''
        };
        var _data = this.unit.getFinal.call(this, getArr, true);
        var that = this;
        this.vq.sendMes({
          url: "/api/ClientVersion/CreateVersion",
          type: 'post',
          data: _data,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: '发布成功',
              type: 'success'
            });
          }
        })
      }).catch(() => {});
    }
  }
}
</script>
