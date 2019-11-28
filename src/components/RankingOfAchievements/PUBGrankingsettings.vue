<template>
<div class="wraper personinfo-wrap">
  <tabbar></tabbar>
  <div class="padding-pb fs-18 item-title">
    <span class="little-blue"></span>
    <span>奖励设置</span>
  </div>
  <div class="innerwrap">
    <div class="info-content">
      <el-tabs type="border-card">
        <el-tab-pane label="绝地求生排名设置">
          <div class="PUBGrankingsettings_boy clearfix">
            <div class="PUBGrankingsettings_s">奖励设置：</div>
            <el-form :rules="rules" ref="ruleForm" label-width="170px" class="demo-ruleForm PUBGrankingsettings_t">
              <div>
                <el-form-item label="第一名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="PUBGrankingsettingsList.First"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>第一名的奖励必须设置，后续奖品可不填或删除</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第二名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="PUBGrankingsettingsList.Second"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第三名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="PUBGrankingsettingsList.Third"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第四名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="PUBGrankingsettingsList.Fourth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第五名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="PUBGrankingsettingsList.Fifth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第六名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="PUBGrankingsettingsList.Sixth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第七名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="PUBGrankingsettingsList.Seventh"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第八名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="PUBGrankingsettingsList.Eighth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第九名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="PUBGrankingsettingsList.Ninth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第十名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="PUBGrankingsettingsList.Tenth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第十一至一百名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="PUBGrankingsettingsList.Other"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>
              <!-- <div style="padding-left:44px;">
                <el-button type="success" size="medium" icon="el-icon-plus" plain :disabled="addItemButtom" @click="addItem">添加奖品阶梯</el-button>
              </div> -->
            </el-form>
          </div>
          <div class="PUBGrankingsettings_boy clearfix" style="border-top: 1px solid #b7c4d7;">
            <div class="PUBGrankingsettings_s">积分设置：</div>
            <el-form :model="PUBGGameDataList" :rules="rules" label-width="170px" class="demo-ruleForm PUBGrankingsettings_t">
              <el-row :gutter="22">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                  <el-form-item label="场次获得积分：" prop="Site">
                    <el-input v-model="PUBGGameDataList.Site" auto-complete="off" placeholder="请输入积分数"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                  <el-form-item label="吃鸡获得积分：" prop="TheFirst">
                    <el-input v-model="PUBGGameDataList.TheFirst" auto-complete="off" placeholder="请输入积分数"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                  <el-form-item label="前十获得积分：" prop="TopTen">
                    <el-input v-model="PUBGGameDataList.TopTen" auto-complete="off" placeholder="请输入积分数"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                  <el-form-item label="击杀获得积分：" prop="Kill">
                    <el-input v-model="PUBGGameDataList.Kill" auto-complete="off" placeholder="请输入积分数"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            </el-form>
          </div>
          <div class="">
            <el-button type="success" size="medium" @click="RankingsettingsSubmit">保存</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="英雄联盟排名设置">
          <div class="PUBGrankingsettings_boy clearfix">
            <div class="PUBGrankingsettings_s">奖励设置：</div>
            <el-form :rules="rules" ref="ruleForm" label-width="170px" class="demo-ruleForm PUBGrankingsettings_t">
              <div>
                <el-form-item label="第一名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="LOLrankingsettingsList.First"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>第一名的奖励必须设置，后续奖品可不填或删除</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第二名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="LOLrankingsettingsList.Second"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第三名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="LOLrankingsettingsList.Third"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第四名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="LOLrankingsettingsList.Fourth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第五名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="LOLrankingsettingsList.Fifth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第六名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="LOLrankingsettingsList.Sixth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第七名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="LOLrankingsettingsList.Seventh"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第八名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="LOLrankingsettingsList.Eighth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第九名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="LOLrankingsettingsList.Ninth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第十名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="LOLrankingsettingsList.Tenth"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="第十一至一百名奖励灵石">
                  <el-row :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
                      <el-input v-model="LOLrankingsettingsList.Other"></el-input>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                      <span>如未填写奖品名称或价值，则默认无该奖品阶梯</span>
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>
              <!-- <div style="padding-left:44px;">
                <el-button type="success" size="medium" icon="el-icon-plus" plain :disabled="addItemButtom" @click="addItem">添加奖品阶梯</el-button>
              </div> -->
            </el-form>
          </div>
          <div class="PUBGrankingsettings_boy clearfix" style="border-top: 1px solid #b7c4d7;">
            <div class="PUBGrankingsettings_s">积分设置：</div>
            <el-form :model="PUBGGameDataList" :rules="rules" label-width="170px" class="demo-ruleForm PUBGrankingsettings_t">
              <el-row :gutter="22">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                  <el-form-item label="场次获得积分：" prop="Site">
                    <el-input v-model="LOLGameDataList.Site" auto-complete="off" placeholder="请输入积分数"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                  <el-form-item label="三杀获得积分：" prop="TheFirst">
                    <el-input v-model="LOLGameDataList.TripleKill" auto-complete="off" placeholder="请输入积分数"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                  <el-form-item label="四杀获得积分：" prop="TopTen">
                    <el-input v-model="LOLGameDataList.QuadraKill" auto-complete="off" placeholder="请输入积分数"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                  <el-form-item label="五杀获得积分：" prop="TopTen">
                    <el-input v-model="LOLGameDataList.PentaKill" auto-complete="off" placeholder="请输入积分数"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                  <el-form-item label="超神获得积分：" prop="Kill">
                    <el-input v-model="LOLGameDataList.Legendary" auto-complete="off" placeholder="请输入积分数"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                  <el-form-item label="击杀获得积分：" prop="Kill">
                    <el-input v-model="LOLGameDataList.Kill" auto-complete="off" placeholder="请输入积分数"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            </el-form>
          </div>
          <div class="">
            <el-button type="success" size="medium" @click="SetLOLRankingSubmit">保存</el-button>
          </div>

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</div>
</template>

