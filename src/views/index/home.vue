<template>
  <div class="g-home">
    <!--头部-->
    <div class="head" ref="head">
      <div class="m-logo">
        <div class="u-caidan" id="snap" @click="global.msg()">
          <i class="iconfont icon-saoerweima"></i>
        </div>
        <div class="u-search">
          <!--<a href="good.html"></a>-->
          <router-link to="/search"><input readonly placeholder="搜索你想要的商品">
            <i class="iconfont icon-fangdajing"></i></router-link>
        </div>
        <div class="u-news">
          <i class="iconfont icon-xiaoxi" @click="to_msg"></i>
        </div>
      </div>
    </div>
    <!--轮播区-->
    <div class="g-ban">
      <div class="swiper-container swiper-container1">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in bans" @click="to_product(item.link)">
            <img :src="item.img" :alt="item.name" :title="item.name">
          </div>
        </div>
        <!-- Add Pagination -->
        <!--<div class="swiper-pagination u-dian swiper-p1"></div>-->
      </div>
    </div>
    <!--导航区-->
    <div class="g-leiList">
      <div class="m-leiList-box list1">
        <div v-for="item in leiList">
          <router-link :to="item.link">
            <p><img :src="item.img" alt=""></p>
            <p>{{item.name}}</p>
          </router-link>
        </div>
      </div>
    </div>
    <!--滚动广告-->
    <div class="g-roll" @click="to_wenzhang">
      <div class="m-rollTitle">商城 <span>快报</span></div>
      <div class="m-rollContent swiper-container swiper-container2 swiper-no-swiping">
        <ul class="swiper-wrapper m-rollLi">
          <li v-for="item in tuijian" ref="tui" class="swiper-slide">
            <span>HOT</span>{{item.title}}
          </li>
        </ul>
      </div>
      <div class="m-rollMore">
        <span>更多</span>
      </div>
    </div>
    <!--推荐模块-->
    <!--<div class="g-module">
      <div class="m-module-heng" v-for="item in jing_pin">
        <div>
          <h3>{{item.title}}</h3>
          <p>{{item.content}}</p>
        </div>
        <img :src="item.img" alt="">
      </div>
    </div>-->
    <!--广告条-->
    <div class="g-advert swiper-container3">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in advert">
          <router-link :to="item.link"><img :src="item.img" :alt="item.name" :title="item.name">
          </router-link>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
    <!--商品列表区-->
    <div class="g-title" v-if="flash_goods"><span></span>限时抢购<span></span></div>
    <div class="g-goods-list gd-list" v-if="flash_goods">
      <ul class="g-goods">
        <li v-for="item in flash_goods">
          <router-link :to="'/products?id='+item.id">
            <div>
              <img :src="item.img" alt="商品">
              <p class="u-jieshao">{{item.name}}</p>
              <p class="u-jiage"><span>￥{{item.flash_price}}</span><s>￥{{item.sell_price}}</s></p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <!--热卖精选-->
    <div class="g-title jing_xuan" v-if="hot_goods"><span></span>热卖精选<span></span></div>
    <div class="g-goods-list gd-list" v-if="hot_goods">
      <ul class="g-goods">
        <li v-for="item in hot_goods">
          <router-link :to="'/products?id='+item.id">
            <div>
              <img :src="item.img" alt="商品">
              <p class="u-jieshao">{{item.name}}</p>
              <p class="u-jiage"><span>￥{{item.sell_price}}</span></p>
              <!--<p class="u-ping_jia"><span>评价&nbsp;{{item.reviews_num}}</span></p>-->
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <!--商品分区展示-->
    <div v-for="item in module_goods">
      <div class="g-title">
        <router-link :to="'/search?cid='+item.cate_id"><span></span>{{item.floor_name}}<span></span></router-link>
      </div>
      <div class="g-goods-list gd-list">
        <ul class="g-goods">
          <li v-for="ite in item.goods">
            <router-link :to="'/products?id='+ite.id">
              <div>
                <img :src="ite.img" alt="商品">
                <p class="u-jieshao">{{ite.name}}</p>
                <p class="u-jiage"><span>￥{{ite.sell_price}}</span></p>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!--商品列表区-->
    <div class="g-title"><span></span>为你推荐<span></span></div>
    <div class="g-goods-list">
      <ul class="g-goods">
        <li v-for="item in forYou">
          <router-link :to="'/products?id='+item.id">
            <div>
              <img :src="item.img" alt="商品">
              <p class="u-jieshao">{{item.name}}</p>
              <p class="u-jiage"><span>￥{{item.sell_price}}</span></p>
              <p class="u-ping_jia"><span>评价&nbsp;{{item.reviews_num}}</span></p>
            </div>
          </router-link>
        </li>
      </ul>
      <p>没有更多了~</p>
    </div>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>
