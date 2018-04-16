// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import store from './store'
import {
  Form,
  FormItem,
  Upload,
  Message,
  Input,
  CheckboxGroup,
  Checkbox,
  Dialog,
  Button,
  Rate,
  Radio,
  MessageBox
} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/css/clear.css'
import './assets/css/all.css'

// 按需加载
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Upload)
Vue.use(Input)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Dialog)
Vue.use(Button)
Vue.use(Rate)
Vue.use(Radio)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox

// 初始化网络请求组件(开启跨域请求)
Axios.defaults.withCredentials = true
Axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
// vue使用axios
Vue.prototype.axios = Axios

// 引入自定义插件
import util from './util/util'
import global from './util/global'

Vue.use(util)
Vue.prototype.global = global

Vue.config.productionTip = false


/* eslint-disable no-new */
// 先获取用户登录状态
// 需要登录权限的组件权限控制
router.beforeEach((to, from, next) => {
  // 是否存在登录信息
  let user = JSON.parse(localStorage.getItem('user'))
  // 需要登录权限的组件列表
  let loginArr = ['/coupons', '/firm-order', '/my-order', '/order-details', '/after-sale-order', '/apply-after-sale', '/after-sale-details', '/evaluate-order', '/to-evaluate', '/pay', '/address', '/my-collection', '/my-footprint', '/my-coupons', '/my-balance', '/my-point', '/recharge', '/withdrawals', '/log', '/message', '/bind-phone', '/bind-pass']
  // 路由控制
  if (loginArr.join(',').indexOf(to.path) !== -1 && !user) {
    next('login')
  } else {
    next()
  }
})

// 添加一个请求拦截器

Axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 添加一个响应拦截器
Axios.interceptors.response.use(function (response) {
  // 全局请求响应若code为2则登录过期 指向登录页 为3站点关闭
  if (response.data.code === 2) {
    router.push('/login')
  } else if (response.data.code === 3) {
    router.push('/siteClose')
  }
  // Do something with response data

  return response
}, function (error) {
  console.log(error);
  // Do something with response error
  return Promise.reject(error)
})

/*
window.$prod = process.env.NODE_ENV === 'production'
if (window.location.protocol === 'file:' || $prod) {
  let cordovaScript = document.createElement('script')
  cordovaScript.setAttribute('type', 'text/javascript')
  cordovaScript.setAttribute('src', 'cordova.js')
  document.body.appendChild(cordovaScript)
}

const vm = {
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
};

if ($prod) {
  window.document.addEventListener('deviceready', function () {
    new Vue(vm)
  }, false)
} else {
  new Vue(vm)
}
*/

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})


