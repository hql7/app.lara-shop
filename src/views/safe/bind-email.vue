<template>
  <div id="g-bindemail">
    <!--头部-->
    <div class="g-login-top">
      <i class="iconfont icon-guanbi" @click="goBack"></i><span>绑定邮箱</span>
    </div>
    <!--绑定邮箱-->
    <div class="g-form">
      <!--<div class="m-phone" v-if="email_old">
        <input type="text" v-model="email_old" disabled>
      </div>-->
      <div class="m-phone">
        <input type="email" placeholder="请输入邮箱" v-model="email_now" autocomplete
               name="email_now">
      </div>
      <div class="m-phone">
        <div class="m-login_Right" @click="newImg_code()"><img :src="img_code" alt=""></div>
        <div class="m-login_Left"><input type="text" v-model="yzm_code"></div>
      </div>
      <div class="g-code">
        <div class="m-getCode" :class="{'m-getCodeC':countdown>0}">
          <span v-if="countdown==0" @click="countDown()">获取验证码</span><span v-else>重新发送({{countdown}})</span>
        </div>
        <div class="m-code">
          <input type="number" placeholder="请输入邮箱验证码" v-model="eml_code">
        </div>
      </div>
      <div class="m-login-button" :class="{activated:email_now}" @click="regular"><input type="submit" value="绑定邮箱">
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
        // flag: true,
        email_now: '',
        // select: true,
        img_code: this.getApi('coms/user-code'),
        countdown: 0,
        yzm_code: '',
        eml_code: '',
        isLoading: false
      }
    },
    mounted() {
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 邮箱正则
      regular: function () {
        let email = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(this.email_now);
        if (email && this.eml_code) {
          this.isLoading = true;
          this.axios.post(this.getApi('web/change_email'),
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token,
              email_code: this.eml_code,
              email: this.email_now
            })
          ).then((res) => {
            this.isLoading = false;
            if (res.data.code === 0) {
              this.$message(res.data.msg);
              this.goBack();
            } else {
              this.$message(res.data.msg);
              this.newImg_code()
            }
          }).catch(err => {
            this.isLoading = false;
          })
        } else {
          alert('请核对邮箱或验证码')
        }
      },
      // 验证码倒计时
      countDown() {
        let email = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(this.email_now);
        if (email && this.yzm_code) {
          this.isLoading = true;
          this.axios.post(this.getApi('coms/email_code'),
            this.dafa({
              email: this.email_now,
              img_code: this.yzm_code,
            })
          ).then((response) => {
            this.isLoading = false;
            if (response.data.code === 0) {
              this.$message(response.data.msg);
              this.countdown = 300;
              let timer = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                  clearInterval(timer)
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
          this.$message('输入错误');
          this.newImg_code()
        }
      },
      // 刷新验证码
      newImg_code() {
        this.img_code = this.getApi('coms/user-code') + '?k=' + Math.random()
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

  #g-bindemail {
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

  /*绑定*/
  .g-form {
    margin-top: 30px;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .m-phone {
    width: 100%;
    height: 45px;
    line-height: 45px;
    border: 1px solid rgba(234, 234, 234, .8);
    border-radius: 5px;
    margin-top: 20px;
  }

  .m-phone input {
    border: none;
    background-color: transparent;
    padding-left: 10px;
    width: 80%;
    height: 100%;
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

  .m-phone i {
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

  .m-getCodeC {
    background-color: #e8e5e5;
    color: #999;
  }

  .activated {
    background-color: #f40000;
  }

  .activated input {
    color: #fff;
  }

  .g-agreement p i {
    margin-right: 5px;
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
    display: block;
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