<script>
  // 导入所需组件
  import Swiper from 'swiper/dist/js/swiper.min'
  import "swiper/dist/css/swiper.min.css"
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        bans: [], //banner
        leiList: [], //主页导航
        tuijian: [], //商城快讯
        advert: [{
          img: '',
          name: '',
          type: 0,
          link: ''
        }], //广告条
        hot_goods: [], // 热销
        flash_goods: [], // 限时抢购
        module_goods: [], // 分区展示
        forYou: [], //为你推荐
        opctipy: 0, //头部透明度
        isLoading: true
      }
    },
    mounted() {
      // 获取轮播广告数据
      this.getBanner();
      // 获取商城快讯数据
      this.getNotice();
      // 头部滑动效果
      window.addEventListener('scroll', this.slideShow, false)
    },
    created() {
      // 定位当前tab
      this.$store.commit('setIndexRouter', 0);
      // 获取导航
      this.getClassifyIcon();
      // 获取推荐商品
      this.getGoods();
      // 获取热销商品
      this.getHotGoods();
      // 获取限时抢购
      this.getFalshGoods();
      // 获取分类展示
      this.getModuleGoods();
      // 获取广告条
      this.getAdvert();
    },
    methods: {
      // 获取轮播广告数据
      getBanner() {
        this.axios.post(this.getApi('web/ad_position'),
          `type=2`
        ).then(res => {
          // 关闭load
          this.isLoading = false;
          if (res.data.code === 0) {
            if (res.data.list.length > 0) {
              this.bans = res.data.list;
              // 激活轮播
              this.$nextTick(() => {
                let swiper = new Swiper('.swiper-container1', {
                  autoplay: {
                    delay: 3000
                  },
                  pagination: '.swiper-p1',
                  slidesPerView: 1,
                  loop: true,
                  observer: true, // 修改swiper自己或子元素时，自动初始化swiper
                  observeParents: true // 修改swiper的父元素时，自动初始化swiper
                })
              })
            }
          }
        }).catch(err => {
          this.isLoading = false
        })
      },
      // 获取主页分类图标
      getClassifyIcon() {
        this.axios.post(this.getApi('web/nav')
        ).then(res => {
          if (res.data.code === 0) {
            let box = res.data.list;
            box.forEach(item => {
              item.link = item.link.replace(/.html/g, '');
            });
            this.leiList = box;
          }
        })
      },
      // 获取商城快讯数据
      getNotice() {
        this.axios.post(this.getApi('web/notice')
        ).then((response) => {
          if (response.data.code === 0) {
            this.tuijian = response.data.notice;
            //激活轮播
            this.$nextTick(() => {
              let swiper2 = new Swiper('.swiper-container2', {
                autoplay: {
                  delay: 2000
                },
                direction: 'vertical',
                slidesPerView: 1,
                noSwipingClass: 'swiper-no-swiping',
                loop: true,
                initialSlide: 0,
                observer: true, // 修改swiper自己或子元素时，自动初始化swiper
                observeParents: true // 修改swiper的父元素时，自动初始化swiper
              })
            })
          }
        })
      },
      // 获取热销商品
      getHotGoods() {
        this.axios.post(this.getApi('web/hot_sale')
        ).then((res) => {
          if (res.data.code === 0) {
            this.hot_goods = res.data.list
          }
        })
      },
      // 获取广告条
      getAdvert() {
        this.axios.post(this.getApi('web/ad_position'),
          `type=7`
        ).then(res => {
          if (res.data.code === 0) {
            if (res.data.list.length > 0) {
              this.advert = res.data.list;
              this.$nextTick(() => {
                let swiperAD = new Swiper('.swiper-container3', {
                  autoplay: {
                    delay: 4000
                  },
                  pagination: {
                    el: '.swiper-pagination',
                  },
                  loop: true,
                  observer: true, // 修改swiper自己或子元素时，自动初始化swiper
                  observeParents: true // 修改swiper的父元素时，自动初始化swiper
                })
              })
            }
          }
        })
      },
      // 获取推荐商品
      getGoods() {
        this.axios.post(this.getApi('web/guess_you_like'),
          this.dafa({
            type: 0,
            num: 20,
            user_id: this.getobjS('user') ? this.getobjS('user').id : '',
            token: this.getobjS('user') ? this.getobjS('user').token : '',
          })
        ).then((response) => {
          if (response.data.code === 0) {
            this.forYou = response.data.list
          }
        })
      },
      // 获取限时抢购
      getFalshGoods() {
        this.axios.post(this.getApi('web/flash_sale')
        ).then(res => {
          if (res.data.code === 0) {
            this.flash_goods = res.data.list
          }
        })
      },
      // 获取分类展示
      getModuleGoods() {
        this.axios.post(this.getApi('web/floor_sale')
        ).then(res => {
          if (res.data.code === 0) {
            this.module_goods = res.data.list
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 去文章中心
      to_wenzhang: function () {
        this.$router.push('/article?t=0')
      },
      // 去消息
      to_msg: function () {
        this.$router.push('/message')
      },
      // 去首页轮播商品
      to_product: function (link) {
        console.log(link.replace(/goods.html/g, 'products'));
        this.$router.push(link.replace(/goods.html/g, 'products'))
      },
      // 头部滑动效果
      slideShow() {
        // let top = document.body.scrollTop;
        let top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if ((top / 380) >= 1) {
          this.opctipy = 1
        } else if ((top / 380) <= 0.2) {
          this.opctipy = 0
        } else {
          this.opctipy = (top / 380).toFixed(2)
        }
        this.$refs.head.style.background = 'rgba(255,49,49,' + this.opctipy + ')'
      }
    },
    beforeDestroy() {
      // 解除滚动事件绑定
      window.removeEventListener("scroll", this.slideShow, false);
    },
    components: {Swiper, Load}
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /*头部*/
  .head {
    height: 50px;
    width: 100%;
    margin: 0 auto;
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    background-color: rgba(255, 49, 79, 0);
    padding: 10px 0;
    box-sizing: border-box;
  }

  .m-logo {
    height: 100%;
    line-height: 30px;
  }

  .m-logo i {
    display: inline-block;
    text-align: center;
    line-height: 28px;
    font-size: 26px;
    height: 100%;
    color: #fff;
  }

  .u-caidan, .u-news {
    width: 13%;
    height: 100%;
    float: left;
    text-align: center;
  }

  .u-search {
    width: 74%;
    border-radius: 7px;
    border: 1px solid #fff;
    background-color: rgba(255, 255, 255, .86);
    float: left;
    height: 100%;
    box-sizing: border-box;
  }

  .u-search input {
    float: left;
    border: none;
    width: 80%;
    outline: none;
    background-color: transparent;
    box-sizing: border-box;
    height: 30px;
    line-height: 30px;
    padding: 3px 10px;
  }

  .u-search i {
    float: left;
    display: inline-block;
    width: 20%;
    font-size: 22px;
    line-height: 28px;
    text-align: center;
    color: #999;
  }

  /*---------------------------------------------------------*/
  /*轮播区*/
  .g-ban {
    width: 100%;
    height: 9rem;
    overflow: hidden;
  }

  .g-ban > div {
    height: 100%;
  }

  .u-dian span {
    background-color: #ea504e;
  }

  /*
    .g-ban ul, .g-ban li {
      height: 170px;
    }

    .g-ban li {
      float: left;
    }*/

  .g-ban img {
    width: 100%;
    height: 100%;
  }

  /*----------------------------------------------------------*/
  /*分类列表*/
  .g-leiList {
    width: 100%;
    height: 150px;
    padding: 10px;
    box-sizing: border-box;
    justify-content: space-between;
    background-color: #f1f2f4;
    position: relative;
  }

  .m-leiList-box {
    box-shadow: 0 -2px 3px rgba(208, 186, 194, 0.5);
    width: 94%;
    margin: 0 auto;
    height: 180px;
    position: absolute;
    top: -42px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    z-index: 11;
    padding: 15px 0;
    box-sizing: border-box;
  }

  .m-leiList-box div {
    width: 25%;
    height: 50%;
    float: left;
    margin-bottom: 7px;
    text-align: center;
    color: #051B28;
  }

  .m-leiList-box img {
    width: 100%;
    height: 100%;
  }

  .m-leiList-box div p:nth-child(1) {
    width: 45px;
    height: 45px;
    line-height: 45px;
    overflow: hidden;
    border-radius: 50%;
    margin: 0 auto 5px;
  }

  .g-leiList i {
    color: #fff;
    font-size: 24px;
  }

  /*.list1 div:nth-child(1) p:nth-child(1) {
    background-color: #ff6f15;
  }

  .list1 div:nth-child(2) p:nth-child(1) {
    background-color: #b34bff;
  }

  .list1 div:nth-child(3) p:nth-child(1) {
    background-color: #24c1f4;
  }

  .list1 div:nth-child(4) p:nth-child(1) {
    background-color: #11de89;
  }

  .list1 div:nth-child(5) p:nth-child(1) {
    background-color: #79d52d;
  }

  .list1 div:nth-child(6) p:nth-child(1) {
    background-color: #fe3967;
  }

  .list1 div:nth-child(7) p:nth-child(1) {
    background-color: #ff9c00;
  }

  .list1 div:nth-child(8) p:nth-child(1) {
    background-color: #07b9ff;
  }
*/
  /*.list1 div:nth-child(9) p:nth-child(1) {
    background-color: #f04b2b;
  }

  .list1 div:nth-child(10) p:nth-child(1) {
    background-color: #00c87c;
  }*/

  /*--------------------------------------------------------------------*/
  /*滚动广告*/
  .g-roll {
    width: 100%;
    height: 36px;
    line-height: 36px;
    background-color: #fff;
    overflow: hidden;
    display: flex;
    color: #333;
    border-bottom: 10px solid #f1f2f4;
  }

  .m-rollTitle {
    width: 30%;
    height: 100%;
    text-align: center;
  }

  .m-rollTitle span {
    padding: 2px 7px;
    background-color: #ff6e18;
    border-radius: 5px;
    color: #fff;
  }

  .m-rollContent {
    width: 55%;
    height: 100%;
  }

  .m-rollMore {
    width: 15%;
    text-align: center;
  }

  .m-rollMore span {
    border-left: 1px solid #cbcbcb;
    padding-left: 10px;
  }

  .m-rollContent .m-rollLi {
    width: 95%;
    height: 38px;
    line-height: 38px;
  }

  .m-rollContent li {
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .m-rollContent span {
    color: #ff6e18;
    margin-right: 5px;
  }

  /*---------------------------------------------------------------*/
  /*推荐模块*/
  .g-module {
    display: flex;
    flex-wrap: wrap
  }

  .g-module > div:nth-child(-n+2) {
    width: 50%;
    height: 4rem;
  }

  .g-module > div:nth-last-child(-n+3) {
    width: 33.33%;
    height: 5rem;
    text-align: center;
  }

  .m-module-heng {
    overflow: hidden;
    padding: 0.5rem;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    box-sizing: border-box;
    position: relative;
  }

  .m-module-heng:nth-child(-n+2) > div {
    /*float: left;*/
    width: 48%;
    padding-right: 5px;
    box-sizing: border-box;
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .m-module-heng:nth-child(-n+2) > img {
    width: 45%;
    height: 100%;
    float: right;
  }

  .m-module-heng:nth-last-child(-n+3) > img {
    margin-top: 0.45rem;
    width: 95%;
    height: 2.3rem;
  }

  .m-module-heng h3 {
    font-size: 16px;
  }

  .m-module-heng p {
    line-height: 0.65rem;
    font-size: 12px;
  }

  .m-module-heng:nth-child(1) h3 {
    color: #ffba6b;
  }

  .m-module-heng:nth-child(2) h3 {
    color: #6e34c5;
  }

  .m-module-heng:nth-child(3) h3 {
    color: #de234c;
  }

  .m-module-heng:nth-child(4) h3 {
    color: #00bd6f;
  }

  .m-module-heng:nth-child(5) h3 {
    color: #f39e00;
  }

  /*---------------------------------------------------------------*/
  /*广告条*/
  .g-advert {
    width: 100%;
    padding: 5px 0;
    background-color: #f1f2f4;
    height: 3.5rem;
  }

  .swiper-container3 {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .g-advert img {
    width: 100%;
    height: 100%;
  }

  /*热卖精选*/
  .g-jing_xuan {
    padding: 0.35rem 0 0.2rem;
    border-bottom: 7px solid #f1f2f4;
  }

  .g-jing_xuan ul {
    overflow: hidden;
  }

  .g-jing_xuan li {
    float: left;
    background-color: #f5f5f5;
    width: 24%;
    height: 4.5rem;
    margin-bottom: 10px;
    margin-right: 1.33%;
    padding: 0.45rem 0.25rem;
    box-sizing: border-box;
  }

  .g-jing_xuan li:nth-child(4), .g-jing_xuan li:nth-child(8) {
    margin-right: 0;
  }

  .g-jing_xuan a {
    display: block;
    text-align: center;
  }

  .g-jing_xuan h3 {
    font-size: 14px;
    color: #333;
  }

  .g-jing_xuan p {
    font-size: 12px;
    color: #999;
  }

  .g-jing_xuan li img {
    margin-top: 0.35rem;
    width: 100%;
    height: 2rem;
  }

  /*商品列表区*/
  .g-goods-list {
    width: 100%;
    background-color: #f5f5f5;
    overflow: hidden;
    padding-bottom: 75px;
  }

  .gd-list {
    padding-bottom: 10px;
  }

  .g-goods {
    width: 100%;
    overflow: hidden;
  }

  .g-title {
    width: 100%;
    font-weight: bold;
    background-color: #fff;
    text-align: center;
    line-height: 1.2rem;
    font-size: 0.5rem;
    color: rgb(254, 57, 103);
  }

  .g-title > a {
    color: rgb(254, 57, 103);
  }

  .jing_xuan {
    color: #333;
  }

  .g-title span {
    display: inline-block;
    width: 1.5rem;
    vertical-align: super;
    margin: 0 10px;
    height: 1px;
    background: #cccccc;
  }

  .g-goods li {
    float: left;
    position: relative;
    width: 50%;
    margin-top: 10px;
    box-sizing: border-box;
  }

  .g-goods li:nth-child(2n+1) {
    padding-right: 3px;
  }

  .g-goods li:nth-child(2n) {
    padding-left: 3px;
  }

  .g-goods div {
    background-color: #fff;
    padding: 5px;
    box-sizing: border-box;
  }

  .g-goods img {
    width: 100%;
    height: 5.8rem;
  }

  .u-jieshao {
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /*  display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;*/
    color: #333;
    line-height: 20px;
    padding: 0 8px;
  }

  .u-jiage {
    padding: 0 4px;
    height: 30px;
    line-height: 30px;
    position: relative;
  }

  .u-jiage > span {
    color: #f51322;
    font-size: 14px;
    margin-right: 5px;
  }

  .u-jiage span:nth-of-type(3) {
    display: block;
    position: absolute;
    top: 2px;
    right: 8px;
    text-align: center;
    color: #686868;
    width: 49px;
    height: 23px;
    line-height: 24px;
    border: 1px solid #ccc;
  }

  .u-ping_jia {
    height: 20px;
    line-height: 20px;
    color: #999;
    font-size: 12px;
    padding: 0 4px 5px;
  }

  .u-ping_jia span:nth-child(2) {
    float: right;
  }

  .g-goods-list > p {
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    text-align: center;
    margin-top: 25px;
  }

</style>
