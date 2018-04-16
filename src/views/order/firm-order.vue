<template>
  <div class="confirmOrder">
    <!--头部-->
    <div class="g-confirm-top">
      <i class="iconfont icon-zuo" @click="goBack"></i><span>确认订单</span>
    </div>
    <!--用户收货信息-->
    <div class="g-co-user">
      <div>
        <i class="iconfont icon-dizhi"></i>
      </div>
      <div class="m-co-user">
        <router-link to="/address?ci=true" v-if="address.id">
          <p>
            <span>收货人：{{address.accept_name}}</span><span>{{address.mobile}}</span>
          </p>
          <p>收货地址：{{address.address}}</p>
        </router-link>
        <router-link class="no-address" to="/address?ci=true" v-else><p>请选择收货地址</p></router-link>
      </div>
    </div>
    <!--彩带-->
    <div class="g-caiDai"></div>
    <!--商品-->
    <div class="g-confirm-order">
      <h3>订单信息</h3>
      <div class="m-product-box" v-for="item in goods">
        <div class="box-l">
          <router-link :to="'/products?id='+item.good_id"><img :src="item.img" alt="good"></router-link>
        </div>
        <div class="box-r">
          <h2>
            <router-link :to="'/products?id='+item.good_id">{{item.good_name}}</router-link>
          </h2>
          <p>{{item.spec_str}}</p>
          <h3><span class="c-red">￥{{item.price}}</span><span>运费：{{item.ship_money}}</span><span
            class="u-right">×{{item.num}}</span>
          </h3>
        </div>
      </div>
      <div class="g-conGn-list">
        <div class="m-leave-msg">
          <div>买家留言：</div>
          <div><input type="text" placeholder="选填" class="u-leaveMessage" v-model="remark"></div>
        </div>
        <div v-if="is_nvoice.sys_open" class="firm-invoice" @click="openPopup(0)"><span>发票</span><strong
          class="u-right">{{is_nvoice.msg}} <i
          class="iconfont icon-xuanze"></i></strong></div>
        <div class="firm-invoice" @click="openPopup(1)"><span>优惠券</span><strong class="u-right">{{is_coupon.msg}}<i
          class="iconfont icon-xuanze"></i></strong></div>
        <div class="firm-invoice" @click="openPopup(2)"><span>订单优惠</span><strong class="u-right">{{is_prom.msg}}<i
          class="iconfont icon-xuanze"></i></strong></div>
      </div>
      <div class="g-confirm-total">
        <p><span>{{amount_info.total_num}} 件商品，</span>总商品金额：<label
          class="c-red">{{(amount_info.total_price * 100 / 100).toFixed(2)}}</label>
        </p>
        <p>总运费：<label>{{(amount_info.total_ship * 100 / 100).toFixed(2)}}</label></p>
        <p>积分余额：<label>{{amount_info.user_point}}</label></p>
        <p v-if="amount_info.total_point>=0 && amount_info.user_point>=0" class="total-point">
          使用积分抵扣：
          <label>
            -{{is_point.money}}
            <i class="iconfont icon-xuanzhong c-red" v-if="is_point.use" @click="computePointMoney(false)"></i>
            <i class="iconfont icon-iconziti50 c-eee" v-else @click="computePointMoney(true)"></i>
          </label>
        </p>
        <p>赠送积分：<label>{{amount_info.send_point}}</label></p>
        <p>商品优惠券：<label>-{{(is_coupon.as_money * 100 / 100).toFixed(2)}}</label></p>
        <p v-if="prom_orders.length>0">订单促销：<label>-{{(is_prom.as_money * 100 / 100).toFixed(2)}}</label></p>
        <p v-if="is_nvoice.use">发票税金：<label>{{is_nvoice.tax}}</label></p>
      </div>
    </div>
    <!--提交订单-->
    <div class="g-submit-order">
      <div @click="placeOrder">提交订单</div>
      <div>实付款：&nbsp;<span>￥{{actualPayment}}</span></div>
    </div>
    <!--遮罩层-->
    <div class="g-mask" v-if="maskShow" @click="closePopup"></div>
    <!--弹出层-->
    <!--发票-->
    <div class="g-popup pop-nvoice" v-if="maskShow && showType==0">
      <div class="pop-main">
        <h3>发票抬头</h3>
        <p class="c-red"><i class="iconfont icon-cuowu4"></i>&nbsp;&nbsp;开企业抬头发票须填写纳税人识别号，以免影响报销</p>
        <ul>
          <li><label>个人</label>
            <span>
            <i class="iconfont icon-xuanzhong c-red" v-if="is_nvoice.type==0"></i>
            <i class="iconfont icon-iconziti50 c-eee" v-else @click="choiceNvoice(0)"></i>
          </span></li>
          <li><label>企业</label>
            <span>
            <i class="iconfont icon-xuanzhong c-red" v-if="is_nvoice.type==1"></i>
            <i class="iconfont icon-iconziti50 c-eee" v-else @click="choiceNvoice(1)"></i>
          </span></li>
          <!--<li><label>不开发票</label>
            <span>
            <i class="iconfont icon-xuanzhong c-red" v-if="is_nvoice.type==2"></i>
            <i class="iconfont icon-iconziti50 c-eee" v-else @click="choiceNvoice(2)"></i>
          </span></li>-->
        </ul>
        <h3>收票人信息</h3>
        <ul class="nvoice-info">
          <li><label>发票抬头：</label><input type="text" v-model="is_nvoice.title" placeholder="姓名/企业名"></li>
          <li v-if="is_nvoice.type==1"><label>纳税人识别号：</label><input type="text" v-model="is_nvoice.code"></li>
          <li><label>发票税金：</label><input type="text" disabled v-model="is_nvoice.tax"></li>
        </ul>
      </div>
      <div class="pop-footer">
        <button @click="closePopup">取消</button>
        <button @click="makeSureNvoice">确定</button>
      </div>
    </div>
    <!--优惠券-->
    <div class="g-popup pop-coupon" v-if="maskShow && showType==1">
      <div class="pop-main">
        <h3 v-if="vouchers.length>0">优惠券</h3>
        <h3 v-else>暂无可用优惠券</h3>
        <ul>
          <li v-for="item in vouchers">
            <p class="c-red"><em>{{item.value}}</em>元</p>
            <h3>购满{{item.money}}仅使用（{{item.condition}}）</h3>
            <p>使用期限{{item.start_time}}-{{item.end_time}}</p>
            <strong class="coupon-i">
              <i class="iconfont icon-xuanzhong c-red" v-if="item.id == is_coupon.id"></i>
              <i class="iconfont icon-iconziti50 c-eee" v-else @click="choiceCoupon(item.id,item.value)"></i>
            </strong>
          </li>
        </ul>
      </div>
      <div class="pop-footer">
        <button @click="closePopup">取消</button>
        <button @click="makeSureCoupon">确定</button>
      </div>
    </div>
    <!--订单活动-->
    <div class="g-popup pop-prom" v-if="maskShow && showType==2">
      <div class="pop-main">
        <h3>订单优惠</h3>
        <ul>
          <li v-for="item in prom_orders"><label>{{item.name}} <b v-if="item.expression">（{{item.expression}}）</b>
          </label><span>
              <i class="iconfont icon-xuanzhong c-red" v-if="item.id == is_prom.id"></i>
            <i class="iconfont icon-iconziti50 c-eee" v-else @click="choiceProm(item.id,item.type,item.expression)"></i>
            </span></li>
        </ul>
      </div>
      <div class="pop-footer">
        <button @click="closePopup">取消</button>
        <button @click="makeSureProm">确定</button>
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
        maskShow: false,
        showType: 0, // 打开哪一个弹出层 0发票 1优惠券 2订单优惠
        address: {
          id: this.$route.query.aid,
          accept_name: '',
          mobile: '',
          address: ''
        }, // 地址信息
        goods: [], // 订单内商品
        amount_info: {}, // 价格信息
        vouchers: [], // 订单可用优惠券
        prom_orders: [], // 订单活动
        remark: '', // 留言
        is_nvoice: {
          sys_open: false, // 网站是否开启发票功能
          use: false, // 是否使用发票
          msg: '不开发票',
          type: null, // 发票类型 0->个人 1->企业
          title: '', // 发票抬头
          code: '', // 纳税人识别号
          tax_rate: 0, // 发票税率
          tax: 0, // 发票税金
          invoice: '' // 发票
        }, // 发票相关数据
        is_coupon: {
          msg: '无使用',
          use: false, // 是否使用优惠券
          id: null,
          as_money: 0 // 选用优惠券抵可用的金额
        }, // 优惠券相关数据
        is_point: {
          use: false, // 是否使用积分
          money: 0, // 此商品积分可抵用的金额
          p_money: '', // 一个积分可以抵用的金额
          as_money: 0 // 选用积分可少付的金额
        }, // 积分相关信息
        is_prom: {
          msg: '无选用',
          use: false, // 是否使用订单优惠
          id: null, // 所选订单优惠id
          type: null, // 所选订单优惠类型
          ex: '', // 所选优惠值
          as_money: 0 // 所选订单活动可抵扣的金额
        },
        isLoading: true
      }
    },
    created() {
      this.getOrderInfo();
      this.getShoppingConfig();
    },
    mounted: function () {

    },
    methods: {
      // 返回
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取订单信息
      getOrderInfo() {
        this.axios.post(this.getApi('web/order_confirm'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            addr_id: this.address.id
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            // 地址信息
            this.address = res.data.address;
            // 订单内商品信息
            this.goods = res.data.goods;
            // 价格信息
            this.amount_info = res.data.amount_info;
            // 订单可用优惠券
            this.vouchers = res.data.vouchers;
            // 订单活动
            this.prom_orders = res.data.prom_orders;
            // 调用积分金额计算
            this.usePointMoney()
          }
        }).catch(err => {
          this.isLoading = false;
        })
      },
      // 计算选用积分可抵金额数
      usePointMoney() {
        if (parseFloat(this.amount_info.user_point) >= parseFloat(this.amount_info.total_point)) {
          this.is_point.money = (parseFloat(this.amount_info.total_point) * parseFloat(this.amount_info.point_money)).toFixed(2)
        } else {
          this.is_point.money = (parseFloat(this.amount_info.user_point) * parseFloat(this.amount_info.point_money)).toFixed(2)
        }
      },
      // 是否选用积分
      computePointMoney(val) {
        this.is_point.use = val;
        if (val) {
          this.is_point.as_money = this.is_point.money
        } else {
          this.is_point.as_money = 0
        }
      },
      // 打开弹出层
      openPopup(val) {
        this.maskShow = true;
        this.showType = val
      },
      // 关闭弹出层(即取消操作)
      closePopup() {
        this.maskShow = false;
        switch (this.showType) {
          case 0:
            this.is_nvoice.use = false;
            this.is_nvoice.type = null;
            this.is_nvoice.tax = 0;
            this.is_nvoice.msg = '不开发票';
            break;
          case 1:
            this.is_coupon.use = false;
            this.is_coupon.as_money = 0;
            this.is_coupon.id = null;
            this.is_coupon.msg = '无使用';
            break;
          case 2:
            this.is_prom.use = false;
            this.is_prom.as_money = 0;
            this.is_prom.id = null;
            this.is_prom.msg = '无选用';
            break
        }
      },
      // 选择发票
      choiceNvoice(val) {
        this.is_nvoice.type = val;
        this.is_nvoice.tax = (parseFloat(this.is_nvoice.tax_rate) * parseFloat(this.amount_info.total_price) / 100).toFixed(2);
        this.is_nvoice.msg = val === 0 ? '个人' : '企业'
      },
      // 选择发票确定操作
      makeSureNvoice() {
        if (this.is_nvoice.type !== null) {
          this.is_nvoice.use = true;
          this.maskShow = false
        } else {
          this.$message('请选择发票类型')
        }
      },
      // 发票数据处理
      nvoiceDP() {
        let invoice = '';
        if (this.is_nvoice.use) {
          if (this.is_nvoice.type === 0) {
            invoice = `0:${this.is_nvoice.title ? this.is_nvoice.title : this.address.accept_name}`
          } else {
            invoice = `0:${this.is_nvoice.title}:${this.is_nvoice.code}`
          }
        } else {
          invoice = ''
        }
        return invoice
      },
      // 选择优惠券
      choiceCoupon(id, val) {
        this.is_coupon.id = id;
        this.is_coupon.as_money = parseFloat(val);
        this.is_coupon.msg = `-${val}`
      },
      // 选择优惠券确定操作
      makeSureCoupon() {
        if (this.is_coupon.id !== null) {
          this.is_coupon.use = true;
          this.maskShow = false;
        } else {
          this.closePopup()
        }
      },
      // 选择订单优惠活动
      choiceProm(id, val, ex) {
        this.is_prom.id = id;
        this.is_prom.type = val;
        this.is_prom.ex = ex;
        switch (val) {
          case 0:
            this.is_prom.as_money = (parseFloat(this.amount_info.total_price) - parseFloat(this.amount_info.total_price) * parseFloat(this.is_prom.ex) / 100).toFixed(2);
            this.is_prom.msg = `-${this.is_prom.as_money}`;
            break;
          case 1:
            this.is_prom.as_money = this.is_prom.ex;
            this.is_prom.msg = `-${this.is_prom.as_money}`;
            break;
          case 2:
            this.is_prom.as_money = 0;
            this.is_prom.msg = `${ex}倍积分`;
            break;
          case 4:
            this.is_prom.as_money = this.amount_info.total_ship;
            this.is_prom.msg = `-${this.is_prom.as_money}`;
            break;
        }
      },
      // 选择订单活动确定操作
      makeSureProm() {
        // 是否选则了活动
        if (this.is_prom.id !== null) {
          this.maskShow = false;
          this.is_prom.use = true;
        } else {
          this.closePopup()
        }
      },
      // 提交订单
      placeOrder() {
        if (this.address.id !== undefined) {
          this.isLoading = true;
          this.axios.post(this.getApi('web/create_order'),
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token,
              addr_id: this.address.id,
              remark: this.remark,
              voucher_id: this.is_coupon.use ? this.is_coupon.id : '',
              prom_order_id: this.is_prom.use ? this.is_prom.id : '',
              use_point: this.is_point.use ? 1 : 0,
              invoice: this.nvoiceDP()
            })
          ).then(res => {
            this.isLoading = false;
            if (res.data.code === 0) {
              this.$router.push('/pay');
              this.setobjS('order', res.data.order_info)
            } else {
              this.$message(res.data.msg)
            }
          }).catch(err => {
            this.isLoading = false;
            this.$message('请重试')
          })
        } else {
          this.$message('请选择收货地址')
        }
      },
      // 请求购物相关配置项信息
      getShoppingConfig() {
        this.axios.post(this.getApi('web/config_info'),
          `title=shopping`
        ).then(res => {
          if (res.data.code === 0) {
            // 发票相关
            this.is_nvoice.sys_open = res.data.info.open_invoice == '1' ? true : false
            this.is_nvoice.tax_rate = res.data.info.tax_invoice
            // 积分相关
            this.is_point.p_money = res.data.info.point_money
          }
        })
      }
    },
    computed: {
      actualPayment() {
        return (parseFloat(this.amount_info.total_price) + parseFloat(this.amount_info.total_ship) + parseFloat(this.is_nvoice.tax) - parseFloat(this.is_point.as_money) - parseFloat(this.is_coupon.as_money) - parseFloat(this.is_prom.as_money)).toFixed(2)
      }
    },
    components: {Load}
  }
