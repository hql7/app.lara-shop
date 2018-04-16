<template>
  <div id="userCenter">
    <!--上部信息-->
    <div class="g-Mtop">
      <p><i class="iconfont icon-shezhi2" @click="member(2)"></i><i class="iconfont icon-iconfontmark"
                                                                    @click="to_message"></i></p>

      <div v-if="login" class="u-user" @click="member(2)">
        <span><img :src="user.head_pic" alt="用户头像"></span>
        <p>{{user.name}}</p>
      </div>
      <div v-else class="u-user" @click="to_login">
        <b>未登录</b>
        <p>请登录查看您的信息</p>
      </div>
    </div>
    <!--我的钱包-->
    <div class="g-myPurse">
      <div class="m-myPurse">
        <router-link :to="login ? '/my-point' : '/login'">
          <div>
            <p>{{userOr.point || 0}}</p>
            <p>积分</p>
          </div>
        </router-link>
        <router-link :to="login ? '/my-coupons' : '/login'">
          <div>
            <p>{{userOr.voucher_num || 0}}</p>
            <p>优惠券</p>
          </div>
        </router-link>
        <router-link :to="login ? '/my-balance' : '/login'">
          <div>
            <p>{{userOr.balance || 0}}</p>
            <p>余额</p>
          </div>
        </router-link>
      </div>
    </div>
    <!--订单模块-->
    <div class="m-dingDan">
      <h3>我的订单 <a href="javascript:void (0)" @click="seeAll">查看全部订单<i
        class="iconfont icon-icon"></i></a></h3>
      <div class="m-zhuangTai">
        <router-link to="/my-order?s=1">
          <div class="m-huo">
            <i class="iconfont icon-daifukuan-copy"></i>
            <p>待付款</p>
            <span v-if="userOr.unpaid_num>0">{{userOr.unpaid_num}}</span>
          </div>
        </router-link>
        <router-link to="/my-order?s=2">
          <div class="m-huo">
            <i class="iconfont icon-daifahuo1"></i>
            <p>待发货</p>
            <span v-if="userOr.wait_send>0">{{userOr.wait_send}}</span>
          </div>
        </router-link>
        <router-link to="/my-order?s=3">
          <div class="m-huo">
            <i class="iconfont icon-iconfonttaobaozhongchoudisiqiqiche big-i"></i>
            <p>待收货</p>
            <span v-if="userOr.delivery_num>0">{{userOr.delivery_num}}</span>
          </div>
        </router-link>
        <router-link to="/evaluate-order">
          <div class="m-huo">
            <i class="iconfont icon-pingjia"></i>
            <p>待评价</p>
            <span v-if="userOr.review_num>0">{{userOr.review_num}}</span>
          </div>
        </router-link>
        <router-link to="/after-sale-order">
          <div class="m-huo">
            <i class="iconfont icon-shouhou3"></i>
            <p>售后</p>
            <span v-if="userOr.after_num>0">{{userOr.after_num}}</span>
          </div>
        </router-link>
      </div>
    </div>
    <!--功能模塊-->
    <div class="g-gongNeng">
      <ul>
        <li v-for="(item, index) in menus" @click="url(item,index)">
          <a href="javascript:void(0);"><i class="iconfont" :class="item.gnclas"></i>{{item.gnname}}
            <i class="iconfont icon-icon u-you"></i></a></li>
      </ul>
    </div>
    <!--弹出层-->
    <!--会员等级-->
    <div class="g-member" v-if="seeUser">
      <div class="m-member-top">
        <i class="iconfont icon-zuo u-zuoBack" @click="close"></i><span>个人信息</span>
      </div>
      <div class="m-photo">
        <div>头像</div>
        <div class="u-file"><span><img :src="user.head_pic" alt="头像" @click="changInfo"></span>
          <!--<input type=" file" @change="upload" ref="upfile">-->
        </div>
      </div>
      <div class="m-member m-popupBox">
        <div>会员等级</div>
        <div>V {{user.vip}}</div>
      </div>
      <div class="m-changePassWord m-popupBox">
        <div>登录密码</div>
        <router-link to="/bind-pass?ct=0" tag="div" class="c-blue">修改</router-link>
      </div>
      <div class="m-changePassWord m-popupBox">
        <div>支付密码</div>
        <router-link to="/bind-pass?ct=1" tag="div" class="c-blue">修改</router-link>
      </div>
      <div class="m-changePassWord m-popupBox">
        <div>绑定邮箱&nbsp;&nbsp;<span v-if="user.email">{{user.email}}</span></div>
        <router-link to="/bind-email" tag="div" class="c-blue">修改</router-link>
      </div>
      <div class="m-phoneNum m-popupBox">
        <div>绑定手机号&nbsp;&nbsp;<span v-if="user.mobile">{{user.mobile}}</span></div>
        <router-link to="/bind-phone" tag="div" class="c-blue">修改</router-link>
      </div>
      <div class="m-phoneNum m-popupBox">
        <div>绑定QQ&nbsp;&nbsp;</div>
        <router-link to="/404" tag="div" class="c-blue">修改</router-link>
      </div>
      <div class="m-phoneNum m-popupBox">
        <div>绑定微信&nbsp;&nbsp;</div>
        <router-link to="/404" tag="div" class="c-blue">修改</router-link>
      </div>
      <div class="sign_out" @click="sign_out">退出登录</div>
    </div>
    <!--修改个人信息-->
    <div class="mark" v-if="chang_info"></div>
    <div class="changeInfo" v-if="chang_info">
      <h3>个人信息 <i class="iconfont icon-guanbi u-right" @click="chang_info = false"></i></h3>
      <ul>
        <li><label>头像</label>
          <el-upload
            class="avatar-uploader"
            :action="getApi('coms/upload-img')"
            :show-file-list="false"
            :data="{type:6}"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrlBase" :src="imageUrlBase" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!--   <strong><img :src="user.head_pic" alt="头像" class="hed-img" id="myImage"><b class="info-up"
                                                                                        @click="cameraGetPicture">拍照</b><b
               class="info-up" @click="cameraGetPicture('photo')">相册</b></strong>-->
        </li>
        <li><label>昵称</label><input type="text" class="info-ipt" placeholder="请输入昵称" v-model="info.nickname">
        </li>
        <li><label>性别</label><select class="info-set" v-model="info.sex">
          <option value="2">请选择性别</option>
          <option value="0">男</option>
          <option value="1">女</option>
        </select></li>
        <li><label>生日</label><input type="text" class="info-ipt" placeholder="例：2001-10-10"
                                    v-model="info.birthday">
        </li>
      </ul>
      <button class="info-btn" @click="saveInfo">保存</button>
    </div>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script type="text/ecmascript-6">

  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        login: false, //是否登录
        user: {}, // 用户信息
        userOr: {}, // 用户信息订单相关部分
        info: {
          nickname: '',
          sex: '',
          birthday: ''
        }, // 个人信息
        seeUser: false,
        menus: [
          {'gnclas': 'icon-shoucang', 'gnname': '我的收藏', url: '/my-collection'},
          {'gnclas': 'icon-zuji', 'gnname': '我的足迹', url: '/my-footprint'},
//          {'gnclas': 'icon-zhangdan1', 'gnname': '我的账单', url: 'log.html'},
//          {"gnclas": "icon-dengji", "gnname": "会员等级", url: "javascript:void(0);"},
          //          {'gnclas': 'icon-feiji', 'gnname': '我的推广', url: 'myextend.html'},
          {'gnclas': 'icon-dizhi', 'gnname': '配送地址', url: '/address'},
          {'gnclas': 'icon-youxiang', 'gnname': '邮箱绑定', url: '/bind-email'},
          {'gnclas': 'icon-jiaoyi', 'gnname': '帮助中心', url: '/article?t=1'}
        ],
        chang_info: false,
        isLoading: true,
        imageUrl: '',
        imageUrlBase: ''
      }
    },
    created() {
      // 验证登录状态
      this.vaLogin();
      // 定位当前tab
      this.$store.commit('setIndexRouter', 3);
    },

    mounted() {

    },
    methods: {
      cameraGetPicture(type) {
        let _this = this;
        //默认配置拍照
        let option = {
          //质量
          quality: 100,
          //修改尺寸为200px
          targetWidth: 200,
          //允许编辑
          allowEdit: true,
          //保存
          saveToPhotoAlbum: true,
          //只允许选择图片
          mediaType: Camera.MediaType.PICTURE,
          destinationType: Camera.DestinationType.FILE_URI
        };
        if (type === 'photo') {
          //如果选择相册方式
          option.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM
        }
        navigator.camera.getPicture(onSuccess, onFail, option);

        function onSuccess(imageData) {
          _this.user.head_pic = imageData;
          //开始上传
          upload(imageData);
        }

        function onFail(message) {
          _this.$message('错误: ' + message);
        }

        //上传文件
        function upload(fileURL) {

          //上传成功
          var success = function (r) {
            var obj = JSON.parse(r.response);
            if (obj.code == 0) {
              const basePath = _this.getApi().replace('api/', '') + obj.path;
              _this.user.head_pic = basePath;
              _this.imageUrl = obj.path;
            } else {
              _this.$message(`修改失败，头像不能超过2M`);
            }

          }

          //上传失败
          var fail = function (error) {
            _this.$message(`图片上传失败`);
          }
          var options = new FileUploadOptions();
          options.fileKey = "file";
          options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
          options.mimeType = "image/jpeg";

          //上传参数
          var params = {};
          params.type = 6;
          options.params = params;

          var ft = new FileTransfer();
          //上传地址
          var SERVER = _this.getApi('coms/upload-img');
          ft.upload(fileURL, encodeURI(SERVER), success, fail, options);
        }
      },
      // 验证会员登录
      vaLogin() {
        if (this.getobjS('user')) {
          this.axios.post(this.getApi('web/token'),
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token
            })
          ).then(res => {
            this.isLoading = false;
            if (res.data.code === 0) {
              this.login = true;
              this.getUserInfo();
              this.getUserInfoOrder()
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      // 请求会员详细信息
      getUserInfo() {
        this.axios.post(this.getApi('web/user_info'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.user = res.data.info
          }
        })
      },
      // 请求个人中心订单相关
      getUserInfoOrder() {
        this.axios.post(this.getApi('web/user_center'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.userOr = res.data.info
          }
        })
      },
      // 查看会员信息
      member: function () {
        if (this.login) { // 会员等级
          this.seeUser = true
        } else {
          this.$router.push('/login')
        }
      },
      // 关闭会员信息弹出
      close: function () {
        this.seeUser = false
      },
      // 查看全部订单
      seeAll: function () {
        if (this.login) {
          this.$router.push({path: '/my-order', query: {s: 0}})
        } else {
          this.$router.push('/login')
        }
      },
      // 未登录功能列表限制
      url: function (gn) {
        if (this.login) {
          this.$router.push(gn.url)  //更新功能列表链接
        } else {
          this.$router.push('/login')
        }
      },
      // 去登陆
      to_login: function () {
        this.$router.push('/login')
      },
      // 退出登录
      sign_out: function () {
        this.isLoading = true;
        this.axios.post(this.getApi('web/logout'),
          this.dafa({user_id: this.getobjS('user').id, type: 1})
        ).then((response) => {
          this.isLoading = false;
          if (response.data.code === 0) {
            this.$message(response.data.msg);
            this.delobjS('user');
            this.$router.push('/login')
          } else {
            this.$message(response.data.msg)
          }
        })
          .catch(err => {
            this.isLoading = false;
            this.$message('请重试')
          })
      },
      // 查看消息
      to_message: function () {
        this.$router.push('/message')
      },
      // 修改个人信息
      changInfo() {
        this.chang_info = true;
        this.axios.post(this.getApi('web/basic_info'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.info = res.data.info;
            this.imageUrlBase = res.data.info.head_pic;
          }
        })
      },
      // 修改信息保存
      saveInfo() {
        this.isLoading = true;
        this.axios.post(this.getApi('web/info_save'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            head_pic: this.imageUrl,
            nickname: this.info.nickname,
            sex: this.info.sex,
            birthday: this.info.birthday
          })
        ).then(res => {
          this.isLoading = false;
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.chang_info = false;
            this.getUserInfo()
          }
        }).catch(err => {
          this.isLoading = false;
          this.$message('请重试')
        })
      },
      // 上传图片
      handleAvatarSuccess(res, file) {
        this.imageUrlBase = URL.createObjectURL(file.raw);
        if (res.code === 0) {
          this.imageUrl = res.path
        } else {
          this.$message('服务器上传失败')
        }
      },
      // 图片上传前钩子
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isJPG && isLt2M;
      }
    },
    components: {
      Load
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*我的*/
  /*上部信息*/
  #userCenter {
    padding-bottom: 60px;
  }

  .g-Mtop {
    height: 7.2rem;
    padding: 0 15px;
    background: linear-gradient(to right, #fa5181, #ff2b49);
    text-align: center;
    position: relative;
    color: #fff;
  }

  .u-user {
    margin-top: 20px;
  }

  .u-user > span {
    display: inline-block;
    width: 62px;
    height: 62px;
    border-radius: 50%;
    margin: -10px 0 3px 0;
    box-sizing: border-box;
    /*border: 1px solid #e1e1e1;*/
    overflow: hidden;
  }

  .u-user > span img {
    width: 100%;
    height: 100%;
  }

  .u-user b {
    font-weight: bold;
    font-size: 16px;
  }

  .g-Mtop > p i:nth-child(1) {
    float: left;
    font-size: 24px;
  }

  .g-Mtop > p i:nth-child(2) {
    float: right;
    font-size: 24px;
    line-height: 40px;
  }

  .g-Mtop > p {
    font-size: 14px;
    overflow: hidden;
  }

  .u-user {
    display: inline-block;
  }

  /*订单模块*/
  .m-dingDan {
    position: relative;
    z-index: 2;
    width: 100%;
    padding: 10px 10px;
    box-sizing: border-box;
    box-shadow: 2px -2px 3px rgba(178, 163, 165, .1);
  }

  .m-dingDan h3 {
    padding: 0 5px;
    margin: 5px 0;
    font-size: 16px;
    color: #fd5f78;
    line-height: 44px;
    font-weight: bold;
    overflow: hidden;
  }

  .m-dingDan h3 > i {
    color: #ffc800;
    margin-right: 5px;
  }

  .m-dingDan h3 a {
    float: right;
    font-size: 14px;
    font-weight: normal;
    color: #666;
    vertical-align: inherit;
  }

  .m-dingDan h3 a i {
    font-size: 14px;
  }

  .m-zhuangTai {
    width: 100%;
    padding: 10px 0;
    box-sizing: border-box;
    overflow: hidden;
  }

  .m-zhuangTai a {
    overflow: hidden;
    height: 100%;
    float: left;
    width: 20%;
  }

  .m-zhuangTai div {
    text-align: center;
    color: #333;
  }

  .m-huo {
    position: relative;
  }

  .m-huo i {
    font-size: 22px;
  }

  .m-huo .big-i {
    font-size: 26px;
    line-height: 36px;
  }

  .m-huo span {
    display: inline-block;
    width: 20px;
    height: 17px;
    border-radius: 50%;
    background-color: #f23030;
    color: #fff;
    line-height: 17px;
    position: absolute;
    top: 2px;
  }

  /*我的钱包*/
  .g-myPurse {
    background-color: #f5f5f5;
    height: 54px;
    position: relative;
  }

  .m-myPurse {
    width: 94%;
    padding: 20px 0;
    height: 94px;
    box-sizing: border-box;
    overflow: hidden;
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 2px -2px 5px rgba(156, 20, 20, .25), -2px -2px 5px rgba(156, 20, 20, .25);
  }

  .m-myPurse > a {
    width: 33.33%;
    float: left;
    text-align: center;
  }

  .m-myPurse > a p:nth-child(1) {
    color: #ff2a48;
    font-size: 18px;
    font-weight: bold;
  }

  .m-myPurse > a p:nth-child(2) {
    margin-top: 3px;
    color: #333;
  }

  /*功能模塊*/
  .g-gongNeng {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .g-gongNeng li {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    border-bottom: 1px solid #f1f1f1;
  }

  .g-gongNeng li i {
    font-size: 22px;
  }

  .g-gongNeng li i:nth-of-type(1) {
    margin: 0 20px 0 10px
  }

  .g-gongNeng a {
    display: inline-block;
    width: 100%;
    height: 50px;
  }

  .g-gongNeng .u-you {
    float: right;
    font-size: 20px;
    color: #ccc !important;
  }

  .g-gongNeng li:nth-child(1) i {
    color: #ff9600;
  }

  .g-gongNeng li:nth-child(2) i {
    color: #0bd110;
  }

  .g-gongNeng li:nth-child(3) i {
    color: #ee153e;
  }

  .g-gongNeng li:nth-child(4) i {
    color: #15aeee;
  }

  .g-gongNeng li:nth-child(5) i {
    color: #eb12d4;
  }

  .g-gongNeng li:nth-child(6) i {
    color: #00b8b6;
  }

  .g-gongNeng li:nth-child(7) i {
    color: #6493af;
  }

  /*会员等级*/
  .g-member {
    width: 100%;
    height: 100%;
    background-color: #f3efef;
    padding-top: 55px;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    animation: memberShow .4s linear forwards;
  }

  @keyframes memberShow {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  .m-member-top {
    width: 100%;
    height: 45px;
    position: absolute;
    top: 0;
    left: 0;
    line-height: 45px;
    text-align: center;
    font-size: 14px;
    background-color: #fff;
  }

  .u-zuoBack {
    display: inline-block;
    float: left;
    width: 30px;
    height: 30px;
    text-align: center;
  }

  .m-photo {
    width: 100%;
    height: 75px;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #fff;
  }

  .m-photo > div:nth-child(1) {
    line-height: 55px;
    width: 35px;
  }

  .u-file {
    position: relative;
  }

  .u-file input {
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .u-file span {
    display: inline-block;
    width: 55px;
    height: 55px;
    overflow: hidden;
    border-radius: 50%;
    position: absolute;
    top: 0;
    right: 0;
  }

  .u-file span img {
    width: 100%;
    height: 100%;
  }

  .m-popupBox {
    width: 100%;
    height: 40px;
    margin-top: 1px;
    line-height: 40px;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
  }

  .m-address {
    background-color: #fff;
    margin-top: 1px;
    padding: 10px;
  }

  .m-address h3 {
    line-height: 20px;
  }

  .m-address p {
    text-align: right;
    line-height: 30px;
  }

  .sign_out {
    height: 45px;
    line-height: 45px;
    text-align: center;
    background: #f40000;
    color: #fff;
    font-size: 14px;
    margin-top: 20px;
  }

  .mark {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1111;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }

  .changeInfo {
    position: absolute;
    top: 20%;
    left: 5%;
    z-index: 1112;
    width: 90%;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
  }

  .changeInfo > h3 {
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    color: #333;
    background-color: #efefef;
    padding: 0 15px;
  }

  .changeInfo > ul {
    padding: 15px;
  }

  .changeInfo li {
    line-height: 30px;
    border: 1px solid #ebebeb;
    margin-bottom: 20px;
  }

  .changeInfo label {
    display: inline-block;
    width: 10%;
    text-align: right;
    margin-right: 20px;
  }

  .info-ipt, .info-set {
    width: 70%;
    height: 30px;
    line-height: 30px;
    border: none;
    box-sizing: border-box;
  }

  .hed-img {
    width: 70px;
    height: 70px;
    vertical-align: middle;
  }

  .info-btn {
    width: 60%;
    height: 34px;
    line-height: 34px;
    background-color: #f51322;
    font-size: 14px;
    color: #fff;
    border: none;
    border-radius: 3px;
    margin: 0 0 40px 20%;
  }

  .info-up {
    background-color: #f51322;
    color: #fff;
    padding: 3px 10px;
    border-radius: 4px;
    margin-left: 10px;
  }

  .avatar {
    width: 70px;
    height: 70px;
  }

  .avatar-uploader {
    display: inline-block;
    vertical-align: middle;
    padding-top: 5px;
  }
</style>
