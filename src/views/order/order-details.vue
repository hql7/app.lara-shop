<template>
  <div class="g-lineItem-body">
    <!--头部-->
    <div class="g-lineItem-top">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <span>订单详情</span>
      <i class="iconfont icon-gengduo"></i>
    </div>
    <!--订单状态-->
    <div class="g-orderStatus">
      <div class="m-orderStatus">
        <p>
          {{orderStatus({sta: order_info.status, com: order_info.comment, ref: order_info.refund}).explain}}
        </p>
      </div>
      <div class="m-orderImg">
        <!--<img src="../../../static/img/status0.png" alt="待付款" v-if="lineItem.status==0">-->
        <!--<img src="../../../static/img/status1.png" alt="待收货" v-else-if="lineItem.status==1||lineItem.status==2">-->
        <!--<img src="../../../static/img/status3.png" alt="已完成" v-else-if="lineItem.status==3">-->
        <!--<img src="../../../static/img/return2.png" alt="售后" v-if="lineItem.return!=3&&lineItem.return!=0">-->
      </div>
    </div>
    <!--商品信息-->
    <div class="g-lineItem">
      <div class="m-lineItem">
        <p><label>订单编号：</label>{{order_info.order_no}}</p>
        <p><label>下单时间：</label>{{order_info.create_time}}</p>
        <p><label>店铺名称：</label><span class="c-blue">{{order_info.shop_name}}</span></p>
        <p><label>配送信息：</label><span>{{order_info.accept_addr}}</span></p>
        <p v-if="order_info.invoice_name"><label>发票抬头：</label><span>{{order_info.invoice_name}}</span></p>
        <!--<p>地址：{{lineItem.address}}</p>-->
      </div>
      <div class="m-lineList">
        <ul class="good-box">
          <li v-for="item in order_info.order_goods">
            <router-link :to="'/products?id='+item.good_id+'&pid='+item.product_id">
              <div class="u-lineImgBox">
                <img :src="item.img" alt="good">
              </div>
              <div class="u-lineContent">
                <h3>{{item.good_name}}</h3>
                <p>{{item.spec_str}}</p>
                <p><span>{{item.good_price}}</span>&nbsp;&nbsp;&nbsp;&nbsp;*
                  <span>{{item.goods_nums}}</span></p>
              </div>
            </router-link>
          </li>
        </ul>
        <div class="u-peiSong">
          <p> 配送方式： <span>{{express_info.com}}</span></p>
          <p> 买家留言： <span>{{order_info.user_remark}}</span></p>
          <p> 商品金额： <span>￥{{order_info.goods_price}}</span></p>
          <p> 赠送积分： <span>{{order_info.send_point}}</span></p>
          <p> 运费： <span>￥{{order_info.real_freight}}</span></p>
          <p> 发票税金： <span>￥{{order_info.taxes}}</span></p>
          <p> 优惠券： <span>￥-{{order_info.voucher_value}}</span></p>
          <p> 积分： <span>￥-{{order_info.point}}</span></p>
          <p>订单优惠：<span>￥-{{order_info.discount_amount}}</span></p>
          <p> 支付金额： <span>￥{{order_info.order_amount}}</span></p>
        </div>
      </div>
    </div>
    <div class="g-cao-zuo">
      <span
        v-for="item in orderStatus({sta: order_info.status, com: order_info.comment, ref: order_info.refund, oid:order_info.order_id}).handle"
        @click="item.fn">{{item.name}}</span>
    </div>
    <div class="g-logistics">
      <h3>物流信息：<span v-if="express_info.com">{{express_info.com}}快递</span><span
        v-else="">暂无信息</span></h3>
      <p v-if="express_info.nu">物流单号：{{express_info.nu}}</p>
      <div class="m-logistics" v-if="express_info.nu" v-for="item in express_info.data">
        <div>
          <i class="iconfont icon-wuliuguanli"></i>
        </div>
        <div>
          <h3>{{item.time}}</h3>
          <h3>{{item.location}}</h3>
          <p>{{item.context}}</p>
        </div>
      </div>
    </div>
    <Load :isLoading="isLoading"></Load>
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
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        order_info: {},
        express_info: {},
        refund: {
          id: null,
          type: 0, // 退款方式
          account: '', // 支付宝账户
          name: '',
          msg: ''
        }, // 申请退款信息
        dialogVisible: false,
        isLoading: true
      }
    },
    created() {
      this.get_order();
    },
    mounted: function () {
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 请求订单详情
      get_order: function () {
        this.axios.post(this.getApi('web/order_detail'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            order_id: this.$route.query.oid
          })
        ).then((res) => {
          this.isLoading = false;
          if (res.data.code === 0) {
            this.order_info = res.data.order_info;
            this.express_info = res.data.order_info.express_info;
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.isLoading = false;
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
          this.isLoading = false;
          // console.log(err);
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
              this.$router.go(-1);
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
      }
    },
    components: {Load}
  }
</script>

<style scoped>
  .g-lineItem-body {
    padding-top: 40px;
  }

  /*头部*/
  .g-lineItem-top {
    width: 100%;
    height: 40px;
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    padding: 0 15px;
    box-sizing: border-box;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    background-color: #fff;
  }

  .g-lineItem-top i:nth-of-type(1) {
    float: left;
  }

  .g-lineItem-top i:nth-of-type(2) {
    float: right;
  }

  /*订单状态*/
  .g-orderStatus {
    width: 100%;
    height: 100px;
    background: linear-gradient(to right, #fa5181, #ff2b49);
    box-sizing: border-box;
    padding: 10px 40px;
  }

  .m-orderStatus {
    height: 100%;
    max-width: 50%;
    line-height: 80px;
    font-size: 16px;
    color: #fff;
    float: left;
  }

  .m-orderImg {
    height: 100%;
    float: right;
  }

  .m-orderImg img {
    height: 100%;
  }

  /*商品信息*/
  .m-lineItem {
    width: 100%;
    padding: 10px 15px;
    border-top: 10px solid #e1e1e1;
    border-bottom: 10px solid #e1e1e1;
    box-sizing: border-box;
  }

  .m-lineItem label {
    display: inline-block;
    width: 65px;
  }

  .m-lineItem p {
    line-height: 23px;
  }

  .m-lineItem p:nth-child(4) {
    height: 46px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .good-box {
    padding: 15px;
  }

  .u-lineImgBox {
    width: 65px;
    height: 65px;
    float: left;
  }

  .u-lineImgBox img {
    width: 100%;
    height: 100%;
  }

  .m-store {
    height: 34px;
    padding: 0 10px;
    box-sizing: border-box;
    line-height: 34px;
  }

  .m-store i {
    margin: 0 5px;
  }

  .m-line {
    height: 85px;
    padding: 10px;
    background-color: #f5f5f5;
    box-sizing: border-box;
    border-bottom: 1px solid #e1e1e1;
  }

  .u-lineContent {
    margin-left: 65px;
    height: 65px;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .u-lineContent h3 {
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .u-lineContent p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .u-lineContent p:nth-of-type(2) span:nth-of-type(1) {
    color: #f40000;
    font-size: 14px;
  }

  .u-peiSong {
    font-size: 14px;
    color: #333;
    padding: 10px;
    margin-top: 5px;
    border-bottom: 1px solid #e1e1e1;
  }

  .u-peiSong p {
    width: 100%;
    line-height: 30px;
    padding: 0 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    word-break: keep-all;
  }

  .u-peiSong p span {
    color: #666;
    float: right;
    max-width: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    word-break: keep-all;
    margin-right: 10px;
  }

  /*去支付*/
  .g-payFor {
    height: 40px;
    line-height: 40px;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #f1f1f1;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .g-payFor a {
    display: inline-block;
    line-height: 26px;
    height: 26px;
    border: 1px solid #333;
    color: #333;
    padding: 0 10px;
    margin: 3px;
  }

  .g-payFor div {
    margin-top: 3px;
    float: left;
    height: 40px;
    font-size: 8px;
  }

  .g-payFor div p {
    line-height: 18px;
  }

  .g-payFor span:nth-of-type(1) {
    float: right;
  }

  .g-payFor span:nth-of-type(1) a:nth-child(2) {
    color: #f40000;
    border-color: #f40000;
  }

  .g-logistics {
    width: 100%;
    min-height: 60px;
    margin-top: 10px;
  }

  .g-logistics h3 {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: bold;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .g-logistics > p {
    padding: 0 15px;
    line-height: 22px;
  }

  .m-logistics {
    min-height: 40px;
    display: flex;
    border-bottom: 1px solid #e1e1e1;
  }

  .m-logistics div:nth-child(1) {
    flex: 1.5;
    text-align: center;
    position: relative;
  }

  .m-logistics div:nth-child(1) i {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 20px;
    color: #359a2b;
    transform: translate(-50%, -50%);
  }

  .m-logistics div:nth-child(2) {
    flex: 8.5;
    padding: 5px;
    box-sizing: border-box;
    line-height: 22px;
  }

  .m-logistics h3 {
    font-size: 12px;
    padding: 0;
  }

  /*操作*/
  .g-cao-zuo {
    height: 40px;
    line-height: 40px;
    text-align: right;
    padding: 0 10px;
    border-bottom: 1px solid #e1e1e1;
  }

  .g-cao-zuo span {
    padding: 5px 10px;
    background: #f51322;
    color: #fff;
    border-radius: 3px;
    margin-left: 10px;
  }

  .apply-refund > li {
    margin-top: 15px;
  }

</style>
