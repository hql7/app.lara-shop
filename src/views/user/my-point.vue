<template>
  <div id="point" class="point">
    <!--头部-->
    <div class="g-collection-head">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <span>我的积分</span>
    </div>
    <!--积分-->
    <div class="pt-num">
      当前<span>{{info.point}}</span>积分
    </div>
    <!--文案-->
    <div class="pt-writer">
      <div class="pw-pink">
        <h3>购物送积分</h3>
        <p>购得多送的积分越多</p>
      </div>
      <div class="pw-yellow">
        <h3>积分超值购</h3>
        <p>小积分换大折扣</p>
      </div>
    </div>
    <!--记录-->
    <div class="pw-log">
      <h3>积分明细</h3>
      <ul>
        <li v-for="item in lisList">
          <p class="c-333"><label>订单编号：</label>{{item.order_no}}</p>
          <h3 class="c-999"><label>备注：</label>{{item.intro}}</h3>
          <p>
            <span>余额{{item.point_log}}</span>&nbsp;&nbsp;
            <span>{{item.point}}</span>
          </p>
          <p><span>{{item.time}}</span></p>
        </li>
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
        lisList: [],
        info: {
          point: 0 // 积分
        },
        page: {
          index: 1,
          total: 1
        }, // 分页信息
        type: 0, // 类型  0=全部  1=下单赠送积分  2=下单消费  3=订单退货  4=退款  7=币种转换
        isLoading: true
      }
    },
    created: function () {
      this.get_attention();
      this.getPoint()
    },
    mounted: function () {
      window.addEventListener('scroll', this.pullUp, false);
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取我的积分
      getPoint() {
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
      // 获取我的积分明细
      get_attention: function (add) {
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/point_log'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            index: this.page.index,
            type: this.type
          })
        ).then(res => {
          if (res.data.code === 0) {
            add ? this.lisList = this.lisList.concat(res.data.list) : this.lisList = res.data.list; //传值合并 无值覆盖
            this.page.index = res.data.fy_pgCur;
            this.page.total = res.data.fy_pgCount;
          } else {
            this.$message(res.data.msg)
          }
        })
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('point').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.total) {
          that.page.index++;
          that.get_attention(true); //加载更多
        }
      }
    },
    beforeDestroy() {
      // 解除滚动事件绑定
      window.removeEventListener("scroll", this.pullUp, false);
    },
    components: {Load}
  }
</script>

<style scoped>
  .point {
    padding-top: 50px;
  }

  /*头部*/
  .g-collection-head {
    position: fixed;
    top: 0;
    left: 50%;
    z-index: 9;
    transform: translateX(-50%);
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e1e1e1;
    box-sizing: border-box;
    background-color: #fff;
    padding: 0 10px;
    text-align: center;
    font-size: 16px;
  }

  .g-collection-head i {
    float: left;
  }

  /*积分*/
  .pt-num {
    height: 100px;
    text-align: center;
    color: #fff;
    font-size: 18px;
    background: url("../../assets/imgs/point-bj.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
    padding-top: 23px;
    box-sizing: border-box;
  }

  .pt-num > span {
    font-size: 32px;
    font-weight: bold;
  }

  /*文案*/
  .pt-writer {
    border-top: 10px solid #f4f4f4;
    padding: 15px;
    text-align: center;
    overflow: hidden;
  }

  .pt-writer > div {
    float: left;
    width: 46%;
    height: 60px;
    border-radius: 3px;
    margin: 0 2%;
  }

  .pw-pink {
    background-color: #fee7f7;
  }

  .pw-yellow {
    background-color: #fdf4cc;
  }

  .pt-writer h3 {
    font-size: 14px;
    color: #333;
    margin-top: 7px;
    margin-bottom: 2px;
  }

  .pw-log > h3 {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    line-height: 30px;
    padding: 0 15px 5px;
    border-bottom: 1px solid #efefef;
  }

  .pw-log li {
    padding: 15px;
    line-height: 25px;
    border-bottom: 1px solid #efefef;
  }

  .pw-log li p strong {
    float: right;
  }

  .pw-log strong > span {
    margin-right: 5px;
  }

</style>
