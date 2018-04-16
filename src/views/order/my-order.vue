<template>
  <div id="g-myOrder" class="g-myOrder">
    <!--头部-->
    <div class="g-order-top"></div>
    <div class="order-top-h3"><i class="iconfont icon-zuo" @click="goBack"></i><span>{{title}}</span><i
      class="iconfont icon-gengduo"></i></div>
    <!--没有相关订单-->
    <div class="g-none" v-if="orderList.length==0">
      <p><span></span><i class="iconfont icon-yifukuan"></i><span></span></p>
      <p>您还没有相关订单</p>
    </div>
    <!--清单-->
    <div class="g-orderList" v-else>
      <ul id="orderList-ul">
        <li v-for="item in orderList">
          <router-link :to="'/order-details?oid='+item.order_id">
            <div class="m-orderList">
              <h3>订单号&nbsp;<span>{{item.order_no}}</span>
                <strong>{{orderStatus({sta: item.status, com: item.comment, ref: item.refund}).explain}}</strong>
              </h3>
              <div class="m-productBox" v-if="item.order_goods.length == 1">
                <img :src="item.order_goods[0].img" alt="商品">
                <i class="iconfont icon-gengduo1 more-or-gd" v-if="item.order_goods.length > 3"></i>
                <div>
                  <p>{{item.order_goods[0].good_name}}</p>
                  <p>{{item.order_goods[0].spec_str}}</p>
                  <p><span class="u-right">x{{item.order_goods[0].goods_nums}}</span></p>
                </div>
              </div>
              <div class="m-imgBox swiper-container" v-else>
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="ite in item.order_goods">
                    <img :src="ite.img" alt="good">
                  </div>
                </div>
              </div>
              <h4 v-if="item.refund!=0"><i
                class="iconfont icon-iconfonticonfonticonfont25"></i><span>{{title}}</span>&nbsp;&nbsp;
                <span
                  v-for="it in orderStatus({sta:item.status, com:item.comment, ref:item.refund}).handle">{{it.name}}</span>
                <!--<span v-if="item.return==1" class="u-red"
                      @click.stop.prevent="to_cancel(item.item_id,item.item_no)">待审核/取消</span>
                <span v-if="item.return==2" class="u-red" @click.stop.prevent="to_ask(item.item_id,item.item_no)">通过/查询原因</span>
                <span v-if="item.return==3" class="u-red" @click.stop.prevent="to_ask(item.item_id,item.item_no)">失败/查询原因</span>
                <span v-if="item.return==4">售后已完成</span>-->
              </h4>
              <p><span>金额：￥{{item.order_amount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>运费：￥{{item.real_freight}}</span>
              </p>
              <div class="u-stateTo">
                  <span
                    v-for="it in orderStatus({sta:item.status, com:item.comment, ref:item.refund, oid:item.order_id, no:item.order_no,pri:item.order_amount}).handle"
                    @click.prevent="it.fn">{{it.name}}</span>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
      <div class="no-more" v-if="no_more">~已经看到最后啦~</div>
    </div>
    <!--申请退款弹出-->
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
    </el-dialog>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'
  import Swiper from 'swiper/dist/js/swiper.min'
  import 'swiper/dist/css/swiper.min.css'

  export default {
    data() {
      return {
        title: "", // 订单类型标题
        orderList: [], // 订单列表
        page: {
          index: 1,
          count: 1, // 总页
          total: 1 // 总数
        }, // 分页信息
        type: this.$route.query.s || 0, // 0=全部订单  1=待付款  2=代发货  3=待收货  4=待评价  选择4时是直接跳到 我的评价 中的待评价列表
        dialogVisible: false,
        refund: {
          id: null,
          type: 0, // 退款方式
          account: '', // 支付宝账户
          name: '',
          msg: ''
        }, // 申请退款信息
        isLoading: true
      }
    },
    created() {
      this.get_order();
      this.estimateType();
    },
    mounted: function () {
      window.addEventListener('scroll', this.pullUp, false) // 加载完成激活上拉加载函数
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.push('/mine')
      },
      // 判断订单类型
      estimateType() {
        switch (this.type) {  //根据类型代号生成类型
          case 0:
            this.title = '全部订单';
            break;
          case 1:
            this.title = '待付款';
            break;
          case 2:
            this.title = '待发货';
            break;
          case 3:
            this.title = '待收货';
            break;
          case 4:
            this.title = '待评价';
            break;
          case 5:
            this.title = '售后单';
            break;
          default:
            this.title = '订单列表'
        }
      },
      // 获取订单
      get_order: function (add) {  //请求订单列表  传值为合并 无为覆盖
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/my_orders'),
          this.dafa({
            index: this.page.index,
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            type: this.type
          })
        ).then((response) => {
          this.isLoading = false;
          if (response.data.code === 0) {
            add ? this.orderList = this.orderList.concat(response.data.list) : this.orderList = response.data.list; //合并还是覆盖
            this.page.index = response.data.fy_pgCur;
            this.page.count = response.data.fy_pgCount;
            this.page.total = response.data.fy_count;
            this.$nextTick(() => {
              let swiperRev = new Swiper('.swiper-container', {
                slidesPerView: 4
              });
            })
          } else {
            this.$message(response.data.msg)
          }
        }).catch(() => {
          this.$message('请重试');
        })
      },
      // 订单状态分析
      /**
       *
       * @param data
       * sta status: 0->待付款，1->待发货，2->待收货，3->已完成
       * com comment: 0->未评价,1->已评价
       * ref refund: 0=正常订单 1=申请退款 2=申请被拒绝 3=退款成功
       * oid oid: -> 订单id
       * no no: ->订单编号
       * pri pri: ->订单价格
       * @returns {{explain: string, handle: Array, afterSale: string}}
       */
      orderStatus(data) {
        let status = {
          explain: '',
          handle: [],
          afterSale: ''
        };
        switch (data.sta) {
          case 0:
            status.explain = '待付款';
            status.handle = [
              {
                name: '取消订单',
                fn: () => {
                  this.cancelOrder(data.oid)
                }
              },
              {
                name: '立即支付',
                fn: () => {
                  this.toPay(data)
                }
              }
            ];
            break;
          case 1:
            status.explain = '待发货';
            if (data.ref === 0 || data.ref === 2) {
              status.handle = [
                {
                  name: '申请退款',
                  fn: () => {
                    this.dialogVisible = true;
                    this.refund.id = data.oid
                  }
                }
              ];
            } else if (data.ref === 1) {
              status.handle = [
                {name: '退款申请中', code: ''}
              ];
            } else if (data.ref === 3) {
              status.handle = [
                {name: '退款成功', code: ''}
              ];
            }
            break;
          case 2:
            status.explain = '待收货';
            status.handle = [
              {
                name: '确认收货',
                fn: () => {
                  this.confirmReceipt(data.oid)
                }
              }
            ];
            break;
          case 3:
            if (data.com === 0) {
              status.explain = '待评价';
              status.handle = [{
                name: '去评价',
                fn: () => {
                  this.toEvaluate(data.oid)
                }
              }];
            } else {
              status.explain = '已评价';
              status.handle = [{
                name: '删除',
                fn: () => {
                  this.delOrder(data.oid)
                }
              }];
            }
            break;
          case 4:
            status.explain = '已取消';
            status.handle = [{
              name: '删除',
              fn: () => {
                this.delOrder(data.oid)
              }
            }];
            break;
          case 5:
            status.explain = '已作废';
            status.handle = [{
              name: '删除',
              fn: () => {
                this.delOrder(data.oid)
              }
            }];
            break;
        }
        return status
      },
      // 取消订单
      cancelOrder(id) {
        this.$confirm('是否确认取消?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'ele_btn',
          confirmButtonClass: "ele_btn",
          customClass: 'ele_pop',
          type: 'warning'
        }).then(() => {
          this.isLoading = true;
          this.axios.post(this.getApi('web/order_cancel'),
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token,
              order_id: id
            })
          ).then(res => {
            this.isLoading = false;
            this.$message(res.data.msg);
            if (res.data.code === 0) {
              this.get_order()
            }
          }).catch(err => {
            this.isLoading = false;
            // console.log(err);
            this.$message('请重试');
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      // 去支付
      toPay(parameter) {
        this.$router.push('/pay');
        this.setobjS('order', {
          id: parameter.oid,
          no: parameter.no,
          real_price: parameter.pri
        })
      },
      // 申请退款
      applyRefund() {
        this.isLoading = true;
        this.dialogVisible = false;
        this.axios.post(this.getApi('web/order_refund'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            order_id: this.refund.id,
            type: this.refund.type,
            reason: this.refund.msg,
            payee_account: this.refund.account,
            payee_real_name: this.refund.name
          })
        ).then(res => {
          this.isLoading = false;
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.get_order()
          }
        }).catch(err => {
//          console.log(err);
          this.isLoading = false;
          this.$message('请重试');
        })
      },
      // 确认收货
      confirmReceipt(id) {
        this.$confirm('是否确认收货?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'ele_btn',
          confirmButtonClass: "ele_btn",
          customClass: 'ele_pop',
          type: 'warning'
        }).then(() => {
          this.isLoading = true;
          this.axios.post(this.getApi('web/order_receipt'),
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token,
              order_id: id
            })
          ).then(res => {
            this.isLoading = false;
            this.$message(res.data.msg);
            if (res.data.code === 0) {
              this.get_order()
            }
          }).catch(err => {
            this.isLoading = false;
            // console.log(err);
            this.$message('请重试');
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      // 去评价
      toEvaluate(id) {
        this.$router.push({path: '/to-evaluate', query: {oid: id}})
      },
      // 删除订单
      delOrder(id) {
        this.$confirm('确认要删除此订单?', '提示', {  //弹出删除确认
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'ele_btn',
          confirmButtonClass: "ele_btn",
          customClass: 'ele_pop',
          type: 'info'
        }).then(() => {
          this.isLoading = true;
          this.axios.post(this.getApi('web/order_del'), //确认删除订单
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token,
              order_id: id
            })
          ).then((res) => {
            this.isLoading = false;
            this.$message(res.data.msg);
            if (res.data.code === 0) {
              // 确认删除后重新获取订单列表
              this.get_order();
            }
          }).catch(() => {
            this.isLoading = false;
            this.$message('请重试');
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('g-myOrder').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.count) {
          that.page.index++;
          that.get_order(true); //加载更多
        }
      }
    },
    beforeDestroy() {
      // 解除滚动事件绑定
      window.removeEventListener("scroll", this.pullUp, false);
    },
    computed: {
      //最后页显示没有更多
      no_more: function () {
        if (this.orderList.length === this.count) return true;
      }
    },
    components: {Load, Swiper}
  }
</script>

<style scoped>
  .g-myOrder {
    background-color: #f4f4f4;
    color: #333;
    padding-top: 60px;
  }

  /*头部*/
  .g-order-top {
    width: 100%;
    height: 4.15rem;
    position: fixed;
    top: 0;
    left: 0;
    background: linear-gradient(to right, #ff2764, #f82546);
  }

  .order-top-h3 {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    padding: 0 15px;
    color: #fff;
    box-sizing: border-box;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    background: linear-gradient(to right, #ff2764, #f82546);
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
  .g-orderList {
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

  .m-productBox, .m-imgBox {
    width: 100%;
    height: 80px;
    background-color: #f8f8f8;
    overflow: hidden;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .m-productBox img, .m-imgBox img {
    width: 70px;
    height: 70px;
    margin: 5px 5px 5px 0;
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
    /*display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;*/
  }

  .m-productBox > div > h5 {
    line-height: 26px;
    height: 20px;
  }

  .m-productBox > div > h5 s {
    margin-left: 10px;
    color: #999;
  }

  .no-more {
    height: 80px;
    line-height: 80px;
    color: #999;
    text-align: center;
  }

  .apply-refund > li {
    margin-top: 15px;
  }

</style>
