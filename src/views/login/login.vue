<template>
  <div class="login">
    <!--头部-->
    <div class="g-login-top">
      <router-link to="/home" tag="span"><img :src="app_logo" alt="头像"></router-link>
    </div>
    <!--表单-->
    <div class="g-form">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
        <el-form-item
          prop="account">
          <div class="ipt_box">
            <label><i class="iconfont icon-yonghu2"></i></label>
            <input type="text" v-model="ruleForm.account" placeholder="请输入账户名">
          </div>
        </el-form-item>
        <el-form-item
          prop="password">
          <div class="ipt_box">
            <label><i class="iconfont icon-password_icon"></i></label>
            <input type="password" v-model="ruleForm.password" placeholder="请输入密码">
          </div>
        </el-form-item>
        <el-form-item prop="code">
          <div class="ipt_box_s ipt_box">
            <input type="text" v-model="ruleForm.code">
            <img :src="yzm_code" alt="code" @click="change_yzm">
          </div>
        </el-form-item>
        <div class="link">
          <router-link to="/register">立即注册</router-link>
          <router-link to="/find-pass" class="u-right">找回密码</router-link>
        </div>
        <el-form-item>
          <div class="ipt_box_in ipt_box" @click="login('ruleForm')">
            立即登录
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--第三方登录-->
    <div class="g-third">
      <div>
        <i class="iconfont icon-weixin1 u-wx"></i>
        <p>微信登录</p>
      </div>
      <div>
        <i class="iconfont icon-qq-copy u-qq"></i>
        <p>QQ登录</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        yzm_code: this.getApi('coms/user-code'), // 验证码
        app_logo: require('@/assets/imgs/logo.png'),
        ruleForm: { // 表单信息
          account: '',
          password: '',
          code: ''
        },
        rules: {
          account: [
            {validator: this.va.vaAct, trigger: 'blur'}
          ],
          password: [
            {validator: this.va.vaPass, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {min: 5, max: 5, message: '长度 5 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    mounted: function () {

    },
    methods: {
      goBack() {  //后退
        this.$router.go(-1)
      },
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(this.getApi('web/login'),
              this.dafa({
                username: this.ruleForm.account,
                userpass: this.ruleForm.password,
                yzm: this.ruleForm.code,
                type: 1 // app登录
              })
            ).then(res => {
              if (res.data.code === 0) {
                this.setobjS('user', res.data.info);
                this.$message(res.data.msg);
                this.$router.push('/index');
                this.$store.commit('setIndexRouter', 0);
              } else {
                this.$message(res.data.msg);
                this.change_yzm()
              }
            })
          }
        })
      },
      change_yzm() {
        this.yzm_code = this.getApi('coms/user-code') + '?code=' + Math.random();
        this.ruleForm.code = null
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background-color: #f5f5f5;
  }

  /*头部*/
  .g-login-top {
    height: 8rem;
    background: linear-gradient(to right, #ff285b, #ff1f2e);
    text-align: center;
  }

  .g-login-top span {
    margin-top: 2rem;
    display: inline-block;
    width: 96px;
    height: 96px;
    border-radius: 5px;
    background-color: white;
  }

  .g-login-top img {
    width: 100%;
    height: 100%;
  }

  /*表单*/
  .g-form {
    width: 90%;
    background-color: #fff;
    border-radius: 3px;
    padding: 30px 30px 25px;
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
    background: linear-gradient(to right, #ff285b, #ff1f2e);
    text-align: center;
    color: #fff;
    font-size: 14px;
  }

  .link {
    padding: 0 20px 20px;
  }

  /*第三方登陆*/
  .g-third {
    margin-top: 20px;
    height: 100px;
    display: flex;
  }

  .g-third > div:nth-child(1) {
    text-align: right;
  }

  .g-third > div {
    flex: auto;
    padding: 0 30px;
    box-sizing: border-box;
  }

  .g-third i {
    font-size: 34px;
  }

  .u-wx {
    color: #25ca8c;
  }

  .u-qq {
    color: #5689d6;
  }
</style>
