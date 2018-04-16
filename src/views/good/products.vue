<template>
  <div id="g-products" class="g-products">
    <!--商品详情头部-->
    <div class="g-products-top">
      <i class="iconfont icon-zuo u-left" @click="goBack"></i>
      <span @click="choiceSwipe(0)" :class="{'c-red':view==0}">商品</span>
      <span @click="choiceSwipe(1)" :class="{'c-red':view==1}">详情</span>
      <span @click="choiceSwipe(2)" :class="{'c-red':view==2}">评价</span>
      <i class="iconfont icon-gengduo u-right"></i>
    </div>
    <!--商品-->
    <div v-if="view == 0">
      <!--主商品图盒子-->
      <div class="g-products-img swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in product.imgs">
            <img :src="item" alt="good">
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <!--活动-限时抢购团购-->
      <div class="p-activity" v-if="product.type==1||product.type==2">
        <div class="p-activ-l">
          <h3>
            <strong><span><i class="iconfont icon-miaosha"></i></span>
              <em v-if="product.type==1">团购商品</em><em v-else-if="product.type==2">限时抢购</em></strong>
            <b class="u-right">可优惠{{priceDifferences}}</b>
          </h3>
          <p>￥<em>{{product.sale_price}}</em><s>￥{{product.sell_price}}</s></p>
        </div>
        <div class="p-activ-r">
          <h3>距离结束还剩</h3>
          <p v-html="timeMsg"></p>
        </div>
      </div>
      <!--商品信息-->
      <div class="g-products-details">
        <h2>{{product.name}}</h2>
        <div v-if="product.type != 1 && product.type != 2" class="det-price">
          <p v-if="product.type==0"><em>￥<span>{{product.sell_price}}</span></em><s>原价{{product.market_price}}</s></p>
          <p v-if="product.type==3">
            <em>￥<span v-if="product.prom_type==3||product.prom_type==4">{{product.sell_price}}</span><span
              v-else>{{product.sale_price}}</span></em>
            <s v-if="product.prom_type==3||product.prom_type==4">原价{{product.market_price}}</s>
            <s v-else>原价{{product.sell_price}}</s>
          </p>
          <h4 v-if="product.type==3"><label>{{product.sale_title}}：</label>
            <span v-if="product.prom_type==3||product.prom_type==4">{{product.prom_desc}}（{{product.sale_name}}）</span>
            <span v-else>{{product.sale_desc}}（{{product.sale_name}}）</span>
          </h4>
          <p v-if="product.type==4"><label>所需积分</label><span>{{product.point}}</span></p>
          <!--<p class="m-xiaoLiang">
            <span>快递：{{product.express_money}}</span>月销量{{product.month_sale}}件<span></span><span>{{product.address}}</span>
          </p>-->
        </div>
      </div>
      <!--选择商品-->
      <div class="g-choice" @click="clickChoice">
        已选：<span>{{def_attr}}</span><i class="iconfont icon-gengduo"></i>
      </div>
      <!--商品详情-->
      <div class="g-imgText" v-html="productDetails(product.detail)"></div>
      <!--加入购物车-->
      <div class="g-savedTo">
        <div class="m-collection" @click="collection">
          <i v-if="star" class="iconfont icon-guanzhu u-collection"></i>
          <i v-else class="iconfont icon-guanzhu1"></i>
          <p>关注</p>
        </div>
        <div @click="toCart">
          <i class="iconfont icon-gouwuche01"></i>
          <p>购物车</p>
        </div>
        <div @click="isLogin(1)">加入购物车</div>
        <div @click="isLogin(0)">立即购买</div>
      </div>
      <!--遮罩层-->
      <div class="g-mask" v-if="maskShow" @click="clickMask"></div>
      <!--弹出层-->
      <div class="g-popup" ref="popup">
        <div class="m-pop-top">
          <div><img :src="product.img" alt="good"></div>
          <div>
            <p>￥<span v-if="product.type==0">{{product.sell_price}}</span><span
              v-else-if="product.type==1||product.type==2">{{product.sale_price}}</span><span
              v-else-if="product.type==3"><b
              v-if="product.prom_type==3||product.prom_type==4">{{ product.sell_price}}</b><b
              v-else>{{ product.sale_price}}</b></span><span v-else-if="product.type==4">{{product.point}}</span>
            </p>
            <h3>商品编号：{{product.product_no}}</h3>
            <h4>库存：{{product.store_nums}}件</h4>
            <i class="iconfont icon-guanbi u-close" @click="clickMask"></i>
          </div>
        </div>
        <div class="g-option">
          <div v-for="item in product.specs">
            <h3>{{item.name}}</h3>
            <ul>
              <li v-for="opt in item.value" @click="gather(item.id,opt.id)"
                  :class="{selected:sel_status==null||active(item.id,opt.id)}">{{opt.name}}
              </li>
            </ul>
          </div>
        </div>
        <div class="g-product-num">
          <div>数量</div>
          <div class="m-product-num">
            <p><span @click="minus">-</span><input type="number" v-model.number="selNum"><span
              @click="plus">+</span>
            </p>
          </div>
        </div>
        <div class="g-toDu">
          <div @click="isLogin(1)">加入购物车</div>
          <div @click="isLogin(0)">立即购买</div>
        </div>
      </div>
    </div>
    <!--详情-->
    <div class="pt-info" v-else-if="view==1">
      <ul>
        <li @click="choiceInfo(0)" :class="{'c-red':info_view==0}">商品介绍</li>
        <li @click="choiceInfo(1)" :class="{'c-red':info_view==1}">规格参数</li>
        <li @click="choiceInfo(2)" :class="{'c-red':info_view==2}">包装售后</li>
      </ul>
      <div v-if="info_view==0" v-html="productDetails(product.detail)"></div>
      <div v-else-if="info_view==1" class="spec_attr">
        <table>
          <tr v-for="(value, key) in product.spec_attr">
            <td>{{key}}</td>
            <td>{{value}}</td>
          </tr>
        </table>
      </div>
      <div v-else v-html="productDetails(product.after_sale)"></div>
    </div>
    <!--评价-->
    <div class="pt-ev" v-else>
      <h3><span v-if="rev.sort==0" @click="choiceRevType({sort:1})">当前热评排序</span>
        <span v-else @click="choiceRevType({sort:0})">当前时间排序</span>
        <em class="u-right c-red">好评率{{rev_info.info.favorable_rate}}%</em></h3>
      <ul>
        <li :class="{act:rev.type==0}" @click="choiceRevType({type:0})">全部</li>
        <li :class="{act:rev.type==1}" @click="choiceRevType({type:1})">有图</li>
        <li :class="{act:rev.type==2}" @click="choiceRevType({type:2})">好评</li>
        <li :class="{act:rev.type==3}" @click="choiceRevType({type:3})">中评</li>
        <li :class="{act:rev.type==4}" @click="choiceRevType({type:4})">差评</li>
        <li :class="{act:rev.type==5}" @click="choiceRevType({type:5})">当前商品</li>
      </ul>
      <div class="rev_list">
        <div v-for="item in rev_info.list">
          <h3><b class="user_name">{{item.username}} </b><b class="u-right c-999">{{item.comment_time}}</b></h3>
          <el-rate
            v-model="item.point" disabled
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
          </el-rate>
          <p class="c-333">{{item.content}}</p>
          <p class="c-999">{{item.spec_str}}</p>
          <div class="rev_img_box">
            <img v-for="(itn, index) in item.imgs" :src="itn" alt="good" @click="seeRevImg(item.imgs, index)"
                 title="good"></div>
          <p class="shop_back" v-if="item.reply"><em
            class="c-red">{{item.reply_admin}}：</em><span>{{item.reply}}</span>&nbsp;&nbsp;<b
            class="c-999">{{item.reply_time}}</b></p>
        </div>
      </div>
      <!--查看大图-->
      <div class="seeBigRevImg swiper-container2" v-if="see_rev_img">
        <h3><i class="iconfont icon-zuo" @click="see_rev_img = false"></i>{{swipe.index}}/{{swipe.all}}</h3>
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in swipe_rev_img">
            <img :src="item" alt="good">
          </div>
        </div>
      </div>
    </div>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Swiper from 'swiper/dist/js/swiper.min'
  import 'swiper/dist/css/swiper.min.css'
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        selNum: 1,
        view: 0, // 视图选项
        info_view: 0, // 详情视图中的视图选项
        id: this.$route.query.id || '',
        pid: this.$route.query.pid || '',
        maskShow: false,
        product: {
          after_sale: '',
          attention: null,
          detail: '',
          name: '',
          subtitle: '',
          product_no: '',
          weight: '',
          market_price: '',
          sell_price: '',
          end_time: null,
          id: null,
          product_id: null,
          store_nums: 1,
          imgs: [],
          img: '',
          specs: [],
          spec_attr: {}
        }, //接受数据
        def_attr: '', //默认规格
        sel_attr: {}, //选中规格
        rand_str: Math.random() + '',
        star: false,
        timeMsg: '',
        page: {
          index: 1,
          count: 1, // 总页数
          total: 1
        }, // 分页信息
        rev: {
          type: 0, // 类型  0=全部评价  1=有图  2=好评  3=中评  4=差评  5=当前商品评价
          sort: 0, // 排序方式  0=推荐排序(点赞数)  1=时间排序(倒序)
          pid: ''
        }, // 评价参数
        rev_info: {
          info: {},
          list: []
        }, // 评价信息
        see_rev_img: false, // 是否激活大图盒子
        swipe_rev_img: [], // 点击评价图片的swiper盒子
        swipe: {
          index: 1, // 评价盒子当前页
          all: 1 // 评价盒子总页
        },
        isLoading: true
      }
    },
    created() {
      // 获取商品详情
      this.getGoodDetail();
      // 采集足迹信息
      this.getFootprint();
    },
    mounted: function () {
      // 初始透明度
      this.$refs.popup.style.opacity = 1;
      // 绑定上拉加载
      window.addEventListener('scroll', this.pullUp, false);
    },
    watch: {
      selNum: function (val) {
        if (!/^\d+$/.test(val)) {
          this.selNum = 1;
          return false
        }
        if (val < 1) {
          this.selNum = 1;
          return false
        }
        if (val > this.product.store_nums) {
          this.selNum = this.product.store_nums;
          return false
        }
      }
    },
    computed: {
      sel_status() {
        return this.rand_str
      },
      // 差价
      priceDifferences() {
        return (this.product.sell_price - this.product.sale_price).toFixed(2)
      }
    },
    methods: {
      // 后退
      goBack: function () {  //后退
        this.$router.go(-1)
      },
      // 获取商品
      getGoodDetail() {
        this.axios.post(this.getApi('web/good_detail'),
          this.dafa({
            good_id: this.id,
            product_id: this.pid,
            user_id: this.getobjS('user') ? this.getobjS('user').id : '',
            token: this.getobjS('user') ? this.getobjS('user').token : ''
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            res.data.good_info instanceof Array ? res.data.good_info = {} : this.product = res.data.good_info;

            // 获取成功后 等待视图加载完毕后激活轮播插件
            this.$nextTick(function () {
              let swiper = new Swiper('.swiper-container', {
                pagination: {
                  el: '.swiper-pagination'
                }
              })
            });

            // 解读默认规格
            this.jie_du();

            // 若有限时商品 激活倒计时
            if (res.data.good_info.type === 1 || res.data.good_info.type === 2) this.getRTime(res.data.good_info.end_time)

            // 是否收藏
            this.star = res.data.good_info.attention === 0 ? true : false;

            // 获取评价内容
            this.getEva();
          }
        }).catch(err => {
          this.isLoading = false;
        })
      },
      // 弹出遮罩层
      clickChoice: function () {
        this.maskShow = true
        this.$refs.popup.style.display = 'block'
        this.$refs.popup.style.opacity = 1
      },
      // 关闭遮罩层
      clickMask: function () {
        this.maskShow = false
        let opct = 10
        let timer = setInterval(() => {
          opct -= 1
          this.$refs.popup.style.opacity = opct / 10
          if (opct <= 0) {
            clearInterval(timer)
            this.$refs.popup.style.display = 'none'
          }
        }, 60)
        this.jie_du()
      },
      // 是否收藏商品
      collection: function () {
        if (this.getobjS('user')) {
          if (this.star) {
            // 取消收藏
            this.isLoading = true;
            this.axios.post(this.getApi('web/del_attention'),
              this.dafa({
                user_id: this.getobjS('user').id,
                token: this.getobjS('user').token,
                good_id: this.product.id,
                product_id: this.product.product_id,
              })
            ).then(res => {
              this.isLoading = false;
              if (res.data.code === 0) {
                this.$message(res.data.msg);
                this.getGoodDetail()
              } else {
                this.$message(res.data.msg)
              }
            }).catch(err => {
              this.isLoading = false;
            })
          } else {
            // 加入收藏
            this.isLoading = true;
            this.axios.post(this.getApi('web/add_attention'),
              this.dafa({
                user_id: this.getobjS('user').id,
                token: this.getobjS('user').token,
                good_id: this.product.id,
                product_id: this.product.product_id,
              })
            ).then(res => {
              this.isLoading = false;
              if (res.data.code === 0) {
                this.$message(res.data.msg);
                this.getGoodDetail()
              } else {
                this.$message(res.data.msg)
              }
            }).catch(err => {
              this.isLoading = false;
            })
          }
        } else {
          this.$message('请登录')
        }
      },
      // 减少数量
      minus: function () {
        this.selNum--;
        this.selNum = this.selNum < 1 ? 1 : this.selNum
      },
      // 增加数量
      plus: function () {
        if (this.selNum < this.product.store_nums) {
          this.selNum++
        }
      },
      // 采集数据
      gather: function (itemID, optID) {
        this.sel_attr[itemID] = optID;
        this.rand_str = Math.random() + '';
        // 转化规格数据类型
        let str = '';
        if (this.sel_attr) {
          for (let i in this.sel_attr) {
            str += i + ':' + this.sel_attr[i] + ';'
          }
          str = str.substring(0, str.length - 1)
        }
        // 生成新选中规格
        this.product.now_spec = str;
        // 调用货号详情请求
        this.getProductDetail(str)
      },
      // 获取商品货号详情
      getProductDetail(val) {
        this.axios.post(this.getApi('web/product_detail'),
          this.dafa({
            good_id: this.product.id,
            spec: val || this.product.now_spec
          })
        ).then(res => {
          if (res.data.code === 0) {
            // 货号详情返回的数据补全
            let obj = res.data.info;
            obj.attention = this.product.attention;
            obj.id = this.product.id;
            obj.name = this.product.name;
            obj.subtitle = this.product.subtitle;
            obj.reviews_num = this.product.reviews_num;
            obj.img = this.product.img;
            obj.imgs = this.product.imgs;
            obj.specs = this.product.specs;
            obj.detail = this.product.detail;
            obj.after_sale = this.product.after_sale;
            this.product = obj
          }
        })
      },
      // 判断登录状态和货品库存
      isLogin(val) {
        // 如果商品可选
        if (!this.product.product_id) {
          this.$message('暂无此规格商品');
        } else if (!this.product.store_nums) {
          this.$message('库存不足');
        } else {
          if (this.getobjS('user')) {
            // 执行函数
            val === 1 ? this.addCart() : this.tobuy()
          } else {
            this.$router.push('/login')
          }
        }
      },
      // 加入购物车
      addCart: function () {
        this.isLoading = true;
        this.axios.post(this.getApi('web/add_cart'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            product_id: this.product.product_id,
            num: this.selNum
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            this.$message(res.data.msg);
            this.clickMask()
          } else {
            this.$message(res.data.msg)
          }
        })
      },
      // 去确认订单页
      tobuy: function () {
        this.isLoading = true;
        this.axios.post(this.getApi('web/order_ready'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            param: [{
              good_id: this.product.id,
              product_id: this.product.product_id,
              num: this.selNum
            }]
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            this.$router.push('/firm-order')
          } else {
            this.$message(res.data.msg)
          }
        })
      },
      // 选择规格
      active: function (itemID, optID) {
        return this.sel_attr[itemID] == optID
      },
      // 解读默认规格
      jie_du: function () {
        if (this.product.now_spec) {
          this.def_attr = ''
          let atrr = this.product.now_spec.split(';')
          let box1, box2
          for (let i = 0; i < atrr.length; i++) {
            box1 = atrr[i]
            box2 = box1.split(':')
            if (box2[0] == this.product.specs[i].id) {
              this.def_attr += `${this.product.specs[i].name}：`
            }
            for (let j in this.product.specs[i].value) {
              if (box2[1] == this.product.specs[i].value[j].id) {
                this.def_attr += this.product.specs[i].value[j].name + '\n '
                this.sel_attr[this.product.specs[i].id] = this.product.specs[i].value[j].id //存储每个组中选中规格的id
              }
            }
          }
        } else {
          this.def_attr = '默认规格'
        }
      },
      // 倒计时
      getRTime(time) {
        let EndTime = time * 1000
        let NowTime = new Date()
        let t = EndTime - NowTime.getTime()
        let d = Math.floor(t / 1000 / 60 / 60 / 24)
        let h = Math.floor(t / 1000 / 60 / 60 % 24)
        let m = Math.floor(t / 1000 / 60 % 60)
        let s = Math.floor(t / 1000 % 60)
        if (d < 10) {
          d = '0' + d
        }
        if (h < 10) {
          h = '0' + h
        }
        if (m < 10) {
          m = '0' + m
        }
        if (s < 10) {
          s = '0' + s
        }
        if (t > 0) {
          this.timeMsg = '<em>' + d + '</em><span>:</span><em>' + h + '</em><span>:</span><em>' + m + '</em><span>:</span><em>' + s + '</em></span>'
        } else {
          this.timeMsg = '活动已结束'
        }
        if (t >= 0) {
          window.setTimeout(() => {
              this.getRTime(time)
            },
            1000)
        }
      },
      // 收集足迹数据
      getFootprint() {
        if (this.getobjS('user')) {
          this.axios.post(this.getApi('web/visit_log'),
            this.dafa({
              good_id: this.id,
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token
            })
          )
        }
      },
      // 去购物车
      toCart() {
        this.$router.push('/cart');
      },
      // 选择商品内容
      choiceSwipe(val) {
        this.view = val;
        if (val === 2) {
          this.$nextTick(() => {
            this.pullUp()
          })
        }
      },
      // 选择详情中的内容
      choiceInfo(val) {
        this.info_view = val;
      },
      // 解码商品详情
      productDetails(data) {
        return this.base().utf8to16(this.base().base64decode(data))
      },
      // 获取评价
      getEva(add) {
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/good_reviews'),
          this.dafa({
            index: this.page.index,
            type: this.rev.type,
            sort: this.rev.sort,
            good_id: this.id,
            product_id: this.rev.pid
          })
        ).then((response) => {
          if (response.data.code === 0) {
            if (response.data.list) {
              this.rev_info.info = response.data.reviews_info;
              add ? this.rev_info.list = this.rev_info.list.concat(response.data.list) : this.rev_info.list = response.data.list; //合并还是覆盖
              this.page.index = response.data.fy_pgCur;
              this.page.count = response.data.fy_pgCount;
              this.page.total = response.data.fy_count;
            }
          } else {
            this.$message(response.data.msg)
          }
        }).catch(() => {
          this.$message('请重试');
        })
      },
      // 选择评价类型
      choiceRevType(obj) {
        if ('type' in obj) {
          this.rev.type = obj.type
        }
        if ('sort' in obj) {
          this.rev.sort = obj.sort
        }
        this.getEva()
      },
      // 查看评价中的图片
      seeRevImg(imgs, ind) {
        this.see_rev_img = true;
        this.swipe_rev_img = imgs;
        this.swipe.index = ind + 1;
        this.swipe.all = imgs.length;
        let act = 0;
        this.$nextTick(() => {
          // 获取成功后 等待视图加载完毕后激活轮播插件
          let swiperRev = new Swiper('.swiper-container2', {
            initialSlide: ind
          });
          swiperRev.on('slideChange', () => {
            this.swipe.index = swiperRev.activeIndex + 1;
          })
        })
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('g-products').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.count) {
          that.page.index++;
          that.getEva(true)
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
  .g-products {
    background-color: #eaeaea;
    width: 100%;
    height: 100%;
    padding: 50px 0 45px;
    box-sizing: border-box;
  }

  /*头部*/
  .g-products-top {
    width: 100%;
    height: 50px;
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    background-color: #fff;
    border-bottom: 1px solid #e3e3e3;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .g-products-top > span {
    margin: 0 5%;
  }

  .u-left {
    float: left;
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: left;
    color: #999;
  }

  /*商品图区*/
  .g-products-img {
    width: 100%;
    min-height: 320px;
    /*padding: 10px;*/
    background-color: #fff;
    overflow: hidden;
    box-sizing: border-box;
  }

  .g-products-img img {
    width: 100%;
    min-height: 320px;
  }

  /*商品信息*/
  .g-products-details {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border-top: 1px solid #f3f3f3;
    margin-bottom: 10px;
  }

  .g-products-details > h2 {
    width: 100%;
    /*max-height: 44px;*/
    line-height: 22px;
    font-size: 14px;
    color: #051B28;
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    /*display: -webkit-box;*/
    /*-webkit-line-clamp: 2;*/
    /*-webkit-box-orient: vertical*/
  }

  .det-price > p em {
    color: #f51322;
  }

  .det-price > p span {
    font-size: 18px;
    font-weight: bold;
    margin-right: 5px;
  }

  .det-price > p s {
    color: #7b7b7b;
  }

  /*  .m-xiaoLiang {
      text-align: center;
      color: #999;
    }

    .m-xiaoLiang span:nth-of-type(1) {
      float: left;
    }

    .m-xiaoLiang span:nth-of-type(3) {
      float: right;
    }*/

  /*商品选择*/
  .g-choice {
    width: 100%;
    height: 48px;
    line-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 10px;
    color: #333;
    box-sizing: border-box;
    background-color: #fff;
  }

  .g-choice span {
    margin: 0 3px;
  }

  .g-choice i {
    float: right;
    color: #999;
  }

  /*图文详情*/
  .g-imgText {
    width: 100%;
    background-color: #fff;
    margin-top: 10px;
    padding: 10px;
    box-sizing: border-box;
  }

  .g-imgText img {
    width: 100%;
  }

  /*加入购物车*/
  .g-savedTo {
    width: 100%;
    height: 45px;
    border-top: 1px solid rgba(234, 234, 234, .7);
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    z-index: 9;
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
  }

  .g-savedTo div:nth-child(n-2) {
    flex: 1.5;
  }

  .g-savedTo div:nth-last-child(1) {
    flex: 3.5;
    background-color: #f23030;
    line-height: 45px;
    color: #fff;
    font-size: 14px;
  }

  .g-savedTo div:nth-last-child(2) {
    flex: 3.5;
    background-color: #ffb03f;
    line-height: 45px;
    color: #fff;
    font-size: 14px;
  }

  .g-savedTo p {
    font-size: 10px;
    margin-top: -2px;
  }

  .u-collection {
    color: #f23030;
    display: inline-block;
    animation: biger .4s ease;
  }

  /*收藏效果动画*/
  @keyframes biger {
    100% {
      transform: scale(1.1);
      opacity: .7;
    }
  }

  /*遮罩层*/
  .g-mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
  }

  /*弹出层*/
  .g-popup {
    width: 100%;
    height: 70%;
    background-color: #fff;
    border-top: 1px solid rgba(234, 234, 234, .8);
    box-sizing: border-box;
    position: fixed;
    z-index: 199;
    bottom: 0;
    left: 0;
    display: none;
    animation: popup .4s ease-out forwards;
  }

  /*弹出层动画*/
  @keyframes popup {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }

  .m-pop-top {
    width: 100%;
    height: 85px;
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #e1e1e1;
  }

  .m-pop-top > div:nth-child(1) {
    width: 100px;
    height: 100px;
    float: left;
    overflow: hidden;
    border-radius: 5px;
    margin-right: 10px;
    transform: translateY(-35px);
  }

  .m-pop-top > div img {
    width: 100%;
    height: 100%;
  }

  .m-pop-top > div:nth-child(2) {
    margin-left: 110px;
    height: 100%;
  }

  .m-pop-top > div:nth-child(2) p {
    font-size: 16px;
    color: #f40000;
  }

  .m-pop-top i {
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: right;
    position: absolute;
    top: 7px;
    right: 10px;
    color: #999;
  }

  .g-option {
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    max-height: 50%;
    overflow-y: scroll;
    border-bottom: 1px solid #e1e1e1;
  }

  .g-option > div {
    overflow: hidden;
    width: 100%;
  }

  .g-option h3 {
    margin-bottom: 10px;
  }

  .g-option ul {
    overflow: hidden;
    margin-bottom: 5px;
  }

  .g-option li {
    display: inline-block;
    float: left;
    padding: 0 7px;
    margin-right: 10px;
    margin-bottom: 10px;
    background: #f6f6f6;
    border-radius: 7px;
    color: #333;
  }

  .g-product-num {
    width: 100%;
    height: 45px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    border-bottom: 1px solid #e1e1e1;

  }

  .g-product-num > div {
    flex: 5;
    line-height: 24px;
  }

  .g-product-num > div:nth-child(2) {
    text-align: right;
  }

  .m-product-num p {
    display: inline-block;
    border: 1px solid #e1e1e1;
    height: 25px;
    box-sizing: border-box;
    border-radius: 2px;
    font-size: 14px;
  }

  .m-product-num span {
    display: inline-block;
    width: 26px;
    height: 24px;
    text-align: center;
    box-sizing: border-box;
    border-right: 1px solid #e1e1e1;
  }

  .m-product-num span:nth-of-type(2) {
    border-right: none;
    border-left: 1px solid #e1e1e1;
  }

  .m-product-num input {
    width: 36px;
    height: 22px;
    border: none;
    padding: 2px;
    box-sizing: border-box;
    text-align: center;
  }

  .g-toDu {
    width: 100%;
    height: 43px;
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: center;
    font-size: 14px;
    line-height: 43px;
    color: #fff;
  }

  .g-toDu a {
    color: #fff;
  }

  .g-toDu > div:nth-child(1) {
    background-color: #ffb03f;
    flex: 5;
  }

  .g-toDu > div:nth-child(2) {
    background-color: #f23030;
    flex: 5;
  }

  .g-option .selected {
    background: red;
    color: #fff;
  }

  /*限时活动*/
  .p-activity {
    height: 60px;
  }

  .p-activity > div {
    float: left;
    height: 100%;
  }

  .p-activ-l {
    width: 65%;
    background: linear-gradient(to right, #f22c8d, #f23259);
    color: #fff;
    padding: 7px 10px;
    box-sizing: border-box;
  }

  .p-activ-l > h3 strong {
    display: inline-block;
    line-height: 18px;
    height: 20px;
    border: 1px solid #ff9fc5;
  }

  .p-activ-l > h3 span {
    display: inline-block;
    height: 20px;
    width: 20px;
    text-align: center;
    background-color: #fff3f8;
  }

  .p-activ-l > h3 em {
    padding: 0 7px;
  }

  .p-activ-l > h3 i {
    color: #f51322;
  }

  .p-activ-l > p {
    margin-top: 2px;
  }

  .p-activ-l > p em {
    font-size: 18px;
    font-weight: bold;
    margin-right: 5px;
  }

  .p-activ-r {
    width: 35%;
    background-color: #feeae9;
    text-align: center;
    padding: 5px 0;
    box-sizing: border-box;
  }

  .p-activ-r > h3 {
    color: #f23069;
  }

  .p-activ-r > p {
    margin-top: 5px;
    color: #333;
  }

  .p-activ-r > p em {
    line-height: 24px;
    text-align: center;
    color: #fff;
    background-color: #e32048;
    border-radius: 3px;
    padding: 3px;
  }

  .p-activ-r > p span {
    color: #333;
    font-weight: bold;
    margin: 0 1px;
  }

  /*商品视图*/
  .pt-info > ul {
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #fff;
    border-bottom: 1px solid #ededed;
  }

  .pt-info > ul > li {
    float: left;
    width: 33.33%;
    font-size: 14px;
  }

  .spec_attr {
    background-color: #fff;
    padding: 15px;
  }

  .spec_attr table {
    width: 100%;
  }

  .spec_attr td {
    border: 1px solid #ededed;
    line-height: 22px;
    padding: 7px 20px;
  }

  /*评价视图*/
  .pt-ev {
    background-color: #fff;
  }

  .pt-ev > h3 {
    line-height: 40px;
    padding: 0 15px;
    border-bottom: 1px solid #ededed;
  }

  .pt-ev > h3 > span {
    border: 1px solid #f51322;
    color: #f52322;
    padding: 4px 10px;
    border-radius: 4px;
  }

  .pt-ev > ul {
    overflow: hidden;
    text-align: center;
    padding: 10px 4px;
  }

  .pt-ev > ul > li {
    float: left;
    padding: 3px 7px;
    border-radius: 4px;
    background-color: #fbece7;
    color: #333;
    margin: 0 5px;
  }

  .pt-ev .act {
    background-color: #f51322;
    color: #fff;
  }

  /*评价列表*/
  .rev_list {
    padding: 10px;
    line-height: 22px;
  }

  .user_name {
    font-size: 14px;
    color: #333;
  }

  .el-rate {
    margin-bottom: 7px;
  }

  .rev_img_box > img {
    width: 75px;
    height: 75px;
    margin: 0 5px;
  }

  .shop_back {
    margin-top: 5px;
  }

  .seeBigRevImg {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }

  .seeBigRevImg h3 {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 18px;
    background-color: rgba(0, 0, 0, .4);
  }

  .seeBigRevImg h3 i {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 24px;
  }

  .seeBigRevImg img {
    width: 80%;
    max-height: 70%;
    margin-top: 20%;
    margin-left: 10%;
  }
</style>
