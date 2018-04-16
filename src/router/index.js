import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // 重定向首页
    {
      path: '/',
      redirect: '/index'
    },
    // 登陆视图
    {
      path: '/login',
      component: resolve => require(['../views/login/login.vue'], resolve)
    },
    // 注册视图
    {
      path: '/register',
      component: resolve => require(['../views/login/register.vue'], resolve)
    },
    // 找回密码
    {
      path: '/find-pass',
      component: resolve => require(['../views/login/find-pass.vue'], resolve)
    },
    // 首页视图
    {
      path: '/index',
      component: resolve => require(['../views/index/index.vue'], resolve),
      children: [
        {
          path: '/',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 0,
          component: resolve => require(['../views/index/home.vue'], resolve)
        },
        {
          path: '/classify',
          name: 1,
          component: resolve => require(['../views/index/classify.vue'], resolve)
        },
        {
          path: '/cart',
          name: 2,
          component: resolve => require(['../views/index/cart.vue'], resolve)
        },
        {
          path: '/mine',
          name: 3,
          component: resolve => require(['../views/index/mine.vue'], resolve)
        }
      ]
    },
    // 搜索页视图
    {
      path: '/search',
      component: resolve => require(['../views/good/search.vue'], resolve)
    },
    // 商品详情页
    {
      path: '/products',
      component: resolve => require(['../views/good/products.vue'], resolve)
    },
    // 限时抢购
    {
      path: '/group-flash',
      component: resolve => require(['../views/good/group-flash.vue'], resolve)
    },
    // 商品促销
    {
      path: '/promotion',
      component: resolve => require(['../views/good/promotion.vue'], resolve)
    },
    // 领券中心
    {
      path: '/coupons',
      component: resolve => require(['../views/good/coupons.vue'], resolve)
    },
    // 文章中心
    {
      path: '/article',
      component: resolve => require(['../views/good/article.vue'], resolve)
    },
    // 确认订单
    {
      path: '/firm-order',
      component: resolve => require(['../views/order/firm-order.vue'], resolve)
    },
    // 我的订单
    {
      path: '/my-order',
      component: resolve => require(['../views/order/my-order.vue'], resolve)
    },
    // 订单详情
    {
      path: '/order-details',
      component: resolve => require(['../views/order/order-details.vue'], resolve)
    },
    // 售后服务
    {
      path: '/after-sale-order',
      component: resolve => require(['../views/order/after-sale-order.vue'], resolve)
    },
    // 申请售后
    {
      path: '/apply-after-sale',
      component: resolve => require(['../views/order/apply-after-sale.vue'], resolve)
    },
    // 售后详情
    {
      path: '/after-sale-details',
      component: resolve => require(['../views/order/after-sale-details.vue'], resolve)
    },
    // 订单评价列表
    {
      path: '/evaluate-order',
      component: resolve => require(['../views/order/evaluate-order.vue'], resolve)
    },
    // 订单晒单
    {
      path: '/to-evaluate',
      component: resolve => require(['../views/order/to-evaluate.vue'], resolve)
    },
    // 支付页
    {
      path: '/pay',
      component: resolve => require(['../views/order/pay.vue'], resolve)
    },
    // 收货地址
    {
      path: '/address',
      component: resolve => require(['../views/user/address.vue'], resolve)
    },
    // 我的收藏
    {
      path: '/my-collection',
      component: resolve => require(['../views/user/my-collection.vue'], resolve)
    },
    // 我的足迹
    {
      path: '/my-footprint',
      component: resolve => require(['../views/user/my-footprint.vue'], resolve)
    },
    // 我的优惠券
    {
      path: '/my-coupons',
      component: resolve => require(['../views/user/my-coupons.vue'], resolve)
    },
    // 我的余额
    {
      path: '/my-balance',
      component: resolve => require(['../views/user/my-balance.vue'], resolve)
    },
    // 我的积分
    {
      path: '/my-point',
      component: resolve => require(['../views/user/my-point.vue'], resolve)
    },
    // 充值
    {
      path: '/recharge',
      component: resolve => require(['../views/user/recharge.vue'], resolve)
    },
    // 提现
    {
      path: '/withdrawals',
      component: resolve => require(['../views/user/withdrawals.vue'], resolve)
    },
    // 日志
    {
      path: '/log',
      component: resolve => require(['../views/user/log.vue'], resolve)
    },
    // 消息
    {
      path: '/message',
      component: resolve => require(['../views/user/message.vue'], resolve)
    },
    // 绑定邮箱
    {
      path: '/bind-email',
      component: resolve => require(['../views/safe/bind-email.vue'], resolve)
    },
    // 绑定手机
    {
      path: '/bind-phone',
      component: resolve => require(['../views/safe/bind-phone.vue'], resolve)
    },
    // 绑定密码
    {
      path: '/bind-pass',
      component: resolve => require(['../views/safe/bind-pass.vue'], resolve)
    },
    // 站点关闭
    {
      path: '/siteClose',
      component: resolve => require(['../views/safe/siteClose.vue'], resolve)
    }
  ]
})
