<template>
  <div id="g-bindemail">
    <!--头部-->
    <div class="g-login-top">
      <i class="iconfont icon-guanbi" @click="goBack"></i><span>站点维护</span>
    </div>
    <div class="site_C">
      <p>亲爱的用户：</p>
      <p>站点维护，暂时关闭</p>
      <p>我们会尽快升级网站，给您带来更佳的购物体验</p>
    </div>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      }
    },
    components: {Load}
  }
</script>

<style scoped>

  /*头部*/
  .g-login-top {
    position: relative;
    padding: 0 5px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    color: #333;
    text-align: center;
    letter-spacing: 1px;
  }

  .g-login-top span {
    font-weight: bold;
  }

  .g-login-top i {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    color: #666;
  }

  .site_C {
    padding: 30px;
    font-size: 14px;
  }
</style>
