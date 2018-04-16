<template>
  <div id="coupons" class="coupons">
    <!--头部-->
    <div class="g-account-top"><i class="iconfont icon-zuo" @click="goBack"></i><span>领券中心</span></div>
    <!--选项卡-->
    <!--<div class="q-card swiper-container">
      <div class="swiper-wrapper fl_box">
        <div class="swiper-slide fl" @click="choiceFl(0)" :class="{active:cate_id==0}">全部分类</div>
        <div class="swiper-slide fl" v-for="item in FL" @click="choiceFl(item.id)" :class="{active:cate_id==item.id}">
          {{item.phone_name}}
        </div>
      </div>
    </div>-->
    <!--优惠券-->
    <div class="g-quan">
      <ul>
        <li v-for="item in list">
          <div class="m-quan-box" @click="getCp(item.id,item.is_receive)">
            <div class="quan_num">
              <h3>￥<span>{{item.value}}</span></h3>
              <p>满{{item.money}}可用</p>
            </div>
            <div class="quan_title">
              <h3>{{item.condition}}</h3>
              <p>{{item.start_time}}-{{item.end_time}}</p>
              <i class="iconfont icon-shiyongzhong" v-if="item.is_receive==1"></i>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Swiper from 'swiper/dist/js/swiper.min'
  import "swiper/dist/css/swiper.min.css"
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        page: {
          index: 1,
          total: 1
        },
        cate_id: 0,
        // FL: [],
        list: [],
        isLoading: true
      }
    },
    created: function () {
      this.getCoupons();
    },
    mounted() {
      // this.getFL();
      this.isLoading = false;
      window.addEventListener('scroll', this.pullUp, false); // 加载完成激活上拉加载函数
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 选项卡
      /*choiceFl(val) {
        this.cate_id = val;
        this.getCoupons()
      },*/
      // 获取分类信息
      /*getFL() {
        this.axios.post(this.getApi('web/category'),
          this.dafa({
            type: 1,
            num: ''
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.FL = res.data.list;
            this.$nextTick(() => {
              let swiper = new Swiper('.swiper-container', {
                slidesPerView: 4
              })
            })
          }
        })
      },*/
      // 获取优惠券列表
      getCoupons(add) {
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/coupon_center'),
          this.dafa({
            index: this.page.index,
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            cate_id: this.cate_id
          })
        ).then(res => {
          if (res.data.code === 0) {
            add ? this.list = this.lisList.concat(res.data.list) : this.list = res.data.list; //传值合并 无值覆盖
            this.page.index = res.data.fy_pgCur;
            this.page.total = res.data.fy_pgCount;
          }
        })
      },
      // 领取优惠券
      getCp(id, tp) {
        if (tp === 0) {
          this.axios.post(this.getApi('web/receive_coupon'),
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token,
              temp_id: id
            })
          ).then(res => {
            this.$message(res.data.msg);
            if (res.data.code === 0) {
              this.getCoupons()
            }
          })
        }
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('coupons').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.total) {
          that.page.index++;
          that.getCoupons(true); //加载更多
        }
      }
    },
    beforeDestroy() {
      // 解除滚动事件绑定
      window.removeEventListener("scroll", this.pullUp, false);
    },
    components: {Swiper, Load}
  }
</script>

<style scoped>
  .coupons {
    padding-bottom: 30px;
    background-color: #f0f0f0;
  }

  /*头部*/
  .g-account-top {
    width: 100%;
    height: 45px;
    line-height: 45px;
    background-color: #fff;
    padding: 0 10px;
    box-sizing: border-box;
    font-size: 16px;
    position: relative;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
  }

  .g-account-top i {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 40px;
    height: 40px;
  }

  .q-card {
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
  }

  .fl_box {
    height: 40px;
  }

  .fl {
    display: inline-block;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .active {
    /*border-bottom: 2px solid #f12b2c;*/
    color: #f51322;
  }

  /*优惠券*/
  .g-quan {
    padding: 0 15px;
  }

  .m-quan-box {
    margin-top: 15px;
    height: 80px;
    display: flex;
    background-color: #fff;
    font-size: 14px;
  }

  .quan_num {
    padding-top: 5px;
    flex: 3.2;
    background-color: #fd5555;
    color: #fff;
    text-align: center;
    overflow: hidden;
  }

  .quan_num h3 span {
    font-size: 24px;
  }

  .quan_title {
    overflow: hidden;
    flex: 6.8;
    padding: 7px 40px 0 12px;
    position: relative;
  }

  .quan_title > i {
    position: absolute;
    top: -8px;
    right: 15px;
    font-size: 44px;
    color: #999;
  }

  .quan_title h3 {
    line-height: 21px;
    height: 42px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
  }

  .quan_title p {
    color: #999;
    font-size: 12px;
    margin-top: 3px;
  }
</style>
