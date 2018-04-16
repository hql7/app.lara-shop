<template>
  <div id="content">
    <!--头部-->
    <div class="g-title">
      <div><i class="iconfont icon-zuo" @click="goBack"></i></div>
      <div><span v-if="type==0">商城快讯</span><span v-else>帮助中心</span></div>
      <div><i class="iconfont icon-gengduo1"></i></div>
    </div>
    <!--新闻列表-->
    <div class="g-news">
      <div v-for="item in list">
        <!--<h2>{{item.category_name}}</h2>-->
        <h3 v-for="ite in item.articles" @click="toNews(ite.id)">{{ite.title}} <i
          class="iconfont icon-icon u-right"></i></h3>
      </div>
    </div>
    <!--新闻内容-->
    <div v-if="popup" class="detail">
      <h2><i class="iconfont icon-guanbi" @click="close"></i></h2>
      <div v-html="detail"></div>
    </div>
    <!--底部-->
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        detail: "",
        type: this.$route.query.t || 0,
        list: [],
        popup: false,
        isLoading: true
      }
    },
    created: function () {
      this.getArticle()
    },
    methods: {
      // 返回
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取文章
      getArticle() {
        this.axios.post(this.getApi('web/article_center'),
          this.dafa({type: this.type})
        ).then(res => {
          if (res.data.code === 0) {
            this.list = res.data.list;
            this.isLoading = false
          }
        })
      },
      // 去详情
      toNews: function (id) {
        this.isLoading = true;
        this.axios.post(this.getApi('web/article_detail'),
          `article_id=${id}`
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            this.popup = true;
            this.detail = this.base().utf8to16(this.base().base64decode(res.data.content))
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.isLoading = false;
          this.$message('请重试')
        })
      },
      close: function () {
        this.popup = false
      }
    },
    components: {Load}
  }
</script>

<style scoped>

  /*头部*/
  .g-title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    height: 44px;
    line-height: 44px;
    text-align: center;
    background-color: #f9f9f9;
    font-size: 16px;
  }

  .g-title div:nth-child(1) {
    width: 12%;
  }

  .g-title div:nth-child(2) {
    width: 76%;
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
  }

  .g-title div:nth-child(3) {
    width: 12%;
  }

  .g-title i {
    color: #ff0f0f;
  }

  /*分类选项*/

  /*新闻内容*/
  .g-news {
    margin-top: 44px;
    width: 100%;
    background-color: #fff;
  }

  .g-news h3 {
    font-size: 14px;
    color: #333;
    line-height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 5px 15px;
    border-bottom: 1px solid #e1e1e1;
    box-sizing: border-box;
  }

  .detail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    padding: 45px 25px 30px;
    background: #fff;
    box-sizing: border-box;
  }

  .detail h2 {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    padding: 0 15px;
  }

  .detail h3 {
    font-size: 12px;
    margin-bottom: 10px;
    color: #999;
  }

  .detail > div {
    color: #333;
    line-height: 22px;
    font-size: 12px;
  }

</style>
