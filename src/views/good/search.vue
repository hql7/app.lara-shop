<template>
  <div class="search" id="search">
    <!--头部-->
    <div class="g-search-head">
      <div><i class="iconfont icon-zuo back" @click="goBack"></i></div>
      <div class="m-search-head">
        <div><i class="iconfont icon-sousuo"></i></div>
        <div><input type="search" v-model="search.keyword"></div>
      </div>
      <div class="anniu" @click="toSearch">搜索</div>
    </div>
    <!--综合导航-->
    <div class="g-Snav">
      <ul class="m-Snav">
        <li @click="choiceSortType(0)" :class="{'active':act.actT === 0}">
          综合
        </li>
        <li @click="choiceSortType(1)" :class="{'active':act.actT === 1}">
          销量
        </li>
        <li @click="choiceSortType(4)" :class="{'active':act.actT === 4}">
          价格
        </li>
        <li @click="sift(99)" :class="{'active':act.actT === 99}">
          筛选
        </li>
      </ul>
    </div>
    <!--搜索列表-->
    <div class="g-Slist">
      <ul class="m-Slist">
        <li v-for="item in goodList">
          <router-link :to="'/products?id='+item.id">
            <div class="m-Sbox">
              <div class="u-SimgBox">
                <img :src="item.img" alt="good"/>
              </div>
              <div class="u-Scontent">
                <h3>{{item.name}}</h3>
                <p>￥{{item.sell_price}}</p>
                <p><span>评价 {{item.reviews_num}}</span></p>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="mark" v-if="popup" @click="closeSift"></div>
    <!--筛选-->
    <div class="sift" v-if="popup">
      <h3>类型筛选</h3>
      <ul>
        <li @click="siftType('c')" :class="{'sift-act':search.commend===1}"><i class="iconfont icon-xuanzhong2"></i>推荐好货
        </li>
        <li @click="siftType('s',3)" :class="{'sift-act':search.sort===3}"><i class="iconfont icon-xuanzhong2"></i>新品
        </li>
        <li @click="siftType('p')" :class="{'sift-act':search.prom===1}"><i class="iconfont icon-xuanzhong2"></i>促销优惠
        </li>
        <li @click="siftType('i')" :class="{'sift-act':search.in_stock===1}"><i class="iconfont icon-xuanzhong2"></i>仅看有货
        </li>
        <li @click="siftType('s',2)" :class="{'sift-act':search.sort===2}"><i class="iconfont icon-xuanzhong2"></i>评论数
        </li>
      </ul>
      <h3>价格区间</h3>
      <div class="price-range">
        <input type="text" v-model.number="pri_start">
        <span></span>
        <input type="text" v-model.number="pri_end">
      </div>
      <ul>
        <li v-for="item in price_range" :key="item" :class="{'sift-act':search.price == item}"
            @click="choicePriRange(item)">
          <i class="iconfont icon-xuanzhong2"></i>{{item}}
        </li>
      </ul>
      <h3>品牌列表</h3>
      <ul>
        <li v-for="item in brands" :key="item.id" :class="{'sift-act':search.brand == item.id}"
            @click="choiceBrand(item.id)"><i class="iconfont icon-xuanzhong2"></i>{{item.name}}
        </li>
      </ul>
      <div class="idok">
        <button @click="resetSift">重置</button>
        <button @click="searchSubmit">确定</button>
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
        page: {
          index: 1,
          count: 1, // 总页数
          total: 1
        }, // 分页信息
        search: {
          keyword: '', // 关键词
          cid: this.$route.query.cid || '', // 分类id
          voucher_id: this.$route.query.qid || '', // 优惠券id
          brand: null, // 品牌
          price: '', // 价格区间
          sort: 0, // 排序方式  0=综合(默认)  1=销量  2=评论数  3=新品  4=价格
          commend: 0, // 推荐商品  0=未选中 1=选中
          prom: 0, // 参加活动的商品 0=未选中 1=选中
          in_stock: 0 // 仅显示有货  0=未选中 1=选中
        }, // 搜索条件
        brands: [], // 相关的品牌列表
        price_range: [], // 价格区间列表
        pri_start: null, // 输入框-价格区间起
        pri_end: null, // 输入框-价格区间终
        goodList: [], // 搜索列表
        act: {
          actT: 0, // 第一排选项
          actB: 0 // 第二排选项
        },
        popup: false,
        isLoading: true
      }
    },
    created() {
      if (this.$route.query.cid || this.$route.query.qid) {
        this.getSearchList()
      }
    },
    mounted: function () {
      window.addEventListener('scroll', this.pullUp, false);
      this.isLoading = false;
    },
    computed: {},
    methods: {
      // 后退
      goBack() {
        this.$router.go(-1)
      },
      // 获取数据
      getSearchList(add) {
        this.isLoading = true;
        this.page.index = add ? this.page.index : 1; //翻页还是重置
        this.axios.post(this.getApi('web/goods_list'),
          this.dafa({
            index: this.page.index,
            keyword: this.search.keyword,
            cid: this.search.cid,
            brand: this.search.brand,
            voucher_id: this.search.voucher_id,
            price: this.search.price,
            sort: this.search.sort,
            commend: this.search.commend,
            prom: this.search.prom,
            in_stock: this.search.in_stock
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            // 分页信息
            this.page.index = res.data.fy_pgCur;
            this.page.total = res.data.fy_pgCount;
            this.page.count = res.data.fy_pgCount;
            // 品牌信息
            this.brands = res.data.brands;
            // 价格区间
            this.price_range = res.data.price_range;
            // 商品列表
            add ? this.goodList = this.goodList.concat(res.data.goods) : this.goodList = res.data.goods //合并还是覆盖
          }
        }).catch(err => {
          this.isLoading = false;
        })
      },
      // 选择排序方式
      choiceSortType(val) {
        this.search.sort = val
        this.act.actT = val
        // 调用
        this.getSearchList()
      },
      // 搜索框搜索
      toSearch() {
        this.search.sort = 0
        if (this.search.keyword) {
          this.getSearchList()
        } else {
          this.$message('请输入关键词')
        }
      },
      // 筛选
      sift(val) {
        // 选中样式
        this.act.actT = val
        // 激活弹窗
        this.popup = true
      },
      // 类型筛选
      siftType(tp, val) {
        switch (tp) {
          case 'c':
            this.search.commend = this.search.commend === 0 ? 1 : 0 // 选中或取消
            break
          case 'p':
            this.search.prom = this.search.prom === 0 ? 1 : 0 // 选中或取消
            break
          case 's':
            this.search.sort = this.search.sort === val ? 0 : val // 若本身值等于选中值则为取消
            break
          case 'i':
            this.search.in_stock = this.search.in_stock === 0 ? 1 : 0 // 选中或取消
            break
        }
      },
      // 选择价格区间
      choicePriRange(val) {
        this.search.price = this.search.price === val ? '' : val
      },
      // 选择品牌
      choiceBrand(val) {
        this.search.brand = this.search.brand === val ? null : val
      },
      // 重置筛选
      resetSift() {
        this.search.sort = 0
        this.search.commend = 0
        this.search.prom = 0
        this.search.in_stock = 0
        this.search.price = ''
        this.search.brand = null
        this.pri_start = null
        this.pri_end = null
      },
      // 提交搜索
      searchSubmit() {
        // 是否输入框价格
        if (this.pri_start && this.pri_end) {
          this.search.price = `${this.pri_start}-${this.pri_end}`
        }
        // 调用搜索
        this.getSearchList()
        // 关闭窗口
        this.closeSift()
      },
      // 关闭
      closeSift() {
        this.popup = false
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('search').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.count) {
          that.page.index++;
          that.getSearchList(true) //加载更多
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
  .search {
    padding-top: 50px;
    box-sizing: border-box;
  }

  /*头部*/
  .g-search-head {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;
    height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #e1e1e1;
    padding: 10px 0;
    box-sizing: border-box;
  }

  .g-search-head div:nth-child(1) {
    width: 10%;
    height: 100%;
    text-align: center;
    line-height: 26px;
    float: left;
  }

  .back {
    font-size: 18px;
    font-weight: bold;
  }

  .m-search-head {
    height: 100%;
    float: left;
    width: 73%;
    background-color: #f3efef;
    border-radius: 7px;
    display: flex;
  }

  .anniu {
    width: 17%;
    float: left;
    height: 100%;
    text-align: center;
    line-height: 27px;
  }

  .m-search-head div:nth-child(1) {
    flex: 1;
    color: #999;
  }

  .m-search-head div:nth-child(2) {
    flex: 9;
    color: #999;
  }

  .m-search-head div:nth-child(2) input {
    width: 100%;
    height: 100%;
    line-height: 31px;
    border: none;
    background: transparent;
    color: #999999;
    padding: 0 3px;
  }

  /*综合导航*/
  .g-Snav {
    width: 100%;
    box-sizing: border-box;
    height: 39px;
    font-size: 14px;
    color: #999;
    border-bottom: 1px solid #e5e5e5;
  }

  .m-Snav {
    height: 100%;
    width: 100%;
  }

  .m-Snav li {
    float: left;
    width: 25%;
    text-align: center;
    line-height: 38px;
  }

  .m-Snav li i {
    font-size: 14px;
    margin-left: 3px;
  }

  .active {
    color: #f51322;
  }

  /*搜索列表*/
  .g-Slist {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .g-Slist li {
    height: 120px;
    padding: 10px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
  }

  .m-Sbox {
    width: 100%;
    height: 100%;
  }

  .u-SimgBox {
    width: 100px;
    height: 100px;
    float: left;
  }

  .u-SimgBox img {
    width: 100%;
    height: 100%;
  }

  .u-Scontent {
    margin-left: 100px;
    height: 100%;
    padding: 5px 10px;
  }

  .u-Scontent h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #232326;
    font-size: 15px;
    line-height: 20px;
    height: 40px;
  }

  .u-Scontent p:nth-of-type(1) {
    font-size: 16px;
    color: #f23030;
    margin-top: 5px;
  }

  .u-Scontent p:nth-of-type(2) span:nth-child(1) {
    margin-right: 10px;
  }

  /*蒙版*/
  .mark {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
  }

  /*筛选*/
  .sift {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 111;
    width: 85%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    background-color: #fff;
    animation: openSift .7s ease forwards;
    padding: 25px;
    box-sizing: border-box;
  }

  @keyframes openSift {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  .close-sift {
    animation: closeSift .7s ease forwards;
  }

  @keyframes closeSift {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .sift > h3 {
    font-size: 14px;
    color: #333;
  }

  .sift > ul {
    overflow: hidden;
    margin-bottom: 30px;
  }

  .sift li {
    float: left;
    position: relative;
    margin: 10px 1.5%;
    width: 30%;
    height: 30px;
    text-align: center;
    line-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: #f1f2f6;
    padding: 0 5px;
    border: 1px solid #f1f2f6;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .sift i {
    display: none;
    position: absolute;
    top: 0;
    left: -2px;
    color: #f51322;
  }

  .sift .sift-act {
    background-color: #fff;
    border-color: #f51322;
  }

  .sift-act i {
    display: inline-block;
  }

  .price-range {
    height: 30px;
    margin-top: 10px;
  }

  .price-range > input {
    float: left;
    width: 41%;
    height: 100%;
    background-color: #f1f2f6;
    padding-left: 10px;
    border: none;
    border-radius: 3px;
    box-sizing: border-box;
  }

  .price-range > span {
    float: left;
    display: inline-block;
    width: 10%;
    height: 2px;
    background-color: #666;
    margin: 13px 4% 0;
  }

  .idok {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 38px;
    border-top: 1px solid #e9e9e9;
    text-align: center;
  }

  .idok > button {
    float: left;
    width: 50%;
    height: 100%;
    font-size: 14px;
    background-color: #fff;
    border: none;
  }

  .idok > button:nth-child(2) {
    background-color: #f51322;
    color: #fff;
  }

</style>
