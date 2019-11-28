<template>
  <div class="wraper personinfo-wrap">
    <tabbar></tabbar>
    <div class="padding-pb fs-18 item-title">
      <span class="little-blue"></span>
      <span>释放桌标设置</span>
    </div>

    <div class="innerwrap">
      <div class="info-content">
        <div class="data-choose-top" style="overflow:hidden">

          <div class="lf handlerow">
            桌标属性：
            <select name="" id="" class="input-small" v-model='categroy'>
              <option value="">全部</option>
              <option value="自有业务">自有业务</option>
              <option value="合作商业务">合作商业务</option>
            </select>
          </div>
          <div class="lf handlerow">
            桌标类型：
            <select name="" id="" class="input-small" v-model="type">
              <option value="">全部</option>
              <option value="链接">链接</option>
              <option value="应用程序">应用程序</option>
            </select>
          </div>
          <div class="lf handlerow">
            桌标名称：
            <input type="text" class="input-small" placeholder="请输入名称" v-model='shortcutName'>
          </div>
          <span class="lr">&nbsp;</span>
          <button class="button-confirm margin-l30" @click="send">查询</button>
          <button class="button-confirm margin-l30" @click="reset">重置</button>
        </div>

        <div class="data-choose-top" style="overflow:hidden">
          <span class="lr">&nbsp;</span>
          <div class="lr"><button class="button-confirm" @click="deletearr">删除</button></div>
          <span class="lr">&nbsp;</span>
          <div class="lr"><button class="button-confirm" @click="showpop">新增</button></div>
        </div>
        <!-- 表格 -->
        <table>
          <tr class="table-header">
            <td>编号</td>
            <td>添加时间</td>
            <td>过期时间</td>
            <td>桌标类型</td>
            <td>桌标属性</td>
            <td>桌标名称</td>
            <td>桌标释放几率</td>
            <td>链接地址</td>
            <td>图片</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item,index) in GetListByPage.Items">
            <td><input type="checkbox" ref="bychecked" name="check" :key="item.Id" class="small-checkbox" @click="chooseTr(item)">{{item.ShortcutId}}</td>
            <td>{{item.CreateTime.split(' ')[0]}}</td>
            <td>{{item.ExpireTime.split(' ')[0]}}</td>
            <td>{{item.Type}}</td>
            <td>{{item.Categroy}}</td>
            <td>{{item.ShortcutName}}</td>
            <td>{{item.Odds}}</td>
            <td>{{item.Url}}</td>
            <td class="table-link" @click="showimg(item)">查看</td>
            <td><button class="button-confirm" @click="reverse(item)">修改</button></td>
          </tr>
        </table>
        <h3 v-if="haveNone" class="haveNoneS">查询无更多数据</h3>
        <!-- 分页 -->
        <pages :allPage="GetListByPage.Total" @pagesChange="getBill"></pages>
      </div>
    </div>
    <floatboard v-if="popshow" @hiddenWindow="hiddenWindow" :confirmWay="addTable">
      <div>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>新增桌标</span>
        </div>
        <div class="ad-content overflow float-content">
          <div class="lf handlerow">
            <span>桌标类型</span>
            <select v-model='tableNew.Categroy'>
              <option value="自有业务">自有业务</option>
              <option value="合作商业务">合作商业务</option>
            </select>
          </div>
          <div class="lf handlerow">
            <span>桌标过期时间</span>
            <input type="" name="" placeholder="选择过期时间" v-model='tableNew.ExpireTime' @click="showrili(0)" />
            <Calendar v-on:choseDay="clickDay" v-if="beginshow"></Calendar>
          </div>
          <div class="lf handlerow">
            <span>桌标名称</span>
            <input type="" name="" placeholder="请输入名称" v-model="tableNew.ShortcutName" />
          </div>
          <div class="lf handlerow">
            <span>桌标释放几率</span>
            <input type="" name="" placeholder="释放几率必须在1-100" v-model="tableNew.Odds" />
            %
          </div>
          <div class="lf handlerow">
            <span>桌标属性</span>
            <select v-model="tableNew.Type">
              <option value="链接">链接</option>
              <option value="应用程序">应用程序</option>
              <option value="链接+应用程序">链接+应用程序</option>
            </select>
            <input type="" name="" placeholder="请输入链接" v-model="tableNew.Url" />
          </div>
          <div class="lf handlerow ad-imgadder">
            <span>广告图片</span>
            <input type="file" name="" @change="handleImg(0)" ref="imgel" v-show="false" />
            <img :src="imgrc" class="file-img" alt="选择图片" @click="clikfile(0)">
            <span class="color-waring" @click="closeimg">X</span>
          </div>

        </div>
      </div>
    </floatboard>
    <floatboard v-if="popshowre" @hiddenWindow="hiddenWindow" :confirmWay="reTable">
      <div>
        <div class="padding-pb fs-18 item-title">
          <span class="little-blue"></span>
          <span>修改桌标</span>
        </div>
        <div class="ad-content overflow float-content">
          <div class="lf handlerow">
            <span>桌标属性</span>
            <select v-model='nowItem.Categroy'>
              <option value="自有业务">自有业务</option>
              <option value="合作商业务">合作商业务</option>
            </select>
          </div>
          <div class="lf handlerow">
            <span>桌标过期时间</span>
            <input type="" name="" placeholder="请输入客户端名称" v-model='nowItem.ExpireTime.split(" ")[0]' @click="showrili(0)" />
            <Calendar v-on:choseDay="clickDayre" v-if="beginshow"></Calendar>
          </div>
          <div class="lf handlerow">
            <span>桌标名称</span>
            <input type="" name="" placeholder="请输入名称" v-model="nowItem.ShortcutName" />
          </div>
          <div class="lf handlerow">
            <span>桌标释放几率</span>
            <input type="" name="" placeholder="请输入客户端名称" v-model="nowItem.Odds" />
            %
          </div>
          <div class="lf handlerow">
            <span>桌标类型</span>
            <select v-model="nowItem.Type">
              <option value="链接">链接</option>
              <option value="应用程序">应用程序</option>
              <option value="链接+应用程序">链接+应用程序</option>
            </select>
            <input type="" name="" placeholder="请输入链接" v-model="nowItem.Url" />
          </div>
          <div class="lf handlerow ad-imgadder">
            <span>广告图片</span>
            <input type="file" name="" @change="handleImg(1)" ref="imgelre" v-show="false" />
            <img :src="imgrcre" class="file-img" alt="选择图片" @click="clikfile(1)">
            <span class="color-waring" @click="closeimg">X</span>
          </div>

        </div>
      </div>
    </floatboard>
    <floatboard v-if="imgpopshow" @hiddenWindow="hiddenWindow">
      <div>
        <img :src="nowimg">
      </div>
    </floatboard>
  </div>