<script>
import tabbar from "../tabbar.vue";
import axios from "axios";
export default {
  name: 'PUBGrankingsettings',
  components: {
    tabbar
  },
  data: function() {
    return {
      PUBGrankingsettingsList: {},
      PUBGGameDataList: {},
      LOLrankingsettingsList: {},
      LOLGameDataList: {},
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
        Content: [{
            required: true,
            message: '请输入消息内容',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ],
      }
    }
  },
  created() {
    this.getPUGBdata();
    this.getLOLdata();
  },
  methods: {
    //获取PUGB初始数据
    getPUGBdata: function() {
      var _this = this;
      this.vq.v(this).sendAll({
        reqList: [{
            url: "/api/Configure/GetPUBGRanking",
            data: {},
            fn: function(res) {
              _this.PUBGrankingsettingsList = res.Object;
            },
            loader: true,
          },
          {
            url: "/api/Configure/GetPUBGGameData",
            data: {},
            fn: function(res, reslast) {
              _this.PUBGGameDataList = res.Object;
            },
            loader: true,
          },
        ],
        isAsycn: true
      });
    },
    //保存
    RankingsettingsSubmit: function() {
      var _this = this;
      this.vq.v(this).bindTo({
        url: "/api/Configure/SetPUBGRanking",
        data: this.PUBGrankingsettingsList,
        type: "post",
        isAsycn: true,
        addfn: function(res) {
          console.log(res);
        }
      });
      this.vq.v(this).bindTo({
        url: "/api/Configure/SetPUBGGameData",
        data: this.PUBGGameDataList,
        type: "post",
        isAsycn: true,
        addfn: function(res) {
          _this.$message({
            message: '保存成功',
            type: 'success'
          });
          _this.getPUGBdata();
        }
      });
    },
    //获取LOL初始数据
    getLOLdata: function() {
      var _this = this;
      this.vq.v(this).sendAll({
        reqList: [{
            url: "/api/Configure/GetLOLRanking",
            data: {},
            fn: function(res) {
              _this.LOLrankingsettingsList = res.Object;
            },
            loader: true,
          },
          {
            url: "/api/Configure/GetLOLGameData",
            data: {},
            fn: function(res, reslast) {
              _this.LOLGameDataList = res.Object;
            },
            loader: true,
          },
        ],
        isAsycn: true
      });
    },
    //保存
    SetLOLRankingSubmit: function() {
      var _this = this;
      this.vq.v(this).bindTo({
        url: "/api/Configure/SetLOLRanking",
        data: this.LOLrankingsettingsList,
        type: "post",
        isAsycn: true,
        addfn: function(res) {
          console.log(res);
        }
      });
      this.vq.v(this).bindTo({
        url: "/api/Configure/SetLOLGameData",
        data: this.LOLGameDataList,
        type: "post",
        isAsycn: true,
        addfn: function(res) {
          _this.$message({
            message: '保存成功',
            type: 'success'
          });
          _this.getLOLdata();
        }
      });
    },
  }
}
</script>
