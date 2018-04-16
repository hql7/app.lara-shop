<template>
  <div class="g-body">
    <div class="g-top">
      <!--<i class="iconfont icon-message"></i>-->
      购物车
      <span @click="bian_ji" v-if="cao_zuo">完成</span>
      <span @click="bian_ji" v-else>编辑</span>
    </div>
    <!--购物篮-->
    <div>
      <div class="g-cart" v-if="!hollow">
        <i class="iconfont icon-gouwuche01"></i> 您的购物车空空如也 赶快去逛逛吧~
      </div>
      <div class="g-carts" v-else>
        <h3><i class="iconfont icon-068zhanghuanquan"></i> 您正在安全购物环境中，请放心购物</h3>
        <div class="m-orderList">
          <ul>
            <li v-for="item in list">
              <div>
                <div class="m-orderLeft" @click="selProduct(item.product_id)">
                  <i class="iconfont icon-xuanzhong u-xuanzhong" v-if="item.selected"></i>
                  <i class="iconfont icon-iconziti50 u-weizhong" v-else></i>
                </div>
                <div class="m-orderRight">
                  <div><a @click="to_products(item.good_id,item.product_id)"><img :src="item.img"></a></div>
                  <div>
                    <h3><a @click="to_products(item.good_id,item.product_id)">{{item.good_name}}</a></h3>
                    <p><span v-for="(value, key) in item.spec">{{key}}:{{value}}</span></p>
                    <div>
                      <span>￥{{item.sell_price}}</span>
                      <div class="m-jiaJian">
                        <span class="u-jian" @click="jian(item)">-</span><input class="u-storeNum"
                                                                                type="number" @blur="cartNumLimit(item)"
                                                                                v-model.number="item.num"><span
                        class="u-jia"
                        @click="jia(item)">+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="g-jieSuan" v-if="hollow">
      <div class="m-checkAll"><i class=" iconfont icon-xuanzhong u-xuanzhong" @click="unSelAll"
                                 v-if="selectedAll"></i><i @click="selAll"
                                                           class="iconfont icon-iconziti50" v-else></i>&nbsp<span
      >全选</span></div>
      <div class="m-toPay" v-if="cao_zuo">
        <div class="u-toShou" @click="handle(1)">移入收藏</div>
        <div class="u-toDel" @click="handle(0)">删除</div>
      </div>
      <div class="m-toPay" v-else>
        <div class="u-money">金额：￥&nbsp{{countPrice ? countPrice : "0.00"}}</div>
        <div class="u-toPay" @click="topay">去结算</div>
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
        list: [],
        cao_zuo: false,
        isLoading: true
      }
    },
    created: function () {
      // 获取购物车
      this.get_allCart();
      // 定位当前tab
      this.$store.commit('setIndexRouter', 2);
    },
    computed: {
      // 购物车是否为空
      hollow: function () {
        if (this.list.length > 0) {
          return true
        }
      },
      // 计算总价
      countPrice: function () {
        //这里遍历全部选中商品，并且计算 单价 * 数量 的总价返回即可。
        if (this.list.length > 0) {
          let count = 0;
          this.list.forEach(item => {
            if (item.selected) {
              count += item.num * item.sell_price
            }
          });
          return count.toFixed(2)
        }
      },
      // 是否全选
      selectedAll: function () {
        let result = false;
        let count = 0;
        this.list.forEach(item => {
          if (!item.selected) {
            count++
          }
        });
        result = count === 0;
        return result
      }
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取购物车列表
      get_allCart: function () {
        if (this.getobjS('user')) {
          this.axios.post(this.getApi('web/carts'),
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token,
              product_id: '',
              num: ''
            })
          ).then((res) => {
            this.isLoading = false;
            if (res.data.code === 0) {
              // 创建盒子接收数据
              let box = res.data.list || [];
              // 本地扩展属性
              box.forEach(item => {
                item.selected = false
              });
              // 将新的盒子赋给列表
              this.list = box
            } else {
              this.$message(res.data.msg)
            }
          }).catch(err => {
            this.isLoading = false;
          })
        } else {
          this.isLoading = false;
        }
      },
      // 选中某件商品
      selProduct: function (id) {
        this.list.forEach(item => {
          if (item.product_id === id) {
            item.selected = !item.selected
          }
        })
      },
      // 增加某件商品
      jia: function (item) {
        if (item.num < item.store) {
          ++item.num
        }
      },
      // 减少某件商品
      jian: function (item) {
        if (item.num > 1) {
          --item.num
        }
      },
      // 直接更改输入框内容校验
      cartNumLimit(item) {
        if (!/^[1-9]\d*$/.test(item.num)) {
          item.num = 1;
          return false
        }
        if (item.num > item.store) {
          item.num = item.store;
          return false
        }
      },
      // 全选
      selAll: function () {
        this.list.forEach(item => {
          item.selected = true
        })
      },
      // 反选
      unSelAll() {
        this.list.forEach(item => {
          item.selected = false
        })
      },
      // 记录选中商品信息
      ji_lu: function () {
        let attr = [];
        this.list.forEach(item => {
          if (item.selected) {
            attr.push(item.product_id)
          }
        });
        return attr
      },
      // 操作 删除-收藏
      handle(val) {
        // val 0删除 1收藏
        let idList = this.ji_lu();
        if (idList.length > 0) {
          if (val === 0) {
            // 弹出删除确认
            this.$confirm('是否确认删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              cancelButtonClass: 'ele_btn',
              confirmButtonClass: 'ele_btn',
              customClass: 'ele_pop',
              type: 'info'
            }).then(() => {
              // 删除
              this.del(val)
            }).catch(() => {
              this.$message('已取消删除')
            })
          } else {
            // 收藏
            this.shou_cang(val)
          }
        } else {
          this.$message('请选择商品')
        }
      },
      // 删除
      del: function (val) {
        this.axios.post(this.getApi('web/del_cart'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            act_type: val,
            id_list: this.ji_lu()
          })
        ).then(res => {
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.get_allCart()
          }
        }).catch(err => {
          this.$message('请重试');
        })
      },
      // 去付款
      topay: function () {
        // 数据处理
        let data = [];
        this.list.forEach(item => {
          if (item.selected) {
            data.push({
              good_id: item.good_id,
              product_id: item.product_id,
              num: item.num
            })
          }
        });
        // 发送请求
        if (data.length > 0) {
          this.isLoading = true;
          this.axios.post(this.getApi('web/order_ready'),
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token,
              param: data
            })
          ).then(res => {
            this.isLoading = false;
            if (res.data.code === 0) {
              this.$router.push('/firm-order')
            } else {
              this.$message(res.data.msg);
            }
          }).catch(err => {
            this.isLoading = false;
            this.$message('请重试')
          })
        } else {
          this.$message('请选择商品')
        }
      },
      // 去商品页
      to_products: function (id, pid) { //购物车 图片和标题返回商品详情页
        this.$router.push({path: '/products', query: {id: id, pid: pid}})
      },
      // 编辑
      bian_ji: function () {
        this.cao_zuo = !this.cao_zuo
      },
      // 收藏
      shou_cang: function (val) {
        this.axios.post(this.getApi('web/del_cart'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            act_type: val,
            id_list: this.ji_lu()
          })
        ).then(res => {
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.get_allCart()
          }
        }).catch(err => {
          this.$message('请重试');
        })
      }
    },
    components: {Load}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*购物车*/
  .g-body {
    background: #f2f2f4;
    padding: 50px 0 110px;
  }

  .g-top {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #e1e1e1;
    height: 50px;
    line-height: 49px;
    background-color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
    position: fixed;
    z-index: 9;
    color: #333;
    top: 0;
    left: 0;
    font-size: 18px;
  }

  .g-top > i {
    position: absolute;
    top: 0;
    right: 0;
    display: inline-block;
    width: 40px;
    height: 40px;
    font-size: 22px;
    line-height: 42px;
    text-align: center;
  }

  .g-top span {
    position: absolute;
    top: 0;
    right: 30px;
    font-size: 14px;
    line-height: 50px;
  }

  /*购物栏*/
  .g-cart {
    height: 55px;
    text-align: center;
    background-color: #fff;
    line-height: 55px;
    color: #999;
  }

  .g-cart i {
    font-size: 28px;
    color: #999;
    margin: 0 10px;
    vertical-align: sub;
  }

  .g-carts > h3 {
    background-color: #fff;
    text-align: center;
    height: 36px;
    line-height: 36px;
  }

  .g-carts > h3 i {
    color: #32c9a3;
  }

  .m-orderList {
    width: 100%;
    height: 100%;
    padding: 10px 6px 0;
    box-sizing: border-box;
  }

  .m-orderList > h3 {
    height: 44px;
    line-height: 44px;
  }

  .m-orderList i {
    font-size: 22px;
  }

  .m-orderList > h3 i:nth-child(1) {
    margin: 0 10px;
  }

  .u-xuanzhong {
    color: #f40000;
  }

  .u-weizhong {
    color: #c1c1c1;
  }

  .m-orderList > h3, .m-orderList li {
    background-color: #fff;
    margin-bottom: 1px;
  }

  .m-orderList li > div {
    height: 110px;
    width: 100%;
    padding: 10px 0;
    box-sizing: border-box;
  }

  .m-orderLeft {
    float: left;
    width: 35px;
    height: 100%;
    text-align: center;
    line-height: 80px;
  }

  .m-orderRight {
    margin-left: 35px;
    height: 100%;
  }

  .m-orderRight > div:nth-child(1) {
    width: 85px;
    height: 85px;
    float: left;
  }

  .m-orderRight > div:nth-child(1) img {
    width: 100%;
    height: 100%;
  }

  .m-orderRight > div:nth-child(2) {
    margin-left: 85px;
    height: 85px;
    position: relative;
  }

  .m-orderRight > div:nth-child(2) h3 {
    padding: 0 10px;
    box-sizing: border-box;
    height: 30px;
    max-height: 30px;
    font-size: 13px;
    line-height: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    vertical-align: middle;
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-align: start;
    color: #232326;
    word-break: break-all;
  }

  .m-orderRight > div:nth-child(2) p {
    padding: 2px 10px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .m-orderRight > div:nth-child(2) > div {
    width: 100%;
    box-sizing: border-box;
    padding: 0 8px;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .m-orderRight > div:nth-child(2) > div > span {
    color: #f40000;
    font-size: 15px;
  }

  .m-jiaJian {
    display: inline-block;
    float: right;
    width: 84px;
    height: 24px;
  }

  .m-jiaJian * {
    float: left;
  }

  .m-jiaJian > span {
    display: inline-block;
    width: 25px;
    height: 24px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid #e1e1e1;
  }

  .m-jiaJian > span:nth-of-type(1) {
    border-right: none;
  }

  .m-jiaJian > span:nth-of-type(2) {
    border-left: none;
  }

  .u-storeNum {
    width: 34px;
    height: 24px;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #e1e1e1;
    vertical-align: middle;
  }

  /*结算部分*/
  .g-jieSuan {
    width: 100%;
    max-height: 100px;
    height: 45px;
    background-color: #fff;
    position: fixed;
    z-index: 9;
    bottom: 1.6rem;
    left: 0;
    line-height: 45px;
    box-shadow: 0 -2px 3px rgba(208, 186, 194, 0.5);
  }

  .m-checkAll {
    width: 80px;
    height: 100%;
    float: left;
    text-align: center;
  }

  .m-checkAll i {
    font-size: 22px;
    line-height: 38px;
  }

  .m-checkAll span {
    vertical-align: top;
  }

  .m-toPay {
    margin-left: 80px;
    height: 100%;
    display: flex;
    color: #333;
    font-size: 16px;
    justify-content: flex-end;
    box-sizing: border-box;
  }

  .u-money {
    flex: 6;
  }

  /*.u-del {
    flex: 2.5;
    height: 100%;
    background-color: #e1e1e1;
    text-align: center;
    color: #777;
  }*/

  .u-toPay {
    flex: 4;
    background: linear-gradient(to right, #ff366e, #ff2a49);
    text-align: center;
    color: #fff;
  }

  .u-toShou, .u-toDel {
    width: 40%;
    margin-left: 1px;
    background: linear-gradient(to right, #ff9902, #ff531a);
    text-align: center;
    color: #fff;
  }

  .u-toDel {
    background: linear-gradient(to right, #ff366e, #ff2a49);
  }

</style>
