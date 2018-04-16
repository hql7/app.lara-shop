<template>
  <div id="g-login" class="g-login">
    <!--头部-->
    <div class="g-login-top">
      <i class="iconfont icon-guanbi" @click="goBack"></i><span>设置密码</span>
    </div>
    <!--修改密码-->
    <div class="g-form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="phone" v-if="v_type===0">
          <div class="m-phone">
            <div class="m-loginLeft"><span>+86</span></div>
            <div class="m-loginRight"><input type="tel" placeholder="请输入手机号" v-model.number="ruleForm.phone"
                                             autocomplete name="phoneNum">
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="email" v-else>
          <div class="pass_back">
            <input type="text" v-model="ruleForm.email" placeholder="请输入邮箱号">
          </div>
        </el-form-item>
        <el-form-item prop="yzm_code">
          <div class="g-code">
            <div class="m-getCode tuYzm">
              <img :src="img_yzm" alt="" @click="newImg_code">
            </div>
            <div class="m-code">
              <input type="text" placeholder="请输入图片验证码" v-model="ruleForm.yzm_code">
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="code">
          <div class="g-code">
            <div class="m-getCode" :class="{'dis-send':countdown>0}">
              <span v-if="countdown<=0" @click="countDown">获取验证码</span><span v-else>重新发送({{countdown}})</span>
            </div>
            <div class="m-code">
              <input type="text" placeholder="请输入验证码" v-model="ruleForm.code">
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="new_pass">
          <div class="pass_back">
            <input type="password" v-model="ruleForm.new_pass" placeholder="请输入密码">
          </div>
        </el-form-item>
        <el-form-item prop="qr_pass">
          <div class="pass_back">
            <input type="password" v-model="ruleForm.qr_pass" placeholder="请确认密码">
          </div>
        </el-form-item>
        <el-form-item>
          <div class="m-login-button" :class="{activated:ruleForm.qr_pass}" @click="submitForm('ruleForm')"><input
            type="button"
            value="确认修改">
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--验证类型选择-->
    <div class="reg-type" v-if="popup">
      <div class="g-login-top">
        <i class="iconfont icon-guanbi" @click="goBack"></i><span>选择验证方式</span>
      </div>
      <b class="c-red">只能用已绑定的方式验证，请先至个人中心绑定邮箱和手机号</b>
      <p @click="choiceRegType(1)">邮箱验证 <i class="iconfont icon-icon u-right"></i></p>
      <p @click="choiceRegType(0)">手机验证 <i class="iconfont icon-icon u-right"></i></p>
    </div>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      let qrPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.new_pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        img_yzm: this.getApi('coms/user-code'),
        ruleForm: {
          phone: null, // 手机号
          email: '', // 邮箱
          yzm_code: '', // 图片验证码
          code: '', // 验证码
          new_pass: '', // 新密码
          qr_pass: '' // 确认密码
        },
        rules: {
          phone: [{validator: this.va.vaPhone, trigger: 'blur'}],
          email: [{validator: this.va.vaEmail, trigger: 'blur'}],
          yzm_code: [
            {required: true, message: '请输入图片验证码', trigger: 'blur'},
            {min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {min: 6, max: 6, message: '长度为 6 个字符', trigger: 'blur'}
          ],
          new_pass: [{validator: this.va.vaPass, trigger: 'blur'}],
          qr_pass: [{validator: qrPass, trigger: 'blur'}]
        }, // 验证规则
        v_type: 0, // 验证类型  0=手机验证  1=邮箱验证
        c_type: this.$route.query.ct, // 修改类型  0=登录密码  1=支付密码
        countdown: 0,
        user: {
          mobile: '', // 是否绑定了手机
          email: '' // 是否绑定了邮箱
        },
        popup: true,
        isLoading: true
      }
    },
    created: function () {
      this.getUserInfo()
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 选择验证方式
      choiceRegType(val) {
        this.v_type = val;
        if (val === 0) {
          // 选择手机验证
          if (this.user.mobile) {
            this.popup = false
          } else {
            this.$message('绑定手机号才能使用手机验证！两秒后跳转');
            setTimeout(() => {
              this.$router.push('/bind-phone')
            }, 2000)
          }
        } else {
          // 选择邮箱验证
          if (this.user.email) {
            this.popup = false
          } else {
            this.$message('绑定邮箱才能使用邮箱验证！两秒后跳转');
            setTimeout(() => {
              this.$router.push('/bind-email')
            }, 2000)
          }
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
          this.isLoading = false;
          if (res.data.code === 0) {
            this.user = res.data.info
          }
        }).catch(err => {
          this.isLoading = false;
        })
      },
      // 获取验证码正则
      countDown: function () {
        if (this.v_type === 0) {
          // 手机修改
          let regPhone = /^1[3|4|5|7|8]\d{9}$/.test(this.ruleForm.phone);
          if (regPhone && this.ruleForm.yzm_code) {
            this.getPhoneCode()
          } else {
            this.$message('请检查手机号和图片验证码')
          }
        } else {
          // 邮箱修改
          let regEmail = /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/.test(this.ruleForm.email);
          if (regEmail && this.ruleForm.yzm_code) {
            this.getEmailCode()
          } else {
            this.$message('请检查邮箱和图片验证码')
          }
        }
      },
      // 获取邮箱验证码
      getEmailCode() {
        this.isLoading = true;
        this.axios.post(this.getApi('coms/email_code'),
          this.dafa({
            email: this.ruleForm.email,
            img_code: this.ruleForm.yzm_code
          })
        ).then(res => {
          this.isLoading = false;
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.countdown = 300;
            let timer = setInterval(() => {
              this.countdown--;
              if (this.countdown <= 0) {
                clearInterval(timer)
              }
            }, 1000)
          } else {
            this.newImg_code()
          }
        }).catch(err => {
          this.isLoading = false;
          this.$message('请重试');
        })
      },
      // 获取手机验证码
      getPhoneCode() {
        this.isLoading = true;
        this.axios.post(this.getApi('coms/mobile_code'),
          this.dafa({
            mobile: this.ruleForm.phone,
            img_code: this.ruleForm.yzm_code
          })
        ).then(res => {
          this.isLoading = false;
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.countdown = 120;
            let timer = setInterval(() => {
              this.countdown--;
              if (this.countdown <= 0) {
                clearInterval(timer)
              }
            }, 1000)
          } else {
            this.newImg_code()
          }
        }).catch(err => {
          this.isLoading = false;
          this.$message('请重试');
        })
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isLoading = true;
            this.axios.post(this.getApi('web/change_pass'),
              this.dafa({
                user_id: this.getobjS('user').id,
                token: this.getobjS('user').token,
                verify_type: this.v_type,
                code: this.ruleForm.code,
                change_type: this.c_type,
                new_pass: this.ruleForm.new_pass
              })
            ).then(res => {
              this.isLoading = false;
              this.$message(res.data.msg);
              if (res.data.code === 0) {
                this.$router.go(-1)
              }
            }).catch(err => {
              this.isLoading = false;
              this.$message('请重试');
            })
          }
        })
      },
      // 刷新图片验证码
      newImg_code: function () {
        this.img_code = this.getApi('coms/user-code') + '?k=' + Math.random()
      }
    },
    components: {Load}
  }
