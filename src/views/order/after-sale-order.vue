<template>
  <div id="g-myOrder" class="g-myOrder">
    <!--头部-->
    <!--<div class="g-order-top"></div>-->
    <div class="order-top-h3"><i class="iconfont icon-zuo" @click="goBack"></i><span>售后服务</span><i
      class="iconfont icon-gengduo"></i></div>
    <!--选项卡-->
    <div class="af-card">
      <ul>
        <li @click="changeCard(0)"><span :class="{'card-act':card===0}">申请退换货</span></li>
        <li @click="changeCard(1)"><span :class="{'card-act':card===1}">退换货记录</span></li>
        <li @click="changeCard(2)"><span :class="{'card-act':card===2}">退款记录</span></li>
      </ul>
    </div>
    <!--没有相关订单-->
    <div class="g-none" v-if="noOrder">
      <p><span></span><i class="iconfont icon-yifukuan"></i><span></span></p>
      <p>您还没有相关订单</p>
    </div>
    <!--可申请售后列表-->
    <div class="af-list" v-if="card==0">
      <ul>
        <li v-for="item in mayApplyList">
          <h3><span>订单编号：{{item.order_no}}</span><span>下单时间：{{item.create_time}}</span></h3>
          <div class="ol-box" v-for="ite in item.order_goods">
            <div class="img-box">
              <img :src="ite.good_img" alt="good">
            </div>
            <div class="good-box">
              <h3>{{ite.good_name}}</h3>
              <p>数量：{{ite.good_num}}
                <strong>
                  <!--<span v-if="ite.status==1" @click="seeAfterOgList(ite.og_id)">查看进度</span>-->
                  <span v-if="ite.can_apply==0" @click="toAfterSale(ite.og_id)">申请售后</span></strong>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--服务单列表-->
    <div class="sv-list af-list" v-if="card==1">
      <ul>
        <li v-for="item in serviceList">
          <h3><span>服务单号：{{item.return_no}}</span><span>申请时间：{{item.apply_time}}</span></h3>
          <div class="ol-box">
            <div class="img-box">
              <img :src="item.good_img" alt="good">
            </div>
            <div class="good-box-s">
              <h3>{{item.good_name}}</h3>
              <p>申请数量：{{item.apply_num}}</p>
              <p><b>{{orderStatus(item.status)}}</b>
                <span class="u-right" @click="seeAfterSaleDetail(item.return_id)">查看</span></p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--退款单列表-->
    <div class="rf-list af-list" v-if="card==2">
      <ul>
        <li v-for="item in refundOrderList">
          <h3><span>订单编号：{{item.order_no}}</span><span>申请时间：{{item.apply_time}}</span></h3>
          <div class="rf-box">
            <h3>退款金额：￥{{item.amount}}</h3>
            <h4>退款方式：{{item.channel}}</h4>
            <p>处理时间：{{item.handling_time}} <span class="u-right c-red">{{refundStatus(item.status)
              }}</span></p>
          </div>
        </li>
      </ul>
    </div>
    <!--查看订单内服务单列表-->
    <!--<el-dialog
      :visible.sync="dialogVisible"
      size="large">
      <div class="sv-list af-list">
        <ul>
          <li v-for="item in serviceList">
            <h3><span>服务单号：{{item.return_no}}</span><span>申请时间：{{item.apply_time}}</span></h3>
            <div class="ol-box">
              <div class="img-box">
                <img :src="item.good_img" alt="good">
              </div>
              <div class="good-box-s">
                <h3>{{item.good_name}}</h3>
                <p>申请数量：{{item.apply_num}}</p>
                <p><b>{{orderStatus(item.status)}}</b><span class="u-right"
                                                            @click="seeAfterSaleDetail(item.order_id)">查看</span></p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>-->
    <!--清单-->
    <!-- <div class="g-orderList" v-else>
       <ul id="orderList-ul">
         <li v-for="item in orderList">
           <router-link :to="'/order-details?oid='+item.order_id">
             <div class="m-orderList">
               <h3>订单号&nbsp;<span>{{item.order_no}}</span>
                 <strong>{{orderStatus({sta: item.status, com: item.comment, ref: item.refund}).explain}}</strong>
                 &lt;!&ndash;<strong v-if="order.return==0||order.return==3">
                   <span v-if="order.status==0">待付款</span>
                   <span v-if="order.status==1">待发货</span>
                   <span v-if="order.status==2">待收货</span>
                   <span v-if="order.status==3" class="u-999">
                         <i v-if="order.comment==0">未评价</i>
                         <i v-if="order.comment==1">已评价</i>
                     </span>
                 </strong>
                 <strong v-if="order.return==1">售后审核中</strong>
                 <strong v-if="order.return==2">允许退换货</strong>
                 <strong v-if="order.return==4" class="u-999">售后已完成</strong>&ndash;&gt;
               </h3>
               <div class="m-productBox">
                 <img v-for="ite in item.order_goods" :src="ite.img" alt="商品">
                 <div v-if="item.order_goods.length==1">
                   <p>{{item.order_goods[0].good_name}}</p>
                   <p>{{item.order_goods[0].spec_str}}</p>
                   <p><span class="u-right">x{{item.order_goods[0].goods_nums}}</span></p>
                 </div>
               </div>
               <h4 v-if="item.refund!=0"><i
                 class="iconfont icon-iconfonticonfonticonfont25"></i><span>{{title}}</span>&nbsp;&nbsp;
                 <span
                   v-for="it in orderStatus({sta:item.status, com:item.comment, ref:item.refund}).handle">{{it.name}}</span>
                 &lt;!&ndash;<span v-if="item.return==1" class="u-red"
                       @click.stop.prevent="to_cancel(item.item_id,item.item_no)">待审核/取消</span>
                 <span v-if="item.return==2" class="u-red" @click.stop.prevent="to_ask(item.item_id,item.item_no)">通过/查询原因</span>
                 <span v-if="item.return==3" class="u-red" @click.stop.prevent="to_ask(item.item_id,item.item_no)">失败/查询原因</span>
                 <span v-if="item.return==4">售后已完成</span>&ndash;&gt;
               </h4>
               <p><span>金额：￥{{item.order_amount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>运费：￥{{item.real_freight}}</span>
               </p>
               <div class="u-stateTo">
                   <span
                     v-for="it in orderStatus({sta:item.status, com:item.comment, ref:item.refund, oid:item.order_id, no:item.order_no,pri:item.order_amount}).handle"
                     @click.prevent="it.fn">{{it.name}}</span>
                 &lt;!&ndash;   <p v-if="order.status==0"><span
               @click.stop.prevent="toDel(order.order_id,order.order_no)">删除订单</span><span class="qu_zhi_fu"
                                                                                           @click.stop.prevent="to_pay(order.order_no,order.money,order.order_id)">去支付</span>
             </p>
             <p v-else-if="order.status==2||order.status==1"><a href="afterSales.html"
                                                                @click.stop="to_order(order.order_id,order.order_no)"><span>申请售后</span></a><span
               @click.stop.prevent="toOK(order.order_id,order.order_no)">确认收货</span>
             </p>
             <p v-else-if="order.status==3"><a href="evaluate.html" v-if="order.comment==0"
                                               @click.stop="to_order(order.order_id,order.order_no)"><span>去评价</span></a>
               <span v-if="order.comment==1">已完成</span>
             </p>&ndash;&gt;
               </div>
             </div>
           </router-link>
         </li>
       </ul>
       <div class="no-more" v-if="no_more">~已经看到最后啦~</div>
     </div>
     &lt;!&ndash;申请退款弹出&ndash;&gt;
     <el-dialog
       title="申请退款"
       :visible.sync="dialogVisible"
       size="large">
       <ul class="apply-refund">
         <li>
           <label>退款方式：</label>
           <span><el-radio class="radio" v-model="refund.type" :label="0">账户余额</el-radio></span>&nbsp;&nbsp;
           <span><el-radio class="radio" v-model="refund.type" :label="1">支付宝</el-radio></span>
         </li>
         <li v-if="refund.type==1">
           <el-input v-model="refund.account" placeholder="请输入您的支付宝账户"></el-input>
         </li>
         <li v-if="refund.type==1">
           <el-input v-model="refund.name" placeholder="请输入您的真实姓名"></el-input>
         </li>
         <li>
           <el-input type="textarea"
                     :rows="3" v-model="refund.msg" placeholder="为了更快的进行审核，请尽量填写详细描述信息"></el-input>
         </li>
       </ul>
       <span slot="footer" class="dialog-footer">
     <el-button @click="dialogVisible = false">取 消</el-button>
     <el-button type="primary" @click="applyRefund">确 定</el-button>
   </span>
     </el-dialog>-->
    <!--<div class="no-more" v-if="no_more">~已经看到最后啦~</div>-->
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        mayApplyList: [], // 可申请售后列表
        serviceList: [], // 服务单列表
        refundOrderList: [], // 退款列表
        page: {
          index: 1,
          count: 1, // 总页数
          total: 1
        }, // 分页信息
        card: 0, // 选项卡片 0可申请列表 1退换列表 2退款列表
        isLoading: true
      }
    },
    created() {
      this.getMayApplyOrder()
    },
    mounted: function () {
      window.addEventListener('scroll', this.pullUp, false);  // 加载完成激活上拉加载函数
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.push('/mine')
      },
      // 选择卡片
      changeCard(val) {
        this.card = val;
        this.page.index = 1;
        this.isLoading = true;
        switch (val) {
          case 0:
            this.getMayApplyOrder();
            break;
          case 1:
            this.getServiceList();
            break;
          case 2:
            this.getRefundOrder();
            break;
        }
      },
      // 获取可售后订单列表
      getMayApplyOrder(add) {  //请求订单列表  传值为合并 无为覆盖
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/after_goods'),
          this.dafa({
            index: this.page.index,
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token
          })
        ).then((response) => {
          this.isLoading = false;
          if (response.data.code === 0) {
            add ? this.mayApplyList = this.mayApplyList.concat(response.data.list) : this.mayApplyList = response.data.list; //合并还是覆盖
            this.page.index = response.data.fy_pgCur;
            this.page.count = response.data.fy_pgCount;
            this.page.total = response.data.fy_count;
            /*this.mayApplyList.push({ // 测试
              refund_id: 1,
              order_id: 1,
              order_no: 1,
              channel: 'aa',
              amount: 13,
              apply_time: '1242',
              status: 0,
              handling_idea: 'ds',
              handling_time: ''
            })*/
          } else {
            this.$message(response.data.msg)
          }
        }).catch(() => {
          this.isLoading = false;
          this.$message('请重试');
        })
      },
      // 获取服务单列表
      getServiceList(add) {  //请求订单列表  传值为合并 无为覆盖
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/after_list'),
          this.dafa({
            index: this.page.index,
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token
          })
        ).then((response) => {
          this.isLoading = false;
          if (response.data.code === 0) {
            add ? this.serviceList = this.serviceList.concat(response.data.list) : this.serviceList = response.data.list; //合并还是覆盖
            this.page.index = response.data.fy_pgCur;
            this.page.count = response.data.fy_pgCount;
            this.page.total = response.data.fy_count;
            /*this.serviceList.push({
              return_id: 1,
              return_no: 121312312,
              order_id: 1,
              order_no: 123,
              good_id: 1,
              good_img: '',
              good_name: '1242',
              apply_num: 2,
              apply_time: 'ds',
              status: 2
            }) // 测试*/
          } else {
            this.$message(response.data.msg)
          }
        }).catch(() => {
          this.isLoading = false;
          this.$message('请重试');
        })
      },
      // 获取退款列表
      getRefundOrder(add) {
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/refund_list'),
          this.dafa({
            index: this.page.index,
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token
          })
        ).then((response) => {
          this.isLoading = false;
          if (response.data.code === 0) {
            add ? this.refundOrderList = this.refundOrderList.concat(response.data.list) : this.refundOrderList = response.data.list; //合并还是覆盖
            this.page.index = response.data.fy_pgCur;
            this.page.count = response.data.fy_pgCount;
            this.page.total = response.data.fy_count;
            /*this.refundOrderList.push({ // 测试
              refund_id: 1,
              order_id: 1,
              order_no: 1,
              channel: 'aa',
              amount: 13,
              apply_time: '1242',
              status: 0,
              handling_idea: 'ds',
              handling_time: '214242'
            })*/
          } else {
            this.$message(response.data.msg)
          }
        }).catch(() => {
          this.isLoading = false;
          this.$message('请重试');
        })
      },
      // 查看可售后订单内的售后单
      seeAfterOgList(id) {

      },
      // 去申请售后
      toAfterSale(id) {
        this.$router.push({path: '/apply-after-sale', query: {id: id}})
      },
      // 查看售后详情
      seeAfterSaleDetail(id) {
        this.$router.push({path: '/after-sale-details', query: {rid: id}})
      },
      // 服务订单状态
      orderStatus(val) {
        let status = '';
        switch (val) {
          case 0:
            status = '待审核';
            break;
          case 1:
            status = '审核通过';
            break;
          case 2:
            status = '审核失败';
            break;
          case 3:
            status = '已发货';
            break;
          case 4:
            status = '已完成';
            break;
          case 5:
            status = '已取消';
            break;
          case 6:
            status = '已收货';
            break;
          case 7:
            status = '已拒签';
            break;
        }
        return status
      },
      // 退款订单状态
      refundStatus(val) {
        let status = '';
        switch (val) {
          case 0:
            status = '待审核';
            break;
          case 1:
            status = '审核失败';
            break;
          case 2:
            status = '退款成功';
            break;
          default:
            status = '审核中';
        }
        return status
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('g-myOrder').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.count) {
          that.page.index++;
          switch (this.card) {
            case 0:
              this.getMayApplyOrder(true);
              break;
            case 1:
              this.getServiceList(true);
              break;
            case 2:
              this.getRefundOrder(true);
              break;
          }
        }
      }
    },
    beforeDestroy() {
      // 解除滚动事件绑定
      window.removeEventListener("scroll", this.pullUp, false);
    },
    computed: {
      // 是否为空
      noOrder() {
        let status = false;
        switch (this.card) {
          case 0:
            status = this.mayApplyList.length > 0 ? false : true;
            break;
          case 1:
            status = this.serviceList.length > 0 ? false : true;
            break;
          case 2:
            status = this.refundOrderList.length > 0 ? false : true;
            break;
        }
        return status
      }
    },
    components: {Load}
  }
</script>

<style scoped>

  .g-myOrder {
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
    width: 33.33%;
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
    line-height: 20px;
    overflow:hidden;
    text-overflow:ellipsis;
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
