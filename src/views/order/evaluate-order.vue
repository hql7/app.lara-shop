<template>
  <div id="g-evOrder" class="g-evOrder">
    <!--头部-->
    <!--<div class="g-order-top"></div>-->
    <div class="order-top-h3"><i class="iconfont icon-zuo" @click="goBack"></i><span>评价中心</span><i
      class="iconfont icon-gengduo"></i></div>
    <!--选项卡-->
    <div class="af-card">
      <ul>
        <li @click="changeCard(1)"><span :class="{'card-act':card===1}">待评价</span></li>
        <li @click="changeCard(2)"><span :class="{'card-act':card===2}">已评价</span></li>
      </ul>
    </div>
    <!--没有相关订单-->
    <div class="g-none" v-if="list.length==0">
      <p><span></span><i class="iconfont icon-yifukuan"></i><span></span></p>
      <p>您还没有相关订单</p>
    </div>
    <!--可申请售后列表-->
    <div class="af-list" v-else>
      <ul>
        <li v-for="item in list">
          <h3><span>订单编号：{{item.order_no}}</span><b class="c-red ">{{item.create_time}}</b></h3>
          <div class="ol-box" v-for="ite in item.order_goods">
            <div class="img-box">
              <img :src="ite.img" alt="good">
            </div>
            <div class="good-box">
              <h3>{{ite.name}}</h3>
              <p>x{{ite.goods_nums}}
                <b class="u-right">
                  <router-link :to="'/order-details?oid='+item.order_id" tag="span">订单详情</router-link>
                  <router-link :to="'/to-evaluate?oid='+item.order_id" tag="span" v-if="item.status==0">去评价
                  </router-link>
                  <span v-else>已评价</span></b>
              </p>
            </div>
          </div>
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
        list: [],
        page: {
          index: 1,
          count: 1, // 总页数
          total: 1
        }, // 分页信息
        card: 1, // 选项卡片 0=全部订单  1=待评价订单  2=已评价订单
        isLoading: true
      }
    },
    created() {
      this.getEvaOrder()
    },
    mounted: function () {
      window.addEventListener('scroll', this.pullUp, false); // 加载完成激活上拉加载函数
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 选择卡片
      changeCard(val) {
        this.card = val;
        this.getEvaOrder();
      },
      // 获取订单列表
      getEvaOrder(add) {
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/my_reviews'),
          this.dafa({
            index: this.page.index,
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            type: this.card
          })
        ).then((response) => {
          this.isLoading = false;
          if (response.data.code === 0) {
            if (response.data.list) {
              add ? this.list = this.list.concat(response.data.list) : this.list = response.data.list; //合并还是覆盖
              this.page.index = response.data.fy_pgCur;
              this.page.count = response.data.fy_pgCount;
              this.page.total = response.data.fy_count;
            }
            /*   this.list.push({
                 "order_id": "qe",   //订单ID
                 "order_no": "qwe",   //订单编号
                 "shop_id": "qwe",   //店铺ID
                 "shop_name": "qwe",   //店铺名称
                 "accept_name": "qwe",   //收货人姓名
                 "order_amount": "qwe",   //订单价格
                 "real_freight": "qwe",   //实际运费
                 "status": "1",   //状态  0=未评价  1=已评价
                 "order_goods": [     //订单内商品信息
                   {
                     "id": "qwe",   //商品ID
                     "name": "qe",   //商品名称
                     "spec_str": "asd",   //规格拼接字符串
                     "img": "",   //商品图片
                     "goods_nums": "3",  //商品数量
                   }]
               })*/
          } else {
            this.$message(response.data.msg)
          }
        }).catch(() => {
          this.isLoading = false;
          this.$message('请重试');
        })
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('g-evOrder').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.count) {
          that.page.index++;
          that.getEvaOrder(true)
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

  .g-evOrder {
    padding-top: 50px;
    background-color: #f1f2f6;
  }

  /*头部*/
  /*.g-order-top {
    width: 100%;
    height: 4.15rem;
    position: fixed;
    top: 0;
    left: 0;
    background: linear-gradient(to right, #ff2764, #f82546);
  }*/

  .order-top-h3 {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    padding: 0 15px;
    color: #333;
    box-sizing: border-box;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    background-color: #fff;
    border-bottom: 1px solid #e4e4e4;
    /*background: linear-gradient(to right, #ff2764, #f82546);*/
  }

  .order-top-h3 i {
    float: left;
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: left;
  }

  .order-top-h3 i:nth-of-type(2) {
    float: right;
    text-align: right;
  }

  .af-card {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #333;
    background-color: #fff;
    border-bottom: 1px solid #e4e4e4;
  }

  .af-card > ul {
    overflow: hidden;
  }

  .af-card li {
    float: left;
    width: 50%;
  }

  .af-card li span {
    display: inline-block;
    height: 39px;
  }

  .card-act {
    color: #f51322;
    border-bottom: 2px solid #f51322;
  }

  /*没有相关订单*/
  .g-none {
    text-align: center;
    height: 100%;
    padding-top: 80px;
    box-sizing: border-box;
  }

  .g-none p {
    margin: 20px 0;
    color: #c5c4c4;
  }

  .g-none p span {
    display: inline-block;
    width: 70px;
    height: 1px;
    background-color: #c5c4c4;
  }

  .g-none p i {
    font-size: 22px;
    color: #c5c4c4;
    margin: 0 20px;
    vertical-align: middle;
    /*vertical-align: -webkit-baseline-middle;*/
  }

  /*清单*/
  .af-list li {
    margin-top: 12px;
    background-color: #fff;
  }

  .af-list li > h3 {
    padding: 0 15px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
  }

  .af-list h3 > span {
    margin-right: 20px;
  }

  .ol-box {
    padding: 20px 15px;
    overflow: hidden;
    border-bottom: 1px solid #e4e4e4;
  }

  .img-box {
    float: left;
    width: 70px;
    height: 70px;
  }

  .img-box > img {
    width: 100%;
    height: 100%;
  }

  .good-box, .good-box-s {
    margin-left: 70px;
    padding-left: 15px;
    height: 70px;
  }

  .rf-box {
    padding: 10px 15px;
  }

  .rf-box > h3 {
    font-size: 16px;
    color: #333;
  }

  .rf-box > h4 {
    font-size: 14px;
    margin: 5px 0;
  }

  .rf-box > p {
    color: #999;
  }

  .good-box > h3 {
    color: #333;
    height: 40px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .good-box > p {
    margin-top: 10px;
    color: #999;
  }

  .good-box > p > strong {
    float: right;
  }

  .good-box > p span, .good-box-s > p span {
    border: 1px solid #f51322;
    color: #f52322;
    border-radius: 3px;
    padding: 3px 10px;
    margin-left: 10px;
  }

  .good-box-s > h3 {
    height: 22px;
    line-height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .good-box-s > p {
    margin-top: 5px;
    color: #999;
  }

  .good-box-s > p > b {
    color: #f51322;
  }

  /* .g-orderList {
     position: relative;
     z-index: 1;
   }

   .g-orderList ul {
     width: 100%;
     padding: 0 20px;
     box-sizing: border-box;
   }

   .g-orderList li {
     margin-bottom: 15px;
     background-color: #fff;
     border-radius: 5px;
     box-shadow: 2px 2px 2px rgba(165, 33, 33, .2);
   }

   .m-orderList {
     width: 100%;
   }

   .m-orderList > h3, .m-orderList > p, .m-orderList > h4 {
     width: 100%;
     padding: 0 15px;
     box-sizing: border-box;
     height: 38px;
     color: #333;
     line-height: 38px;
   }

   .m-orderList > h4 {
     border-bottom: 1px solid #f6f7f9;
   }

   .m-orderList > p {
     text-align: right;
   }

   .m-orderList > h4 i {
     margin-right: 5px;
   }

   .u-stateTo {
     width: 100%;
     padding: 9px 10px;
     box-sizing: border-box;
     height: 58px;
     color: #333;
     border-top: 1px solid #eeeeee;
     line-height: 40px;
     text-align: right;
   }

   .u-stateTo span {
     padding: 5px 10px;
     margin-left: 10px;
     vertical-align: super;
     box-sizing: border-box;
     border-radius: 3px;
     font-size: 16px;
     text-align: center;
     border: 1px solid #c3c3c3;
   }

   .u-stateTo p span:last-child {
     color: #ff5858;
     border-color: #ff5858;
   }

   .u-stateTo .qu_zhi_fu {
     border: 1px solid #ff2764;
     background: linear-gradient(to right, #ff2764, #f72543);
     color: #fff !important;
   }

   .m-orderList > h3 span {
     vertical-align: middle;
   }

   .m-orderList > h3 i:nth-of-type(1) {
     color: #ff5858;
     vertical-align: middle;
   }

   .m-orderList > h3 i:nth-of-type(2) {
     color: #999;
     font-size: 14px;
   }

   .m-orderList > h3 span:nth-of-type(1) {
     display: inline-block;
     white-space: nowrap;
     overflow: hidden;
     text-overflow: ellipsis;
     vertical-align: top;
   }

   .m-orderList > h3 strong {
     float: right;
     color: #ff5858;
     font-weight: normal;
   }

   .m-productBox {
     width: 100%;
     height: 80px;
     padding: 0 10px;
     box-sizing: border-box;
     background-color: #f8f8f8;
   }

   .m-productBox img {
     width: 70px;
     height: 70px;
     margin: 5px;
     float: left;
     border: 1px solid #e4e4e4;
     box-sizing: border-box;
   }

   .m-productBox > div {
     margin-left: 80px;
     height: 100%;
     padding: 10px;
     box-sizing: border-box;
     color: #333;
   }

   .m-productBox > div p {
     width: 100%;
     height: 20px;
     line-height: 20px;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
     !*display: -webkit-box;
     -webkit-line-clamp: 2;
     -webkit-box-orient: vertical;*!
   }

   .m-productBox > div > h5 {
     line-height: 26px;
     height: 20px;
   }

   .m-productBox > div > h5 s {
     margin-left: 10px;
     color: #999;
   }

   .apply-refund > li {
     margin-top: 15px;
   }*/

</style>