</script>

<style scoped>
  .g-login {
    padding: 0 10px;
  }

  /*头部*/
  .g-login-top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    text-align: center;
    letter-spacing: 1px;
    color: #333;
    background-color: #fff;
    padding: 0 5px;
    position: relative;
  }

  .g-login-top i {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 40px;
    height: 40px;
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
    box-sizing: border-box;
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
    border: none;
    float: left;
    background-color: transparent;
    height: 100%;
    box-sizing: border-box;
    width: 85%;
  }

  .g-code, .pass_back {
    width: 100%;
    height: 40px;
  }

  .m-code {
    margin-right: 140px;
    height: 100%;
  }

  .m-code input, .pass_back input {
    border: 1px solid rgba(234, 234, 234, .8);
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-left: 10px;
    border-radius: 5px;
  }

  .m-getCode {
    width: 130px;
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

  .dis-send {
    background-color: #e8e5e5;
    color: #999;
  }

  .m-loginRight i {
    color: #999;
  }

  .m-login-button {
    margin-top: 20px;
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
    letter-spacing: 2px;
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

  .tuYzm {
    background: none;
    border-radius: 5px;
    overflow: hidden;
  }

  .tuYzm > img {
    width: 100%;
    height: 100%;
  }

  /*弹出*/
  .reg-type {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f1f2f6;
  }

  .reg-type > p {
    background-color: #fff;
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    margin-top: 12px;
  }

</style>
