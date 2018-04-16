<template>
  <div id="g-login">
    <!--头部-->
    <div class="g-login-top">
      <i class="iconfont icon-zuo" @click="goBack"></i><span>充值中心</span>
    </div>
    <div class="g-chong_zhi">
      <h3><i class="iconfont icon-daifukuan-copy"></i>充值</h3>
      <ul class="biao_dan">
        <li>
          <label for="jin_e">金额：</label>
          <input type="text" v-model.number="money" id="jin_e" placeholder="请输入金额">
        </li>
        <li>
          <label for="lei_xing">类型：</label>
          <select id="lei_xing" v-model="type">
            <option value="0">账户余额</option>
          </select>
        </li>
      </ul>
      <button @click="regular">立即充值</button>
    </div>
    <div class="ji_lu">
      <h3 @click="to_log"><i class="iconfont icon-record"></i>明细记录 <span class="iconfont icon-icon"></span></h3>
    </div>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        money: null,
        type: 0,
        isLoading: false
      }
    },
    mounted: function () {

    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 发出充值请求
      regular: function () {
        let reg = /^[1-9][0-9]*/.test(this.money);
        if (reg) {
          this.isLoading = true;
          this.axios.post(this.getApi('web/recharge'),
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token,
              wallet_type: this.type,
              money: this.money
            })
          ).then(res => {
            this.isLoading = false;
            this.$message(res.data.msg);
            if (res.data.code === 0) {
              this.setobjS('order', res.data.order_info);
              this.$router.push('/pay')
            }
          }).catch(err => {
            this.isLoading = false;
          })
        } else {
          this.$message('充值金额为正整数')
        }
      },
      to_log: function () {
        this.$router.push({path: '/log', query: {l: 1}})
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
    background-color: #f5f4f9;
  }

  #g-login {
    width: 100%;
    height: 100%;
    padding: 57px 0 0;
    box-sizing: border-box;
  }

  /*头部*/
  .g-login-top {
    padding: 0 5px;
    width: 100%;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    color: #333;
    text-align: center;
    letter-spacing: 1px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 8;
    background: #fff;
  }

  .g-login-top span {
    font-weight: bold;
  }

  .g-login-top i {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    color: #666;
  }

  /*充值*/
  .g-chong_zhi {
    background: #fff;
    padding-bottom: 25px;
  }

  .g-chong_zhi > h3 {
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    border-bottom: 1px solid #efefef;
    padding: 0 15px;
  }

  .g-chong_zhi > h3 i {
    color: #52abf3;
    font-size: 20px;
    margin-right: 7px;
    vertical-align: sub;
  }

  .biao_dan {
    padding: 7px 0 32px;
  }

  .biao_dan li {
    height: 32px;
    line-height: 32px;
    margin-top: 15px;
  }

  .biao_dan li label {
    float: left;
    width: 21%;
    text-align: right;
  }

  .biao_dan li select, .biao_dan li input {
    float: left;
    height: 100%;
    width: 63%;
    border: 1px solid #d3d3d3;
    box-sizing: border-box;
    padding-left: 10px;
  }

  .g-chong_zhi button {
    width: 63%;
    height: 32px;
    line-height: 32px;
    background: #f23030;
    color: #fff;
    font-size: 14px;
    border: none;
    display: block;
    margin: 0 auto;
  }

  .ji_lu {
    margin-top: 21px;
    background: #fff;
  }

  .ji_lu > h3 {
    font-size: 14px;
    height: 38px;
    line-height: 38px;
    border-bottom: 1px solid #efefef;
    padding: 0 15px;
  }

  .ji_lu > h3 i {
    color: #fb6e6b;
    font-size: 18px;
    margin-right: 7px;
  }

  .ji_lu > h3 span {
    float: right;
    color: #999;
  }

  .ming_xi li {
    height: 61px;
    border-bottom: 1px solid #efefef;
    box-sizing: border-box;
    padding: 10px 15px;
    line-height: 22px;
  }

  .ming_xi h3 i, .ming_xi h4 i {
    float: right;
  }
</style>
