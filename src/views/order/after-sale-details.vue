<template>
  <div id="g-myOrder" class="g-myOrder">
    <!--头部-->
    <!--<div class="g-order-top"></div>-->
    <div class="order-top-h3"><i class="iconfont icon-zuo" @click="goBack"></i><span>售后详情</span><i
      class="iconfont icon-gengduo"></i></div>
    <!--售后状态-->
    <div class="af-status">
      <h3>{{orderStatus(info.status)}}</h3>
      <p>{{info.apply_time}}</p>
    </div>
    <!--退款金额-->
    <div class="af-money">
      <p>退款总金额 <em class="u-right c-red">￥{{info.amount}}</em></p>
      <h6></h6>
      <p>退回账户余额 <em class="u-right c-999">￥{{info.amount}}</em></p>
    </div>
    <!--售后进度-->
    <div class="af-schedule">
      <div class="af-time-line">

      </div>
      <div class="af-btn">
        <button @click="cancelAfter">取消服务单</button>
        <p class="c-999">取消服务单将撤销售后服务，如果您的订单已经在售后服务中请谨慎操作</p>
      </div>
    </div>
    <!--商家收货信息-->
    <div class="seller-info" v-if="info.status===1">
      <div class="sr-address">
        <h3>商家收货信息</h3>
        <p>收货人：{{info.seller_info.seller_name}}&nbsp;&nbsp;&nbsp;&nbsp;{{info.seller_info.seller_mobile}}</p>
        <p>收货地址：{{info.seller_info.location}}</p>
      </div>
      <div class="sr-say">
        <h3>退货说明</h3>
        <h4 class="c-333">七天无理由退货需要注意一下几点</h4>
        <p>1.保证商品未使用过，不影响二次销售。</p>
        <p>2.请用纸条写上：订单号、姓名、电话号码、退货原因、放在退回包裹内。</p>
        <p>3.请用原箱子，包装好退回。</p>
        <p>4.寄出后，请向客服团购退回快递底单，方便客服为您跟进。</p>
        <p>5.请用普通快递退回即可，不接受到付款。</p>
        <p>6.退货运费买家自理.</p>
      </div>
      <div class="sr-warning">
        <p>未与商家协商一致，请勿使用到付或平邮，以免商家拒签货物</p>
        <p>交易的钱款还在商城账户，确保您资金安全</p>
        <p>请填写真实退货物流信息，逾期未填写，退货申请将关闭</p>
      </div>
    </div>
    <!--物流信息-->
    <div class="af-submit" v-if="info.status===1">
      <ul class="af-wl">
        <li><label>快递公司</label>
          <select v-model="express.id">
            <option v-for="item in WL" :value="item.id">{{item.name}}</option>
          </select></li>
        <li><label>快递单号</label><input type="text" v-model="express.no" placeholder="商家可通过物流单号快速受理"></li>
      </ul>
      <button @click="submitWL">确认提交</button>
    </div>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        rid: this.$route.query.rid, // 售后单id
        info: {
          status: 1,
          apply_time: '2017-09-09 09:09:09',
          amount: '12312',
          seller_info: {
            seller_name: 'asdf',
            seller_mobile: 12213423423,
            location: 'asfdsfsdfdfsdf'
          }
        },
        WL: [], // 物流列表
        express: {
          id: null,
          no: ''
        }, // 物流信息
        isLoading: true
      }
    },
    created() {
      this.getAfterDetails()
    },
    mounted: function () {
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取售后单详情
      getAfterDetails() {
        this.axios.post(this.getApi('web/after_detail'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            return_id: this.rid
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            this.info = res.data.info;
            // 状态为审核通过时获取快递公司列表
            if (res.data.info.status === 1) {
              this.getWLlist()
            }
          }
        }).catch(err => {
          this.isLoading = false;
          this.$message('请重试')
        })
      },
      // 获取物流公司
      getWLlist() {
        this.axios.post(this.getApi('root/auth/express_company_list')
        ).then(res => {
          if (res.data.code === 0) {
            this.WL = res.data.list
          }
        })
      },
      // 服务状态
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
      // 取消服务单
      cancelAfter() {
        this.isLoading = true;
        this.axios.post(this.getApi('web/after_cancel'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            return_id: this.rid
          })
        ).then(res => {
          this.isLoading = false;
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.getAfterDetails()
          }
        }).catch(err => {
          this.isLoading = false;
          this.$message('请重试')
        })
      },
      // 提交物流信息
      submitWL() {
        this.isLoading = true;
        this.axios.post(this.getApi('web/after_send'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            return_id: this.rid,
            express_company_id: this.express.id,
            express_no: this.express.no
          })
        ).then(res => {
          this.isLoading = false;
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.getAfterDetails();
          }
        }).catch(err => {
          this.isLoading = false;
          this.$message('请重试');
        })
      }
    },
    computed: {},
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

  /*售后状态*/
  .af-status {
    height: 110px;
    background-color: #ff4200;
    color: #fff;
    padding: 25px 0 0 40px;
    box-sizing: border-box;
  }

  .af-status > h3 {
    font-size: 18px;
    margin-bottom: 5px;
  }

  .af-money {
    font-size: 14px;
    color: #333;
    background-color: #fff;
    border-bottom: 1px solid #e4e4e4;
    padding: 0 15px;
    margin-bottom: 12px;
  }

  .af-money > p {
    line-height: 66px;
  }

  .af-money > h6 {
    height: 1px;
    background-color: #e6e6e6;
  }

  .af-money em {
    font-size: 18px;
  }

  /*售后进度*/
  .af-schedule {
    padding: 15px;
    background-color: #fff;
  }

  .af-btn {
    margin-top: 15px;
  }

  .af-btn > button {
    width: 124px;
    height: 32px;
    background-color: #f51322;
    color: #fff;
    border: none;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  /*卖家收货信息*/
  .seller-info {
    margin-top: 12px;
    padding: 15px;
    background-color: #fff;
  }

  .seller-info h3 {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .seller-info p {
    line-height: 22px;
  }

  .sr-say {
    margin-top: 15px;
  }

  .sr-warning {
    color: #999;
    padding: 10px 0;
    border-top: 1px solid #e4e4e4;
    margin-top: 15px;
  }

  .af-wl li {
    padding: 0 15px;
    height: 38px;
    line-height: 38px;
    border-top: 1px solid #cecece;
    border-bottom: 1px solid #cecece;
    margin-bottom: 18px;
  }

  .af-wl label {
    color: #333;
    font-size: 14px;
    margin-right: 20px;
  }

  .af-wl select {
    width: 70%;
    height: 36px;
    border: none;
  }

  .af-wl input {
    width: 70%;
    height: 36px;
    line-height: 36px;
    border: none;
  }

  .af-submit {
    background-color: #fff;
    padding: 15px 0 30px;
  }

  .af-submit > button {
    width: 124px;
    height: 32px;
    background-color: #f51322;
    color: #fff;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    margin-left: 15px;
  }

</style>
