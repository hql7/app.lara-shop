<template>
  <div id="account">
    <!--头部-->
    <div class="g-account-top"><i class="iconfont icon-zuo1" @click="goBack"></i><span>账户余额</span>
      <router-link to="/log" tag="b"
                   class="u-right">明细
      </router-link>
    </div>
    <!--上部-->
    <div class="bal-top">
      <h3>余额账户（元）</h3>
      <p>{{info.balance}}</p>
    </div>
    <!--下部-->
    <div class="bal-btm">
      <ul>
        <li><i class="iconfont icon-dongjie2 c-f54d13"></i><span>冻结余额</span> <b
          class="u-right">￥{{info.freeze_balance}}</b></li>
        <router-link to="/recharge" tag="li"><i class="iconfont icon-chongzhi3 c-00aaff"></i><span>账户充值</span> <i
          class="iconfont icon-icon u-right"></i></router-link>
        <router-link to="/withdrawals" tag="li"><i class="iconfont icon-qianbao4 c-faa100"></i><span>余额提现</span> <i
          class="iconfont icon-icon u-right"></i></router-link>
      </ul>
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
          balance: 0.00,
          freeze_balance: 0.00
        },
        isLoading: true
      }
    },
    created: function () {
      this.getBalanceInfo()
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
      }
    },
    components: {Load}
  }
</script>

<style scoped>
  /*头部*/
  .g-account-top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .g-account-top > i {
    display: inline-block;
    width: 30px;
    height: 40px;
    font-size: 20px;
  }

  .g-account-top > span {
    padding-left: 10px;
    border-left: 1px solid #ffbcce;
    font-size: 16px;
  }

  /*上部*/
  .bal-top {
    height: 7.4rem;
    background: linear-gradient(to right, #fa4f7d, #fb3f5e);
    color: #fff;
    padding: 2.5rem 15px 0;
    box-sizing: border-box;
  }

  .bal-top > h3 {
    margin-bottom: 1rem;
    color: #ffdce3;
  }

  .bal-top > p {
    font-size: 36px;
    font-weight: bold;
  }

  /*下部*/
  .bal-btm li {
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    border-bottom: 1px solid #e4e4e4;
    padding: 0 15px;
  }

  .bal-btm span {
    margin-left: 10px;
    color: #333;
    vertical-align: 2px;
  }

  .c-f54d13 {
    color: #f54d13;
    font-size: 20px;
  }

  .c-00aaff {
    color: #00aaff;
    font-size: 20px;
  }

  .c-faa100 {
    color: #faa100;
    font-size: 20px;
  }
</style>
