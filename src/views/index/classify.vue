<template>
  <div class="classify">
    <!--头部-->
    <div class="head">
      <div class="m-logo">
        <div class="u-caidan" id="snap" @click="global.msg()">
          <i class="iconfont icon-saoerweima"></i>
        </div>
        <div class="u-search">
          <!--<a href="search.html"></a>-->
          <router-link to="/search"><input readonly placeholder="搜索你想要的商品">
            <i class="iconfont icon-fangdajing"></i></router-link>
        </div>
        <router-link to="/message" class="u-news" tag="div">
          <i class="iconfont icon-xiaoxi"></i>
        </router-link>
      </div>
    </div>
    <!--主体-->
    <div class="main">
      <div class="m_left">
        <ul>
          <li v-for="item in FL" :class="{act:item.cate_id == act}" @click="getFLgoods(item)">{{item.floor_name}}</li>
        </ul>
      </div>
      <div class="m_right">
        <div class="ad">
          <router-link :to="ad.link"><img :src="ad.img" alt="广告位"></router-link>
        </div>
        <div class="list">
          <ul>
            <li v-for="item in FLgoods">
              <router-link :to="'/search?cid='+item.id" tag="div">
                <img :src="item.img" alt="good">
                <p>{{item.name}}</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        FL: [], // 分类
        act: null,
        ad: {
          img: '',
          link: ''
        }, // 右侧大广告
        FLgoods: [],
        isLoading: true
      }
    },
    mounted: function () {

    },
    computed: {},
    created() {
      // 定位当前tab
      this.$store.commit('setIndexRouter', 1);
      // 获取分类
      this.getFL()
    },
    methods: {
      // 获取楼层分类信息
      getFL() {
        this.axios.post(this.getApi('web/floor_sale')
        ).then(res => {
          if (res.data.code === 0) {
            this.isLoading = false;
            this.FL = res.data.list;
            // 首次执行
            this.getFLgoods(res.data.list[0])
          }
        })
      },
      // 获取下级分类
      getFLgoods(item) {
        this.act = item.cate_id;
        this.ad = {
          img: item.img_phone,
          link: item.link.replace(/goods.html/g, 'products')
        };
        this.FLgoods = item.categorys;
      }
    },
    components: {Load}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .classify {
    padding-top: 50px;
  }

  /*头部*/
  .head {
    height: 50px;
    width: 100%;
    margin: 0 auto;
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    background-color: rgba(255, 49, 79, 1);
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

  /*主体*/
  .main {
    overflow: hidden;
    background-color: #f5f5f5;
  }

  .m_left {
    float: left;
    width: 75px;
    min-height: 450px;
    background-color: #fff;
    text-align: center;
  }

  .m_left li {
    height: 44px;
    line-height: 44px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 5px;
    margin-bottom: 1px;
  }

  .m_left .act {
    background-color: #f5f5f5;
    color: #f51332;
  }

  .m_right {
    margin-left: 75px;
    padding: 10px;
  }

  .ad {
    height: 110px;
  }

  .ad img {
    width: 100%;
    height: 100%;
  }

  .list {
    margin-top: 10px;
  }

  .list ul {
    overflow: hidden;
    padding: 10px;
    background-color: #fff;
  }

  .list li {
    float: left;
    width: 33.33%;
    height: 86px;
    text-align: center;
  }

  .list li img {
    width: 55px;
    height: 55px;
  }
</style>
