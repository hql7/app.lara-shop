<template>
  <div class="register">
    <!--头部-->
    <div class="g-register-top">
      <span><img src="../../assets/imgs/logo.png" alt="头像"></span>
    </div>
    <!--表单-->
    <div class="g-form">
      <el-form :model="regForm" :rules="rules" ref="regForm">
        <el-form-item prop="account">
          <div class="ipt_box">
            <label><i class="iconfont icon-yonghu2"></i></label>
            <input type="text" placeholder="请输入用户名" v-model="regForm.account"/>
          </div>
        </el-form-item>
        <el-form-item prop="pass">
          <div class="ipt_box">
            <label><i class="iconfont icon-password_icon"></i></label>
            <input type="password" placeholder="请输入密码" v-model="regForm.pass"/>
          </div>
        </el-form-item>
        <el-form-item prop="checkPass">
          <div class="ipt_box">
            <label><i class="iconfont icon-password_icon"></i></label>
            <input type="password" placeholder="请确认密码" v-model="regForm.checkPass"/>
          </div>
        </el-form-item>
        <el-form-item prop="phone" v-if="reg_type==1">
          <div class="ipt_box">
            <label><i class="iconfont icon-artboard4copy"></i></label>
            <input type="text" placeholder="请输入手机号" v-model="regForm.phone"/>
          </div>
        </el-form-item>
        <el-form-item prop="email" v-else>
          <div class="ipt_box">
            <label><i class="iconfont icon-yidongjianzhan"></i></label>
            <input type="text" placeholder="请输入邮箱" v-model="regForm.email">
          </div>
        </el-form-item>
        <el-form-item>
          <div class="ipt_box_s ipt_box">
            <input class="ipt-s" placeholder="图片验证码" v-model="regForm.yzm_code"/>
            <img :src="img_code" alt="点击切换验证码" @click="change_yzm">
          </div>
        </el-form-item>
        <el-form-item prop="code">
          <div class="ipt_box_s ipt_box">
            <input class="ipt-s" placeholder="请输入验证码" v-model="regForm.code"/>
            <button type="button" v-if="content==0" class="mobile_code" @click="countDown()">获取验证码</button>
            <button type="button" v-else class="dis-code mobile_code">{{content}}重新发送</button>
          </div>
        </el-form-item>
        <el-form-item prop="agree" :style="{paddingLeft:0.5+'rem',marginBottom:0.5+'rem'}">
          <el-checkbox-group v-model="regForm.agree">
            <el-checkbox></el-checkbox>
          </el-checkbox-group>
          <span>阅读并同意<em class="c-blue" @click="popup=true">《{{amt.title}}》</em></span>
        </el-form-item>
        <el-form-item class="info submit">
          <button type="button" class="ipt_box_in" :class="{act:regForm.account}" @click="submitForm('regForm')">立即注册
          </button>
        </el-form-item>
      </el-form>
    </div>
    <!--跳转登录-->
    <router-link to="/login">
      <p class="toLogin">已有账号？<span>立即登录</span></p>
    </router-link>
    <!--协议内容弹出-->
    <div class="popup" v-if="popup">
      <div class="close"><i class="iconfont icon-guanbi" @click="popup=false"></i>{{amt.title}}</div>
      <div v-html="amt.content"></div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.regForm.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      };
      return {
        img_code: this.getApi('coms/user-code'), // 验证码
        content: 0, // 倒计时
        reg_type: '0', // 注册方式 0=邮箱注册 1=手机注册
        amt: {
          title: '', // 注册协议标题
          content: '' // 注册协议标题
        },
        regForm: {
          account: '',
          phone: '',
          yzm_code: '',
          email: '',
          code: '',
          pass: '',
          checkPass: '',
          agree: []
        },
        rules: {
          account: [
            {validator: this.va.vaAct, trigger: 'blur'}
          ],
          phone: [
            {validator: this.va.vaPhone, trigger: 'blur'}
          ],
          email: [
            {validator: this.va.vaEmail, trigger: 'blur'}
          ],
          pass: [
            {validator: this.va.vaPass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {min: 6, max: 6, message: '长度 6 个字符', trigger: 'blur'}
          ],
          agree: [
            {type: 'array', required: true, message: '请同意用户注册协议', trigger: 'change'}
          ]
        },
        popup: false
      }
    },
    created() {
      this.getRegisterInfo()
    },
    methods: {
      // 更换图片验证码
      change_yzm() {
        this.img_code = this.getApi('coms/user-code') + '?code=' + Math.random();
        this.regForm.yzm_code = ''
      },
      // 获取验证码正则
      countDown: function () {
        if (this.reg_type === '1') {
          // 手机注册
          let regPhone = /^1[3|4|5|7|8]\d{9}$/.test(this.regForm.phone);
          if (regPhone && this.regForm.yzm_code) {
            this.getPhoneCode()
          } else {
            this.$message('请检查手机号和图片验证码')
          }
        } else {
          // 邮箱注册
          let regEmail = /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/.test(this.regForm.email);
          if (regEmail && this.regForm.yzm_code) {
            this.getEmailCode()
          } else {
            this.$message('请检查邮箱和图片验证码')
          }
        }
      },
      // 获取邮箱验证码
      getEmailCode() {
        this.axios.post(this.getApi('coms/email_code'),
          this.dafa({
            email: this.regForm.email,
            img_code: this.regForm.yzm_code
          })
        ).then(res => {
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.content = 300;
            let timer = setInterval(() => {
              this.content--;
              if (this.content === 0) {
                clearInterval(timer)
              }
            }, 1000)
          } else {
            this.change_yzm()
          }
        }).catch(err => {
          this.$message('请重试');
        })
      },
      // 获取手机验证码
      getPhoneCode() {
        this.axios.post(this.getApi('coms/mobile_code'),
          this.dafa({
            mobile: this.regForm.phone,
            img_code: this.regForm.yzm_code
          })
        ).then(res => {
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.content = 120;
            let timer = setInterval(() => {
              this.content--;
              if (this.content === 0) {
                clearInterval(timer)
              }
            }, 1000)
          } else {
            this.change_yzm()
          }
        }).catch(err => {
          this.$message('请重试');
        })
      },
      // 获取商城注册配置项
      getRegisterInfo() {
        this.axios.post(this.getApi('web/reg_page'),
        ).then(res => {
          if (res.data.code === 0) {
            this.reg_type = res.data.reg_type;
            this.amt.title = res.data.title;
            this.amt.content = this.base().utf8to16(this.base().base64decode(res.data.content));
          }
        })
      },
      // 提交注册
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(this.getApi('web/register'),
              this.dafa({
                reg_type: this.reg_type,
                username: this.regForm.account,
                userpass: this.regForm.pass,
                account: this.reg_type === '1' ? this.regForm.phone : this.regForm.email,
                reg_code: this.regForm.code
              })
            ).then(res => {
              if (res.data.code === 0) {
                this.$message(res.data.msg);
                this.$router.push('/login')
              } else {
                this.$message(res.data.msg);
                this.change_yzm()
              }
            }).catch(err => {
              console.log(err);
              this.$message('请重试!')
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .register {
    position: relative;
    min-height: 100%;
    background: #f5f5f5;
    padding-bottom: 50px;
    box-sizing: border-box;
  }

  /*头部*/
  .g-register-top {
    height: 8rem;
    background: linear-gradient(to right, #ff285b, #ff1f2e);
    text-align: center;
  }

  .g-register-top span {
    margin-top: 2rem;
    display: inline-block;
    width: 96px;
    height: 96px;
    border-radius: 5px;
    background-color: white;
  }

  .g-register-top img {
    width: 100%;
    height: 100%;
  }

  /*表单*/
  .g-form {
    width: 90%;
    background-color: #fff;
    border-radius: 3px;
    padding: 30px 30px 15px;
    margin: -1.7rem auto 0;
    box-sizing: border-box;
  }

  .ipt_box {
    height: 44px;
    line-height: 44px;
    background-color: #f0f0f0;
    border-radius: 50px;
    overflow: hidden;
  }

  .ipt_box > label {
    float: left;
    width: 20%;
    height: 100%;
    text-align: center;
  }

  .ipt_box i {
    font-size: 18px;
    line-height: 40px;
    color: #969696;
  }

  .ipt_box > input {
    float: left;
    width: 80%;
    height: 100%;
    line-height: 44px;
    background-color: transparent;
    border: none;
    box-sizing: border-box;
  }

  .ipt_box_s > input {
    width: 60%;
    padding-left: 20px;
    box-sizing: border-box;
  }

  .ipt_box_s > img {
    width: 40%;
    height: 100%;
    float: right;
  }

  .ipt_box_in {
    width: 100%;
    height: 44px;
    background: linear-gradient(to right, #ff285b, #ff1f2e);
    text-align: center;
    color: #fff;
    font-size: 14px;
    border: none;
    border-radius: 50px;
  }

  .toLogin {
    width: 100%;
    /*position: absolute;*/
    text-align: center;
    margin-top: 20px;
    box-sizing: border-box;
  }

  .mobile_code {
    width: 40%;
    height: 80%;
    background: linear-gradient(to right, #ff285b, #ff1f2e);
    color: #fff;
    border: none;
    border-radius: 50px;
  }

  .dis-code {
    background: #cccccc;
  }

  .toLogin span {
    color: #333333;
  }

  .yzm_code {
    float: right;
    width: 35%;
    height: 42px;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
  }

  .popup {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    min-height: 100%;
    background-color: #fff;
    padding: 15px;
    box-sizing: border-box;
  }

  .close {
    position: relative;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .close > i {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .submit {
    margin-top: 25px;
  }

  .el-checkbox-group {
    display: inline-block;
  }
</style>
