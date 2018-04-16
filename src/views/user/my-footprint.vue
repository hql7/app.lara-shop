<template>
  <div id="footprint" class="footprint">
    <!--头部-->
    <div class="g-collection-head">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <span>我的足迹</span>
    </div>
    <!--收藏列表-->
    <div class="g-none" v-if="lisList.length==0">
      暂无浏览历史
    </div>
    <div v-else>
      <div class="g-Slist">
        <ul class="m-Slist">
          <li v-for="item in lisList">
            <router-link :to="'/products?id='+item.id+'&pid='+item.product_id">
              <div class="m-Sbox">
                <div class="u-SimgBox">
                  <img :src="item.img" alt="good"/>
                </div>
                <div class="u-Scontent">
                  <h3>{{item.name}}</h3>
                  <p>￥{{item.real_price}}
                    <span class="u-right" @click.prevent="delLog(item.id)"><i
                      class="iconfont icon-shanchu2"></i></span>
                  </p>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
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
        lisList: [],
        page: {
          index: 1,
          total: 1
        }, // 分页信息
        category: 0, // 分类ID   0=全部  其他为分类ID
        isLoading: true
      }
    },
    created: function () {
      this.get_attention(); //加载完成获取我的足迹
    },
    mounted: function () {
      window.addEventListener('scroll', this.pullUp, false);
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取我的足迹
      get_attention: function (add) {
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/visit_list'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            index: this.page.index,
            category: this.category
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            res.data.list = res.data.list || []
            add ? this.lisList = this.lisList.concat(res.data.list) : this.lisList = res.data.list; //传值合并 无值覆盖
            this.page.index = res.data.fy_pgCur;
            this.page.total = res.data.fy_pgCount;
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.isLoading = false;
        })
      },
      // 删除数据
      delLog(id) {
        this.isLoading = true;
        this.axios.post(this.getApi('web/del_visit'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            good_id: id
          })
        ).then(res => {
          this.isLoading = false;
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.get_attention()
          }
        }).catch(err => {
          this.isLoading = false;
          this.$message('请重试');
        })
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('footprint').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.total) {
          that.page.index++;
          that.get_attention(true); //加载更多
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
  .footprint {
    padding-top: 50px;
  }

  /*头部*/
  .g-collection-head {
    position: fixed;
    top: 0;
    left: 50%;
    z-index: 9;
    transform: translateX(-50%);
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e1e1e1;
    box-sizing: border-box;
    background-color: #fff;
    padding: 0 10px;
    text-align: center;
    font-size: 14px;
  }

  .g-collection-head i {
    float: left;
  }

  /*收藏列表*/
  .g-none {
    width: 100%;
    text-align: center;
    height: 120px;
    line-height: 120px;
    color: #999;
    background-color: #f5f4f4;
  }

  .g-Slist {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .g-Slist li {
    height: 120px;
    padding: 10px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
  }

  .m-Sbox {
    width: 100%;
    height: 100%;
  }

  .u-SimgBox {
    width: 100px;
    height: 100px;
    float: left;
  }

  .u-SimgBox img {
    width: 100%;
    height: 100%;
  }

  .u-Scontent {
    margin-left: 100px;
    height: 100%;
    padding: 5px 10px;
  }

  .u-Scontent h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #232326;
    font-size: 15px;
    line-height: 20px;
    height: 40px;
  }

  .u-Scontent p:nth-of-type(1) {
    font-size: 16px;
    color: #f23030;
    margin-top: 5px;
  }

  .u-Scontent p:nth-of-type(2) span:nth-child(1) {
    margin-right: 10px;
  }

</style>