</script>

<style scoped>
  .confirmOrder {
    padding-top: 45px;
    padding-bottom: 80px;
  }

  /*头部*/
  .g-confirm-top {
    width: 100%;
    padding: 0 10px;
    height: 45px;
    text-align: center;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(234, 234, 234, .8);
    position: fixed;
    top: 0;
    left: 50%;
    z-index: 11;
    transform: translateX(-50%);
    background-color: #fff;
    line-height: 45px;
    font-size: 14px;
    font-weight: bold;
  }

  .g-confirm-top i {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 40px;
    height: 40px;
  }

  /*用户信息*/
  .g-co-user {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    background-color: #fff;
  }

  .g-co-user div:nth-child(1) {
    flex: 1;
    text-align: center;
    line-height: 400%;
  }

  .g-co-user div:nth-child(1) i {
    color: #ff7e00;
    display: inline-block;
    animation: move .7s linear infinite;
  }

  @keyframes move {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-7%);
    }
    100% {
      transform: translateY(0);
    }
  }

  .g-co-user div:nth-child(2) {
    flex: 9;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .g-co-user div:nth-child(2) p:nth-child(1) {
    color: #333;
    font-size: 14px;
    margin-bottom: 3px;
    padding-right: 10px;
    box-sizing: border-box;
  }

  .g-co-user div:nth-child(2) p:nth-child(1) span:nth-child(2) {
    float: right;
  }

  .g-caiDai {
    width: 100%;
    height: 3px;
    background: url("../../assets/imgs/location-border.png") 0 0/25% 3px repeat-x;
    margin-bottom: 10px;
  }

  .no-address {
    display: block;
    line-height: 58px;
    text-align: center;
  }

  /*订单信息*/
  .g-confirm-order {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
  }

  .g-confirm-order > h3 {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .m-product-box {
    width: 100%;
    height: 115px;
    padding: 10px;
    box-sizing: border-box;
    background-color: #f2f3f4;
  }

  .box-l {
    width: 90px;
    height: 100%;
    overflow: hidden;
    float: left;
  }

  .box-l img {
    width: 100%;
    height: 100%;
  }

  .box-r {
    margin-left: 100px;
    height: 100%;
    line-height: 20px;
  }

  .box-r > h2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
    height: 40px;
  }

  .box-r > h2 a {
    color: #333;
  }

  .box-r > p {
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .box-r > h3 {
    margin-top: 10px;
    width: 100%;
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .box-r > h3 span {
    margin-right: 10px;
  }

  .m-conGn-list {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 32px;
    font-size: 14px;
    padding: 9px 5px;
    border-bottom: 1px solid #e1e1e1;
    box-sizing: border-box;
  }

  .m-conGn-list i {
    color: #999;
  }

  .m-tb span {
    display: inline-block;
    width: 32px;
    height: 32px;
    background-color: #f5f5f5;
    text-align: center;
  }

  .m-tb input {
    width: 48px;
    height: 32px;
    border: none;
    text-align: center;
  }

  .g-conGn-list > div {
    width: 100%;
    height: 50px;
    line-height: 32px;
    font-size: 14px;
    padding: 9px 5px;
    border-bottom: 1px solid #e1e1e1;
    box-sizing: border-box;
  }

  .m-leave-msg > div:nth-child(1) {
    float: left;
    max-width: 80px;
    height: 100%;
  }

  .m-leave-msg > div:nth-child(2) {
    margin-left: 75px;
  }

  .u-leaveMessage {
    height: 31px;
    width: 100%;
    padding-left: 10px;
    box-sizing: border-box;
    border: none;
  }

  .g-confirm-total {
    margin-top: 10px;
    line-height: 30px;
    box-sizing: border-box;
    color: #333;
    text-align: right;
  }

  .g-confirm-total label {
    display: inline-block;
    width: 25%;
  }

  .total-point i {
    vertical-align: -1px;
    margin-left: 3px;
  }

  /*提交订单*/
  .g-submit-order {
    width: 100%;
    height: 45px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    box-sizing: border-box;
    border-top: 1px solid #e1e1e1;
    line-height: 44px;
    font-size: 14px;
    color: #333;
  }

  .g-submit-order div:nth-child(1) {
    float: right;
    width: 120px;
    color: #fff;
    background: linear-gradient(to right, #ff366e, #ff2a49);
    text-align: center;
  }

  .g-submit-order div:nth-child(2) {
    margin-right: 120px;
    text-align: right;
    padding: 0 10px;
    box-sizing: border-box;
    color: #f40000;
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
    min-height: 65%;
    background-color: #fff;
    color: #333;
    border-top: 1px solid rgba(234, 234, 234, .8);
    box-sizing: border-box;
    position: fixed;
    z-index: 199;
    bottom: 0;
    left: 0;
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

  .pop-main {
    padding: 15px;
    overflow-y: scroll;
    margin-bottom: 40px;
  }

  .pop-main > h3 {
    height: 44px;
    line-height: 44px;
    font-size: 14px;
  }

  .pop-main > ul {
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
    margin: 10px 0;
  }

  .pop-main .nvoice-info {
    border-bottom: none;
  }

  .nvoice-info label {
    display: inline-block;
    width: 100px;
    text-align: right;
  }

  .nvoice-info input {
    width: 150px;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    border: 1px solid #ddd;
    margin-left: 5px;
    box-sizing: border-box;
  }

  .pop-main li {
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #eee;
  }

  .pop-main li > span {
    float: right;
  }

  .pop-coupon li {
    position: relative;
    height: 100px;
    line-height: 22px;
    padding-top: 20px;
    box-sizing: border-box;
  }

  .pop-coupon li h3 {
    margin-top: 10px;
  }

  .pop-coupon li em {
    font-size: 18px;
  }

  .coupon-i {
    position: absolute;
    top: 40px;
    right: 0;
  }

  .pop-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-top: 1px solid #eee;
    background-color: #fff;
  }

  .pop-footer > button {
    float: left;
    width: 50%;
    height: 100%;
    color: #f51322;
    border: none;
    background-color: transparent;
  }
</style>
