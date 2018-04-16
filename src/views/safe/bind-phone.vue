<template>
  <div id="g-bindphone">
    <!--头部-->
    <div class="g-login-top">
      <i class="iconfont icon-guanbi" @click="goBack"></i><span>绑定手机号</span>
    </div>
    <!--绑定手机号-->
    <div class="g-form">
      <!--<div class="m-phone" v-if="phone_old">
        <input type="text" v-model="phone_old" disabled>
      </div>-->
      <div class="m-phone">
        <div class="m-loginLeft"><span>+86</span></div>
        <div class="m-loginRight"><input type="tel" placeholder="请输入要绑定的手机号" v-model.number="phone_now" autocomplete
                                         name="phone_now"><i class="iconfont icon-guanbi2" @click="clearPhone"
                                                             v-show="phone_now"></i>
        </div>
      </div>
      <div class="m-phone">
        <div class="m-login_Right" @click="newImg_code"><img :src="img_code" alt=""></div>
        <div class="m-login_Left"><input type="text" v-model="yzm_code" placeholder="验证码"></div>
      </div>
      <div class="g-code">
        <div class="m-getCode" :class="{'m-getCodeC':countdown>0}">
          <span v-if="countdown==0" @click="countDown">获取验证码</span><span v-else>重新发送({{countdown}})</span>
        </div>
        <div class="m-code">
          <input type="number" placeholder="请输入短信验证码" v-model="sms_code">
        </div>
      </div>
      <div class="m-login-button" :class="{activated:phone_now}" @click="regular"><input type="submit" value="绑定">
      </div>
    </div>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        phone_now: "",
        countdown: 0,
        img_code: this.getApi('coms/user-code'),
        yzm_code: "",
        sms_code: "",
        isLoading: false
      }
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 快速清空
      clearPhone: function () {
        this.phone_now = ''
      },
      // 发出绑定请求
      regular: function () {
        let phone = /^1[3|4|5|7|8]\d{9}$/.test(this.phone_now);
        if (phone && this.sms_code) {
          this.isLoading = true;
          this.axios.post(this.getApi('web/change_mobile'),
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token,
              tel_code: this.sms_code,
              mobile: this.phone_now
            })
          ).then((res) => {
            this.isLoading = false;
            if (res.data.code === 0) {
              this.$message(res.data.msg);
              this.goBack()
            } else {
              this.$message(res.data.msg);
              this.newImg_code();
            }
          }).catch(err => {
            this.isLoading = false;
          })
        } else {
          this.$message('请检查输入数据是否正确')
        }
      },
      // 验证码倒计时
      countDown() {
        let regPhone = /^1[3|4|5|7|8]\d{9}$/.test(this.phone_now);
        if (regPhone && this.yzm_code) {
          this.isLoading = true;
          this.axios.post(this.getApi('coms/mobile_code'),
            this.dafa({
              mobile: this.phone_now,
              img_code: this.yzm_code
            })
          ).then((response) => {
            this.isLoading = false;
            if (response.data.code === 0) {
              this.$message(response.data.msg);
              this.countdown = 120;
              let timer = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                  clearInterval(timer);
                }
              }, 1000)
            } else {
              this.$message(response.data.msg);
              this.newImg_code()
            }
          }).catch(err => {
            this.isLoading = false;
          })
        } else {
          this.$message("输入错误");
          this.newImg_code()
        }
      },
      // 刷新验证码
      newImg_code() {
        this.img_code = this.getApi("coms/user-code") + '?k=' + Math.random()
      }
    },
    components: {Load}
  }
</script>

<style scoped>
  html, body {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: #fff;
  }

  #g-bindphone {
    width: 100%;
    height: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }

  /*头部*/
  .g-login-top {
    padding: 0 5px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    color: #333;
    text-align: center;
    letter-spacing: 1px;
  }

  .g-login-top span {
    font-weight: bold;
  }

  .g-login-top i {
    float: left;
    color: #666;
  }

  /*登录*/
  .g-form {
    margin-top: 30px;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .m-phone {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border: 1px solid rgba(234, 234, 234, .8);
    border-radius: 5px;
    margin-top: 20px;
  }

  .m-loginLeft {
    width: 60px;
    height: 100%;
    float: left;
    text-align: center;
  }

  .m-loginRight {
    margin-left: 60px;
    height: 100%;
  }

  .m-loginRight input {
    height: 100%;
    box-sizing: border-box;
    float: left;
    border: none;
    background-color: transparent;
    width: 85%;
  }

  .g-code {
    width: 100%;
    height: 40px;
    margin-top: 20px;
  }

  .m-code {
    margin-right: 160px;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid rgba(234, 234, 234, .8);
  }

  .m-code input {
    border: none;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-left: 10px;
  }

  .m-getCode {
    width: 150px;
    height: 100%;
    float: right;
    border-radius: 4px;
    text-align: center;
    line-height: 40px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #f40000;
    color: #fff;
  }

  .m-getCodeC {
    background-color: #e8e5e5;
    color: #999;
  }

  .m-loginRight i {
    color: #999;
  }

  .m-login-button {
    margin: 35px 0 0;
    width: 100%;
    height: 40px;
    background-color: #e1e1e1;
    border-radius: 3px;
  }

  .m-login-button input {
    width: 100%;
    height: 100%;
    border: none;
    background-color: transparent;
    color: #999;
    font-weight: bold;
    letter-spacing: 7px;
  }

  .activated {
    background-color: #f40000;
  }

  .activated input {
    color: #fff;
  }

  .g-agreement {
    width: 100%;
    height: 40px;
    line-height: 40px;
  }

  .g-agreement p i {
    margin-right: 5px;
  }

  .u-sel {
    color: #f40000;
  }

  .m-login_Left {
    margin-right: 150px;
  }

  .m-login_Left input {
    border: none;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding-left: 10px;
  }

  .m-login_Right {
    float: right;
    width: 150px;
    height: 100%;
    overflow: hidden;
  }

  .m-login_Right img {
    width: 100%;
    height: 100%;
  }

  .m-phone > input {
    width: 100%;
    height: 100%;
    padding-left: 10px;
    box-sizing: border-box;
    border: none;
  }

  .u-ts {
    padding: 0 5px;
    color: #f40000;
    margin-top: 10px;
  }
</style>