</template>

<script>
  import tabbar from "../tabbar.vue";
  import axios from "axios";
  import Calendar from 'vue-calendar-component';
  import pages from '../pages.vue'
  import floatboard from "../floatboard"
  export default {
    name: 'barbill',
    components: {
      tabbar,
      Calendar,
      pages,
      floatboard
    },
    data: function () {
      return {
        beginTime: "",
        endTime: "",
        popshowre: false,
        imgpopshow: false,
        haveNone: false,
        nowimg: "",
        beginshow: false,
        endshow: false,
        popshow: false,
        GetListByPage: {},
        bycheckedList:[],
        type: "",
        chooseTrDate: [],
        categroy: "",
        pageSize: 8,
        shortcutName: "",
        nowItem: {},
        imgrc: "../../../static/addimg.png",
        imgrcre: "../../../static/addimg.png",
        tableNew: {
          Categroy: "",
          ShortcutId: 0,
          ShortcutName: "",
          IconUrl: "../../../static/addimg.png",
          ExpireTime: "",
          Odds: "",
          Type: "",
          Url: ""
        }
      }
    },
    mounted: function () {
      this.getBill();
      // 删除数组不知索引的某一项，要可以用remove方法，因为数组的原型上还没有这个方法，所以可以给数组的prototype属性上挂载这个方法
      Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == val) return i;
        }
        return -1;
      };

      Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
    },
    methods: {
      // chooseTr:function(item){
      //    if(!item.isRadio){
      //      this.chooseTrDate.push(item.ShortcutId);
      //    }else{
      //      for(var i=0;i<this.chooseTrDate.length;i++){
      //         if(this.chooseTrDate[i]==item.ShortcutId){
      //            this.chooseTrDate.splice(i,1);
      //         }
      //      }
      //    }
      // }, 
      chooseTr:function(item) {
        var bycheckedList = this.$refs.bychecked;
        for (let i = 0; i < bycheckedList.length; i++) {
          if (bycheckedList[i].checked) {
            if (this.chooseTrDate.indexOf(bycheckedList[i].nextSibling.data) === -1) {
              this.chooseTrDate.push(bycheckedList[i].nextSibling.data);
            }
          } else {
            if (this.chooseTrDate.indexOf(bycheckedList[i].nextSibling.data) != -1) {
              this.chooseTrDate.remove(bycheckedList[i].nextSibling.data)
            }
          }
        }
      },

      getBill: function () {
        var that = this;
        // for (let i = 0; i < this.bycheckedList.length; i++) {
        //     bycheckedList[i].checked = false;
        // }
        this.pageIndex = this.$route.query.pages || 1;
        var _target = this.vq.v(this).getData("pager");
        var adder = {
          type: this.type,
          categroy: this.categroy,
          shortcutName: this.shortcutName
        };
        var _addata = {};
        for (var item in adder) {
          if (!adder[item]) {} else {
            _addata[item] = adder[item];
          }
        }
        var fina = this.vq.objectAdd(_target, _addata);
        this.pageIndex = this.$route.query.pages || 1;
        this.vq.v(this).bindTo({
          url: "/api/Shortcut/GetListByPage",
          data: fina,
          addfn: function (res) {
            var _object = res;
            _object.Items = that.vq.insertTo(_object.Items, "isRadio", false);
            that.GetList = _object;
            that.haveNone = false;
            if (res.Items.length < 1) {
              that.haveNone = true;
            }
          },
        });
      },
      showimg: function (item) {
        this.imgpopshow = true;
        this.nowimg = item.IconUrl;
      },
      addTable: function () {
        var that = this;
        var data = this.tableNew;
        data.IconUrl = this.imgrc;
        this.vq.v(this).sendMes({
          url: "/api/Shortcut/Add",
          type: "post",
          data: data,
          fn: function (res) {
            that.unit.MessHandle.call(that, res);
            that.tableNew = {
              Categroy: "",
              ShortcutId: 0,
              ShortcutName: "",
              IconUrl: "../../../static/addimg.png",
              ExpireTime: "",
              Odds: "",
              Type: "",
              Url: ""
            };
            that.imgrc = "../../../static/addimg.png";
            that.getBill();
          }
        })
      },
      reTable: function () {
        var that = this;
        var data = that.nowItem;
        data.IconUrl = this.imgrcre;
        this.vq.v(this).sendMes({
          url: "/api/Shortcut/Modefy",
          type: "post",
          data: data,
          fn: function (res) {
            that.imgrcre = "../../../static/addimg.png";
            that.getBill();
            that.unit.MessHandle.call(that, res);
          }
        })
      },
      deletearr: function (item) {
        var that = this;
        for (var i = 0; i < this.chooseTrDate.length; i++) {
          this.vq.v(this).sendMes({
            url: "/api/Shortcut/Delete/" + that.chooseTrDate[i],
            type: "post",
            data: {
              id: that.chooseTrDate[i]
            },
            fn: function (res) {
              that.chooseTrDate = [];
              that.unit.MessHandle.call(that, res, '删除成功');
              that.getBill();
            }
          })
        }
        for (let j = 0; j < this.length; j++) {
        }
      },
      reverse: function (item) {
        this.nowItem = item;
        this.imgrcre = this.nowItem.IconUrl;
        this.popshowre = true;
      },
      showpop: function () {
        this.popshow = true;
      },
      hiddenWindow: function () {
        this.popshow = false;
        this.imgpopshow = false;
        this.popshowre = false;
      },
      showrili: function (type) {
        this.unit.rilishow.call(this, type);
      },
      clikfile: function (type) {
        if (type == 0) {
          this.$refs.imgel.click();
        } else {
          this.$refs.imgelre.click();
        }

      },
      handleImg: function (type) {
        var that = this;
        var fr = new FileReader();
        var fm = new FormData();
        if (type == 0) {
          fm.append('myfile', that.$refs.imgel.files[0]);
          fr.readAsDataURL(that.$refs.imgel.files[0]);
          fr.onload = function () {
            that.imgrc = fr.result;
            that.vq.v(that).sendMes({
              url: "http://d.580tequan.com/api/UploadFile/UploadFile/",
              data: fm,
              type: "post",
              fn: function (res) {
                that.imgrc = res;
              },
              err: function (res) {
                alert('图片添加失败');
              }
            })
          };
        } else {
          fm.append('myfile', that.$refs.imgelre.files[0]);
          fr.readAsDataURL(that.$refs.imgelre.files[0]);
          fr.onload = function () {
            that.imgrcre = fr.result;
            that.vq.v(that).sendMes({
              url: "http://d.580tequan.com/api/UploadFile/UploadFile/",
              data: fm,
              type: "post",
              fn: function (res) {
                that.imgrcre = res;
              },
              err: function (res) {
                alert('图片添加失败');
              }
            })
          };
        }
      },
      reset: function () {
        this.type = "";
        this.categroy = '';
        this.shortcutName = '';
        this.haveNone = false;
        this.getBill();
      },
      closeimg: function () {
        this.imgrc = "../../../static/addimg.png";
      },
      clickDay: function (day) {
        var _day = this.unit.timeEncode(new Date(day)).split("T")[0];
        this.tableNew.ExpireTime = _day;
        this.beginshow = false;
      },
      clickDayre: function (day) {
        var _day = this.unit.timeEncode(new Date(day)).split("T")[0];
        this.nowItem.ExpireTime = _day + " 00:00:00";
        this.beginshow = false;
      },
      send: function () {
        this.getBill();
      }
    }
  }

</script>
<style scoped>
  table tr td {
    font-size: 14px;
  }

  .data-choose-top {
    padding-bottom: 25px;
  }

  h2 {
    text-align: left;
    border-left: 5px solid green;
    padding-left: 10px;
  }

  .haveNoneS {
    margin-top: 50px;
    text-align: center;
    color: gray;
  }

</style>
