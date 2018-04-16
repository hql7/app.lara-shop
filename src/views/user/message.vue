<template>
  <div id="message" class="content">
    <!--头部-->
    <div class="g-title">
      <div><i class="iconfont icon-zuo" @click="goBack"></i></div>
      <div>消息中心</div>
      <div><i class="iconfont icon-gengduo1"></i></div>
    </div>
    <!--新闻列表-->
    <div class="g-news" v-if="list.length > 0">
      <div class="news-item" v-for="item in list" @click="toNews(item.id)">
        <h3 class="news-title">{{item.title}} <i
          class="iconfont icon-icon u-right"></i></h3>
        <p class="news-time">{{item.time}}</p>
      </div>
    </div>
    <div class="no_msg" v-else>
      暂无消息
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
        page: {
          index: 1,
          total: 1
        },
        type: 0, // 消息类型   0=系统通知   其他类型待定
        list: [],
        popup: false,
        isLoading: true
      }
    },
    created: function () {
      this.getMessage()
    },
    mounted() {
      window.addEventListener('scroll', this.pullUp, false); // 加载完成激活上拉加载函数
    },
    methods: {
      // 返回
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取消息
      getMessage(add) {
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/messages'),
          this.dafa({
            type: this.type,
            index: this.page.index,
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            add ? this.list = this.list.concat(res.data.list) : this.list = res.data.list; //合并还是覆盖
            this.page.index = res.data.fy_pgCur;
            this.page.total = res.data.fy_pgCount;
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.isLoading = false;
        })
      },
      // 去详情
      toNews: function (id) {
        this.list.forEach(item => {
          if (item.id === id) {
            this.popup = true;
            this.detail = this.base().utf8to16(this.base().base64decode(item.content))
          }
        })
      },
      close: function () {
        this.popup = false
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('message').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.total) {
          that.page.index++;
          that.getMessage(true); //加载更多
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
  .content {
    padding-top: 44px;
  }

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
    width: 100%;
    background-color: #fff;
  }


  .news-item {
    padding-bottom: 5px;
    border-bottom: 1px solid #e1e1e1;
    margin-bottom: 5px;
  }

  .news-title {
    font-size: 14px;
    color: #333;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .news-time {
    line-height: 20px;
    padding: 0 15px;
    color: #999;
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

  .no_msg {
    height: 120px;
    line-height: 120px;
    text-align: center;
    color: #999;
  }

</style>
