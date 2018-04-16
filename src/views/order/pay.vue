<template>
  <div id="pay">
    <div class="header"><i class="iconfont icon-zuo" @click="go_back"></i>确认支付</div>
    <div class="mian">
      <div class="money"><span>选择支付方式</span><span>应付金额:<i>{{order.real_price}}元</i></span></div>
      <ul class="pay-ul">
        <li v-for="(item,index) in pay_mode" @click="choicePayMode(item.id)">
          <img :src="item.logo" alt="logo">{{item.name}}
                    <i v-if="pay_id==item.id" class="iconfont icon-xuanzhong"></i><i
          v-else class="iconfont icon-iconziti50"></i></li>
      </ul>
      <div class="pw"><input type="password" v-model="password" placeholder="请输入交易密码"></div>
      <div class="money"><span>实付金额:<i>{{order.real_price}}元</i></span></div>
      <div class="to_pay" @click="safeCheck">确认支付</div>
    </div>
    <!--隐藏域 用于支付宝跳转-->
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        pay_mode: [], // 支付方式
        order: this.getobjS('order'), // 订单信息
        pay_id: null, // 所选支付方式
        password: "", // 交易密码
        type: "", // 订单类型
        zfb: '222',
        isLoading: true
      }
    },
    created() {
      this.estimateOrderType();
      this.getPayMode()
    },
    mounted: function () {
    },
    methods: {
      // 后退 pay后指向待付款订单或充值中心
      go_back: function () {
        // this.$router.go(-1)
        this.$router.push({path: '/my-order', query: {s: 1}})
      },
      // 判断订单类型
      estimateOrderType() {
        let reg = /^C_/.test(this.order.no);
        this.type = reg ? 1 : 0;
      },
      // 获取支付方式
      getPayMode() {
        this.axios.post(this.getApi('web/pay_type'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            type: this.type
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            this.pay_mode = res.data.pay_type
          }
        }).catch(err => {
          this.isLoading = false
        })
      },
      // 选择支付方式
      choicePayMode(id) {
        this.pay_id = id
      },
      // 安全校验
      safeCheck() {
        let safepass = /^[\S]{6,18}$/.test(this.password);
        if (this.pay_id !== null) {
          if (safepass) {
            this.isLoading = true;
            this.axios.post(this.getApi('web/token'),
              this.dafa({
                user_id: this.getobjS('user').id,
                token: this.getobjS('user').token
              })
            ).then(res => {
              if (res.data.code === 0) {
                this.submitPay()
              } else {
                this.$message(res.data.code)
              }
            }).catch(err => {
              // console.log(err);
              this.$message('请重试')
            })
          } else {
            this.$message('密码为6-18位非空字符！')
          }
        } else {
          this.$message('请选择支付方式！')
        }
      },
      // 提交支付
      submitPay() {
        this.axios.post(this.getApi('web/pay_order'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            safepass: this.password,
            order_no: this.order.no,
            pay_id: this.pay_id,
            pay_type: this.seePayType(),
            pay_way: 1
          })
        ).then(res => {
          this.isLoading = false;
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            if (this.pay_id === 1) {
              this.$message(res.data.msg);
              this.$router.push({path: '/my-order', query: {s: 2}})
            } else {
              // 当调用支付宝或微信时 msg参数会是一个跳转地址
              const div = document.createElement('div'); // 创建div
              div.innerHTML = res.data.msg; // 将返回的form 放入div
              document.body.appendChild(div);
              document.forms[0].submit();
            }
          } else if (res.data.code === 6) {
            location.href = res.data.msg;
          } else {
            this.$message(res.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.isLoading = false;
          this.$message('请重试');
        })
      },
      // 观察支付
      seePayType(){
        let type = '';
        switch (this.pay_id) {
          case 2:
            type = 1;
            break;
          case 3:
            type = 2;
            break;
        }
        return type
      }
    },
    components: {Load}
  }
</script>

<style scoped>
  body {
    background: #f1f2f7;
  }

  .header {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    position: relative;
    background: #fff;
    border-bottom: 1px solid #e1e1e1;
  }

  .header i {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 40px;
    height: 40px;
  }

  .mian {
    margin-top: 12px;
    background: #fff;
    padding-bottom: 54px;
  }

  .money {
    height: 60px;
    line-height: 60px;
    padding: 0 25px;
    border-bottom: 1px solid #f8f8f8;
  }

  .money span:nth-child(1) {
    color: #999;
  }

  .money span:nth-child(2) {
    float: right;
    color: #333;
  }

  .money span i {
    color: #f40000;
  }

  .mian li {
    line-height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid #f2f2f2;
  }

  .to_pay {
    height: 40px;
    width: 90%;
    line-height: 40px;
    text-align: center;
    background: #f40000;
    color: #fff;
    margin: 54px auto 0;
    font-size: 14px;
  }

  .pay-ul {
    margin-bottom: 20px;
  }

  .pay-ul li i {
    float: right;
    color: #f40000;
  }

  .pay-ul li img {
    width: 35px;
    margin: 7px 10px 0 0;
    height: 35px;
    float: left;
  }

  .pw {
    padding: 0 15px;
    margin-bottom: 20px;
  }

  .pw input {
    width: 100%;
    height: 42px;
    line-height: 42px;
    box-sizing: border-box;
    border: 1px solid #e1e1e1;
    padding-left: 10px;
  }

  .zfb {
    display: none;
  }
</style>
