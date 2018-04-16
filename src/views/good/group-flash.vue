<template>
  <div class="group-flash" id="group-flash">
    <!-- 头部 -->
    <div class="header"><i class="iconfont icon-zuo" @click="goBack"></i>
      <template v-if="type == 0">团购商品</template>
      <template v-else>限时抢购</template>
    </div>
    <!-- 分类 -->
    <div class="kindList swiper-container">
      <div class="swiper-wrapper fl">
        <div class="swiper-slide" @click="choiceFL(0)" :class="{active:cid==0}">全部商品</div>
        <div class="swiper-slide" v-for="item in flashSale" @click="choiceFL(item.id)" :class="{active:cid==item.id}">
          {{item.phone_name}}
        </div>
      </div>
    </div>
    <!-- 商品 -->
    <ul class="goods" v-for="good in goodsList">
      <li>
        <div class="pic"><img :src="good.img" alt="good"></div>
        <div class="goodsDespriction">
          <h3 class="goodsName">{{good.title}}</h3>
          <p><span class="price">￥{{good.sale_price}}</span>
            <del class="oldPrice"><i>￥</i>{{good.sell_price}}</del>
          </p>
          <p class="sales">已售{{(good.sell_num / good.max_num * 100).toFixed(2)}}%
            <!--<span><i :style="{width:good.sell_num/good.max_num*100+'px'}"></i></span>-->
            <button class="buy" v-if="good.sell_num < good.max_num" @click="toBuy(good.id)">立即抢购</button>
            <button class="dis-buy" v-else>已抢完</button>
          </p>
        </div>
      </li>
    </ul>
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
        flashSale: [],
        goodsList: [],
        cid: 0,
        page: {
          index: 1,
          total: 1
        },
        type: this.$route.query.t,
        isLoading: true
      }
    },
    created() {
      this.getGoodsList()
    },
    mounted() {
      this.getFlashList();
      window.addEventListener('scroll', this.pullUp, false); // 加载完成激活上拉加载函数
    },
    methods: {
      // 返回
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取分类列表
      getFlashList() {
        this.axios.post(this.getApi('web/category'),
          this.dafa({
            type: 1,
            num: ''
          })
        ).then((res) => {
          this.flashSale = res.data.list;
          this.$nextTick(function () {
            let swiper = new Swiper(".swiper-container", {  //激活轮播
              slidesPerView: 4,
              observer: true,//修改swiper自己或子元素时，自动初始化swiper
              observeParents: true//修改swiper的父元素时，自动初始化swiper
            });
          })
        })
      },
      // 选择分类
      choiceFL(val) {
        this.cid = val;
        this.page.index = 1;
        this.getGoodsList();
      },
      // 获取商品列表
      getGoodsList(add) {
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/group_flash_buy'),
          this.dafa({
            type: this.type,
            category_id: this.cid,
            index: this.page.index
          })
        ).then((res) => {
          add ? this.goodsList = this.goodsList.concat(res.data.list) : this.goodsList = res.data.list; //合并还是覆盖
          this.page.index = res.data.fy_pgCur;
          this.page.total = res.data.fy_pgCount;
          this.isLoading = false
        })
      },
      // 立即抢购
      toBuy(id) {
        this.$router.push({path: '/products', query: {id: id}})
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('group-flash').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.total) {
          that.page.index++;
          that.getGoodsList(true); //加载更多
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
  .group-flash {
    padding-top: 50px;
  }

  .header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #f51322;
    font-size: 16px;
    background-color: #fff;
    border-bottom: 1px solid #ededed;
  }

  .header i {
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .kindList {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #ededed;
  }

  .fl div {
    padding: 0 15px;
    box-sizing: border-box;
  }

  /*  .kindList ul {
      float: left;
      height: 50px;
      line-height: 48px;
      padding: 0 10px;
    }

    .kindList ul li {
      padding: 0 15px;
      font-size: 14px;
      color: #333333;
      text-align: center;
    }*/

  .active {
    /*border-bottom: 2px solid #f12b2c;*/
    color: #f51322;
  }

  /*  .kindList .pull {
      position: absolute;
      right: 0;
      width: 1.4rem;
      text-align: center;
      border-left: 0.02rem solid #ededed;
    }

    .kindList .pull img {
      background-size: 0.11rem 0.06rem;
    }*/

  .goods {
  }

  .goods> li {
    padding: 15px 10px;
    border-bottom: 1px solid #ededed;
    height: 100px;
  }

  .goods .pic {
    float: left;
    width: 90px;
    height: 100%;
  }

  .pic img {
    width: 100%;
    height: 100%;
  }

  .goodsDespriction {
    margin-left: 100px;
  }

  .goodsName {
    height: 40px;
    line-height: 20px;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .buy {
    position: absolute;
    top: -7px;
    right: 0;
    height: 30px;
    line-height: 30px;
    width: 80px;
    text-align: center;
    font-size: 14px;
    background-color: #f51322;
    color: #fff;
    border: none;
    box-sizing: border-box;
    border-radius: 3px;
  }

  .dis-buy {
    position: absolute;
    top: -7px;
    right: 0;
    height: 30px;
    line-height: 30px;
    width: 80px;
    text-align: center;
    font-size: 14px;
    background-color: #ddd;
    color: #999;
    border: none;
    box-sizing: border-box;
    border-radius: 3px;
  }

  /*.salesCase {
    position: relative;
    height: 24px;
    line-height: 24px;
  }

  .salesCase .price {
    position: absolute;
    top: 0;
    left: 0;
    color: #f12b2c;
    font-size: 16px;
  }

  .salesCase i {
    font-size: 10px;
  }

  .salesCase .oldPrice {
    margin-left: 2px;
    color: #999999;
    font-size: 13.33px;
  }

  .salesCase .sales {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 13.33px;
    color: #999999;
  }

  .salesCase .sales span {
    position: relative;
    display: inline-block;
    width: 2.6rem;
    height: 12px;
    border: 1px solid #ff6771;
    border-radius: 7.5px;
    vertical-align: -1px;
    margin-left: 2px;
    overflow: hidden;
  }

  .salesCase .sales span i {
    position: absolute;
    height: 12px;
    background-color: #ff9a9b;
  }*/

  .price {
    color: #f51322;
    font-size: 16px;
    font-weight: bold;
  }

  .oldPrice {
    margin-left: 2px;
    color: #999999;
    font-size: 12px;
  }

  .sales {
    margin-top: 10px;
    color: #999999;
    position: relative;
  }

  .sales span {
    position: relative;
    display: inline-block;
    width: 2.6rem;
    height: 12px;
    border: 1px solid #ff6771;
    border-radius: 7.5px;
    vertical-align: -1px;
    margin-left: 2px;
    overflow: hidden;
  }

  .sales span i {
    position: absolute;
    height: 12px;
    background-color: #ff9a9b;
  }
</style>
