<template>
  <div id="log" class="log">
    <!--头部-->
    <div class="g-log-top"><i class="iconfont icon-zuo1" @click="goBack"></i><span>我的账单</span></div>
    <!--账单-->
    <div class="zhang_dan">
      <ul>
        <li v-for="item in log">
          <p class="c-333"><label>订单编号：</label>{{item.order_no}}</p>
          <h3 class="c-999"><label>备注：</label>{{item.intro}}</h3>
          <p>
            <span>余额{{item.amount_log}}</span>&nbsp;&nbsp;
            <span>{{item.amount}}</span>
          </p>
          <p><span>{{item.time}}</span></p>
        </li>
      </ul>
    </div>
    <!--搜索-->
    <!--<div class="log-search" v-if="search">
      <div class="m-log-top"><i class="iconfont icon-zuo1" @click="close_search"></i>
        &lt;!&ndash;<input type="search" placeholder="请输入搜索相关信息" v-model="what_for">&ndash;&gt;
        搜索记录
        <span @click="to_search">搜索</span>
      </div>
      <div class="date-search">
        <select v-model="type">
          <option v-for="item in type_select" :value="item.val">{{item.name}}</option>
        </select>
      </div>
      <div class="block date-search">
        <el-date-picker
          v-model="value_date1"
          align="right"
          type="date"
          placeholder="选择起始日期"
          :picker-options="pickerOptions1">
        </el-date-picker>
      </div>
      <div class="block date-search">
        <el-date-picker
          v-model="value_date2"
          align="right"
          type="date"
          placeholder="选择结束日期"
          :picker-options="pickerOptions2">
        </el-date-picker>
      </div>
    </div>-->
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        log: [],
        type: this.$route.query.l || '',
        page: {
          index: 1,
          total: 1
        },
        isLoading: true
      }
    },
    created() {
      this.get_log()
    },
    mounted: function () {
      window.addEventListener('scroll', this.pullUp, false);
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取日志
      get_log: function (add) {
        this.index = add ? this.index : 1;
        this.axios.post(this.getApi('web/balance_log'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            index: this.page.index,
            type: this.type
          })
        ).then((response) => {
          this.isLoading = false;
          if (response.data.code === 0) {
            add ? this.log = this.log.concat(response.data.list) : this.log = response.data.list; //合并还是覆盖
            this.page.index = response.data.fy_pgCur;
            this.page.total = response.data.fy_pgCount;
          } else {
            this.$message(response.data.msg)
          }
        }).catch(err => {
          this.isLoading = false;
        })
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('log').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.total) {
          that.page.index++;
          that.get_log(true); //加载更多
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
  .log {
    padding: 50px 0 0;
  }

  /*头部*/
  .g-log-top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    box-sizing: border-box;
    background-color: #fff;
    font-size: 16px;
    position: fixed;
    top: 0;
    left: 0;
    border-bottom: 1px solid #efefef;
  }

  .g-log-top span {
    margin-left: 35px;
    padding-left: 15px;
    border-left: 1px solid #d7d7d7;
  }

  .g-log-top a {
    float: right;
  }

  .g-log-top i, .m-log-top i {
    font-size: 22px;
    color: #fa2f56;
    line-height: 45px;
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: center;
  }

  /*账单*/
  .zhang_dan li {
    padding: 16px;
    font-size: 14px;
    line-height: 25px;
    border-bottom: 1px solid #efefef;
  }

  .zhang_dan li p strong {
    float: right;
  }

  .zhang_dan strong > span {
    margin-right: 5px;
  }

  /*.log-search {
    position: fixed;
    background-color: #fff;
    width: 100%;
    height: 100%;
    z-index: 9;
    top: 0;
    left: 0;
    animation: right_in linear .4s forwards;
  }

  @keyframes right_in {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  .m-log-top {
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-bottom: 10px solid #f7f6fb;
    font-size: 16px;
  }

  .m-log-top span {
    position: absolute;
    right: 0;
    top: 0;
    display: inline-block;
    width: 50px;
    text-align: center;
  }

  .date-search {
    text-align: center;
    margin-top: 20px;
  }

  .date-search select {
    width: 193px;
    height: 35px;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    background-color: #fff;
    padding-left: 10px;
  }*/
</style>
