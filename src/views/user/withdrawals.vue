<template>
  <div id="g-transfer">
    <!--头部-->
    <div class="transfer-top">
      <i class="iconfont icon-zuo1" @click="goBack"></i><span>提现</span>
      <router-link to="/log?l=2">明细</router-link>
    </div>
    <!--表单-->
    <div class="transfer-form">
      <ul>
        <li>
          <label>提&nbsp;&nbsp;现</label><select name="qian_bao" v-model="ti_xian">
          <option value="0">支付宝</option>
          <option value="1">微信</option>
        </select>
        </li>
        <li v-if="ti_xian==0">
          <label>支付宝</label><input type="text" placeholder="请输入支付宝帐号" v-model="Alipay.acc">
        </li>
        <li v-if="ti_xian==0">
          <label>开户人姓名</label><input type="text" placeholder="请输入开户人姓名" v-model="Alipay.name">
        </li>
        <li v-if="ti_xian==1" class="ts-li">
          <label>开户人姓名</label><input type="text" placeholder="请输入开户人姓名" v-model="WeChat.name">
          <p class="tx-ts">必须绑定微信才能使用微信提现功能</p>
        </li>
        <!--  <li v-if="ti_xian==1">
            <label>联系方式</label><input type="text" placeholder="请输入联系方式" v-model="alipay_tel">
          </li>-->
        <!-- <li v-if="ti_xian==2">
           <label>开户行</label><input type="text" placeholder="请输入开户行地址" v-model="bank_name">
         </li>
         <li v-if="ti_xian==2">
           <label>开户人</label><input type="text" placeholder="请输入开户人姓名" v-model="account_name">
         </li>
         <li v-if="ti_xian==2">
           <label>银行卡</label><input type="text" placeholder="请输入银行卡号" v-model="bank_card">
         </li>
         <li v-if="ti_xian==2">
           <label>联系方式</label><input type="text" placeholder="请输入联系方式" v-model="bank_tel">
         </li>-->
        <li class="tx_je">
          <h3>提现金额</h3>
          <div>
            ￥<input type="number" v-model.number="jin_e">
          </div>
          <p>可用余额（{{info.balance}}）<span @click="all_with">全部提现</span></p>
        </li>
        <li>
          <label>密&nbsp;&nbsp;码</label><input type="text" placeholder="请输入交易密码" v-model="password">
        </li>
      </ul>
      <div @click="va">立即提交</div>
    </div>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        info: {
          balance: 0.00
        },
        jin_e: null, // 金额
        Alipay: {
          acc: '', // 账号
          name: '' // 开户人姓名
        }, // 支付宝信息
        WeChat: {
          id: '',
          name: '' // 开户人姓名
        }, // 微信信息
        password: '', // 密码
        ti_xian: 0, // 提现方式
        yu_e: 0, // 可用余额
        isLoading: true
      }
    },
    created: function () {
      this.getBalanceInfo();
      this.getWechatConfig();
    },
    computed: {},
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取余额信息
      getBalanceInfo() {
        this.axios.post(this.getApi('web/user_info'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            this.info = res.data.info
          }
        }).catch(err => {
          this.isLoading = false;
        })
      },
      // 全部提现
      all_with: function () {
        this.jin_e = parseInt(parseInt(this.info.balance) / 100) * 100;
      },
      // 验证
      va() {
        let regMoney = /^[1-9]\d*00$/.test(this.jin_e);
        let password = /^\S{6,18}$/.test(this.password);
        if (this.ti_xian === 0) {
          let data = {
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            amount: this.jin_e,
            type: this.ti_xian,
            safepass: this.password,
            payee_account: this.Alipay.acc,
            payee_real_name: this.Alipay.name
          };
          // 支付宝
          if (!this.Alipay.acc) {
            this.$message('请输入支付宝账号')
          } else if (!this.Alipay.name) {
            this.$message('请输入支付宝开户人姓名')
          } else if (!regMoney) {
            this.$message('提现金额必须为100的倍数')
          } else if (!password) {
            this.$message('密码格式为6-18位非空字符')
          } else {
            this.submitForm(data)
          }
        } else {
          // 微信
          let data = {
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            amount: this.jin_e,
            type: this.ti_xian,
            safepass: this.password,
            openid: this.WeChat.id,
            re_user_name: this.WeChat.name
          };
          if (!this.WeChat.name) {
            this.$message('请输入微信开户人姓名')
          } else if (!regMoney) {
            this.$message('提现金额必须为100的倍数')
          } else if (!password) {
            this.$message('密码格式为6-18位非空字符')
          } else {
            this.submitForm(data)
          }
        }
      },
      // 清除数据
      clear: function () {
        this.jin_e = ''; //金额
        this.password = ''; //密码
      },
      // 提交提现
      submitForm(data) {
        this.isLoading = false;
        this.axios.post(this.getApi('web/withdraw'),
          this.dafa(data)
        ).then(res => {
          this.isLoading = true;
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.$router.go(-1)
          }
        }).catch(err => {
          this.isLoading = true;
          console.log(err);
          this.$message('请重试');
        })
      },
      // 微信配置项
      getWechatConfig() {
        this.axios.post(this.getApi('web/config_info'),
          `title=wechat`
        ).then(res => {
          if (res.data.code === 0) {
            this.WeChat.id = res.data.appid || ''
          }
        })
      }
    },
    components: {Load}
  }
</script>

<style scoped>
  html, body {
    width: 100%;
    height: 100%;
  }

  #g-transfer {
    background-color: #f5f4f9;
    height: 100%;
  }

  .transfer-top {
    height: 50px;
    color: #333;
    line-height: 50px;
    padding: 0 15px;
    background-color: #fff;
    margin-bottom: 12px;
    position: relative;
  }

  .transfer-top span {
    margin-left: 35px;
    padding-left: 15px;
    font-size: 16px;
    border-left: 1px solid #d7d7d7;
  }

  .transfer-top a {
    float: right;
  }

  .transfer-form {
    padding-bottom: 30px;
  }

  .transfer-top i {
    font-size: 22px;
    color: #fa2f56;
    line-height: 45px;
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: center;
  }

  .transfer-form li {
    height: 45px;
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    margin-bottom: 12px;
    background-color: #fff;
    padding-right: 15px;
  }

  .transfer-form .ts-li {
    margin-bottom: 24px;
  }

  .tx-ts {
    padding-left: 72px;
    line-height: 24px;
    color: #f51322;
  }

  .transfer-form .tx_je {
    height: 140px;
  }

  .transfer-form label {
    width: 20%;
    display: inline-block;
    text-align: center;
    color: #333;
  }

  .transfer-form input, .transfer-form select {
    width: 80%;
    height: 100%;
    line-height: 45px;
    border: none;
    box-sizing: border-box;
    padding-left: 15px;
    color: #999;
    outline: none;
  }

  .transfer-form > div {
    width: 90%;
    height: 45px;
    line-height: 45px;
    background: linear-gradient(to right, #ff366e, #ff2a48);
    border-radius: 3px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    margin: 45px auto 0;
  }

  .tx_je {
    padding: 0 20px;
  }

  .tx_je > h3 {
    margin: 12px 0 20px;
    line-height: 20px;
    font-size: 14px;
  }

  .tx_je > div {
    border-bottom: 1px solid #ebebeb;
    font-size: 22px;
    color: #333;
  }

  .tx_je > p {
    margin: 15px 0;
  }

  .tx_je > p span {
    float: right;
    color: #fa264e;
  }
</style>
