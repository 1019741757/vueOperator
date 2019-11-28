<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>网吧业务设置</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <!-- 检索 -->
      <div>
        <el-row style="margin-bottom: 10px;">
          <el-button type="primary" size="medium" plain @click="addCreateLowerHair">添加</el-button>
        </el-row>
      </div>
      <!-- 表格 -->
      <el-table :data="GetLowerHairList" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{background:'rgb(220, 223, 230)',color:'#333'}">
        <el-table-column property="Id" label="ID" width="180"></el-table-column>
        <el-table-column property="Name" label="名称"></el-table-column>
        <el-table-column property="StartupTime" label="等待启动时间"></el-table-column>
        <el-table-column property="CreateTime" label="创建时间"></el-table-column>
        <el-table-column property="ExpireTime" label="到期时间"></el-table-column>
        <el-table-column prop="Type" label="类型" align='center' filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Type == '1' ? 'danger':scope.row.Type == '2' ? 'success':scope.row.Type == '3' ? 'primary':''" close-transition>
              {{scope.row.Type == "1" ? "直接运行":scope.row.Type == "2" ? "解压后运行":scope.row.Type == "3" ? "其它":''}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="Url" label="URL"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="EditCreateLowerHair(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click.stop="DeleteCreateLowerHair(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-card>
    </div>
    <!--添加-->
    <el-dialog title="添加" :visible.sync="addCreateLowerHairCodeName" width="700px" @close='addCreateLowerHairDialog'>
      <el-form :model="addCreateLowerHairList" :rules="rules" ref="addCreateLowerHairList" label-width="150px" class="demo-ruleForm">
        <el-form-item label="名称：" prop="Name">
          <el-input v-model="addCreateLowerHairList.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="到期时间：" prop="ExpireTime">
          <el-date-picker v-model="addCreateLowerHairList.ExpireTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="20">
            <div class="grid-content bg-purple">
              <el-form-item label="等待启动时间：" prop="StartupTime">
                <el-input v-model="addCreateLowerHairList.StartupTime" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple" style="line-height: 38px;">
              ( 分 )
            </div>
          </el-col>
        </el-row>
        <el-form-item label="请选择类型：" prop="Type">
          <el-select v-model="addCreateLowerHairList.Type" placeholder="请选择类型" clearable>
            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="程序运行路径：" prop="ExePath">
          <el-input v-model="addCreateLowerHairList.ExePath" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="URL地址：" prop="Url">
          <el-input v-model="addCreateLowerHairList.Url" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addCreateLowerHairCodeName = false">取 消</el-button>
        <el-button type="primary" size="small" @click.native="addCreateLowerHairSubmit('addCreateLowerHairList')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑-->
    <el-dialog title="编辑" :visible.sync="EditCreateLowerHairCodeName" width="700px" @close='EditCreateLowerHairDialog'>
      <el-form :model="EditCreateLowerHairList" :rules="rules" ref="EditCreateLowerHairList" label-width="150px" class="demo-ruleForm">
        <el-form-item label="名称：" prop="Name">
          <el-input v-model="EditCreateLowerHairList.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="到期时间：" prop="ExpireTime">
          <el-date-picker v-model="EditCreateLowerHairList.ExpireTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="20">
            <div class="grid-content bg-purple">
              <el-form-item label="等待启动时间：" prop="StartupTime">
                <el-input v-model="EditCreateLowerHairList.StartupTime" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple" style="line-height: 38px;">
              ( 分 )
            </div>
          </el-col>
        </el-row>
        <el-form-item label="请选择类型：" prop="Type">
          <el-select v-model="EditCreateLowerHairList.Type" placeholder="请选择类型" clearable>
            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="程序运行路径：" prop="ExePath">
          <el-input v-model="EditCreateLowerHairList.ExePath" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="URL地址：" prop="Url">
          <el-input v-model="EditCreateLowerHairList.Url" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="EditCreateLowerHairCodeName = false">取 消</el-button>
        <el-button type="primary" size="small" @click.native="EditCreateLowerHairSubmit('EditCreateLowerHairList')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'ValueAddedSettings',
  components: {
    tabbar
  },
  data: function() {
    return {
      //添加网吧主页业务
      addCreateLowerHairCodeName: false,
      addCreateLowerHairList: {},
      addDatevalue: {},
      //修改网吧信息
      EditCreateLowerHairCodeName: false,
      EditCreateLowerHairList: {
        Id: null,
        Name: null,
        Url: null,
        ExePath: null,
        StartupTime: null,
        Type: null,
        CreateTime: null,
        ExpireTime: null
      },
      GetLowerHairList: [],
      statusList: [{ //设备状态
        id: 1,
        name: '直接运行'
      }, {
        id: 2,
        name: ' 解压后运行'
      }, {
        id: 3,
        name: ' 其他'
      }],
      rules: {
        Name: [{
            required: true,
            message: '请输入程序名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        Url: [{
          required: true,
          message: '请输入程序下载连接',
          trigger: 'blur'
        }],
        ExePath: [{
          required: true,
          message: '请输入 程序运行路径',
          trigger: 'blur'
        }],
        StartupTime: [{
          required: true,
          message: '请输入程序等待运行时间',
          trigger: 'blur'
        }],
        Type: [{
          required: true,
          message: '请选择类型 ,',
          trigger: 'change'
        }],
        ExpireTime: [{
          required: true,
          message: '请选择到期时间 ,',
          trigger: 'change'
        }],
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
        url: "/api/Netbar/GetLowerHairList",
        type: 'get',
        loader: true,
        addfn: function(res) {
          that.GetLowerHairList = res.Object;
          that.total = res.Total;
        }
      })
    },
    //添加程序
    addCreateLowerHair: function() {
      this.addCreateLowerHairCodeName = true;
    },
    addCreateLowerHairDialog: function() {
      // this.$refs.addCreateLowerHairList.resetFields();
      this.addCreateLowerHairList = {};
    },
    addCreateLowerHairSubmit: function(addCreateLowerHairList) {
      this.$refs[addCreateLowerHairList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/Netbar/CreateLowerHair",
            type: 'post',
            data: this.addCreateLowerHairList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.addCreateLowerHairCodeName = false;
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
    //编辑程序
    EditCreateLowerHairDialog: function() {
      this.$refs.EditCreateLowerHairList.resetFields();
      this.EditCreateLowerHairList.ExpireTime = '';
    },
    EditCreateLowerHair: function(index, row) {
      this.EditCreateLowerHairCodeName = true;
      this.EditCreateLowerHairList.Id = row.Id;
      this.EditCreateLowerHairList.Name = row.Name || null;
      this.EditCreateLowerHairList.Url = row.Url;
      this.EditCreateLowerHairList.ExePath = row.ExePath;
      this.EditCreateLowerHairList.Type = row.Type;
      this.EditCreateLowerHairList.StartupTime = row.StartupTime;
      this.EditCreateLowerHairList.ExpireTime = row.ExpireTime;
      console.log(this.EditCreateLowerHairList);
    },
    EditCreateLowerHairSubmit: function(EditCreateLowerHairList) {
      this.$refs[EditCreateLowerHairList].validate((valid) => {
        if (valid) {
          var that = this;
          this.vq.sendMes({
            url: "/api/Netbar/UpdateLowerHair",
            type: 'post',
            data: this.EditCreateLowerHairList,
            loader: true,
            fn: function(res) {
              that.getData();
              that.EditCreateLowerHairCodeName = false;
              that.$message({
                message: '编辑成功',
                type: 'success'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    DeleteCreateLowerHair: function(index,row) {
      this.$confirm('确定删除吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        var that = this;
        let parameterList = {
          lowerHairId: row.Id,
        };
        this.vq.sendMes({
          url: "/api/Netbar/DeleteLowerHair",
          type: 'get',
          data: parameterList,
          loader: true,
          fn: function(res) {
            that.getData();
            that.$message({
              message: '删除成功',
              type: 'success'
            });

          }
        })
      }).catch(() => {});
    }
  }
}
</script>
