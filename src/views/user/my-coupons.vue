<template>
  <div id="account" class="account">
    <!--头部-->
    <div class="g-account-top"><i class="iconfont icon-zuo" @click="goBack"></i><span>我的优惠券</span></div>
    <!--选项卡-->
    <div class="q-card">
      <span :class="{'c-red':status===0}" @click="choiceCard(0)">未使用</span><span :class="{'c-red':status===1}"
                                                                                 @click="choiceCard(1)">已使用</span><span
      :class="{'c-red':status===2}" @click="choiceCard(2)">已过期</span>
    </div>
    <!--优惠券-->
    <div class="g-quan">
      <ul>
        <li v-for="item in list">
          <router-link :to="'/search?qid='+item.id">
            <div class="m-quan-box">
              <div class="quan_num" :class="{quan_num_gone:status==1}">
                <h3>￥<span>{{item.value}}</span></h3>
                <p>满{{item.money}}可用</p>
              </div>
              <div class="quan_title" :class="{quan_title_gone:status==1}">
                <h3>{{item.condition}}</h3>
                <p>{{item.start_time}}-{{item.end_time}}</p>
                <i class="iconfont icon-yishiyong" v-if="item.status==1"></i>
                <i class="iconfont icon-expire" v-if="item.status==2"></i>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <!--激活优惠券-->
    <div class="active_cou" @click="dialogVisible = true">激活</div>
    <!--优惠券弹出-->
    <el-dialog class="act_cou_pop"
               title="激活优惠券"
               :visible.sync="dialogVisible"
               size="large">
      <input type="text" placeholder="请输入优惠券账户" v-model="active_cou.act">
      <input type="text" placeholder="请输入优惠券密码" v-model="active_cou.pas">
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="subActCou">确 定</el-button>
  </span>
    </el-dialog>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        page: {
          index: 1,
          total: 1
        },
        type: 0, // 类型  0=全部类型  其他待定
        status: 0, // 优惠券状态   0=未使用  1=已使用  2=已失效
        list: [],
        dialogVisible: false, // 激活优惠券
        active_cou: {
          act: '',
          pas: ''
        }, // 激活优惠券账号密码
        isLoading: true
      }
    },
    created: function () {
      this.getCoupons()
    },
    mounted: function () {
      window.addEventListener('scroll', this.pullUp, false);
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 选项卡
      choiceCard(val) {
        this.status = val;
        this.page.index = 1;
        this.getCoupons()
      },
      // 获取优惠券列表
      getCoupons(add) {
        this.page.index = add ? this.page.index : 1;
        this.axios.post(this.getApi('web/my_voucher'),
          this.dafa({
            index: this.page.index,
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            type: this.type,
            status: this.status
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            add ? this.list = this.lisList.concat(res.data.list) : this.list = res.data.list; //传值合并 无值覆盖
            this.page.index = res.data.fy_pgCur;
            this.page.total = res.data.fy_pgCount;
          }
        }).catch(err => {
          this.isLoading = false;
        })
      },
      // 提交激活优惠券
      subActCou() {
        if (!this.active_cou.act) {
          this.$message('请输入优惠券账号')
        } else if (!this.active_cou.pas) {
          this.$message('请输入优惠券密码')
        } else {
          this.isLoading = true;
          this.axios.post(this.getApi('web/voucher_active'),
            this.dafa({
              user_id: this.getobjS('user').id,
              token: this.getobjS('user').token,
              account: this.active_cou.act,
              password: this.active_cou.pas,
            })
          ).then(res => {
            this.isLoading = false;
            this.dialogVisible = false;
            this.$message(res.data.msg);
            if (res.data.code === 0) {
              this.getCoupons()
            }
          }).catch(err => {
            this.isLoading = false;
            this.$message('网络连接失败！请重试');
          })
        }
      },
      // 上拉加载
      pullUp() {
        let that = this;
        let top = document.body.scrollTop || document.documentElement.scrollTop,
          screenHeight = window.screen.availHeight,
          appHeight = document.getElementById('collection').scrollHeight;
        if ((top + screenHeight >= appHeight) && that.page.index < that.page.total) {
          that.page.index++;
          that.getCoupons(true); //加载更多
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
  .account {
    padding-bottom: 30px;
    background-color: #f0f0f0;
  }

  /*头部*/
  .g-account-top {
    position: relative;
    width: 100%;
    height: 45px;
    background-color: #fff;
    padding: 0 10px;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 45px;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
  }

  .g-account-top > i {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
  }

  .q-card {
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
  }

  .q-card > span {
    display: inline-block;
    width: 33.33%;
    text-align: center;
  }

  /*优惠券*/
  .g-quan {
    padding: 0 15px;
  }

  .m-quan-box {
    margin-top: 15px;
    height: 80px;
    display: flex;
    background-color: #fff;
    font-size: 14px;
  }

  .quan_num {
    padding-top: 5px;
    flex: 3.2;
    background-color: #fd5555;
    color: #fff;
    text-align: center;
  }

  .quan_num_gone {
    background-color: #b6b6b6;
  }

  .quan_num h3 span {
    font-size: 24px;
  }

  .quan_title {
    flex: 6.8;
    padding: 7px 40px 0 12px;
    position: relative;
  }

  .quan_title > i {
    position: absolute;
    top: 7px;
    right: 10px;
    font-size: 26px;
    color: #999;
  }

  .quan_title h3 {
    line-height: 21px;
    height: 42px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
  }

  .quan_title_gone > h3 {
    color: #999;
  }

  .quan_title p {
    color: #999;
    font-size: 12px;
    margin-top: 3px;
  }

  /*激活*/
  .active_cou {
    position: fixed;
    right: 0;
    bottom: 20%;
    background-color: rgba(72, 70, 70, .6);
    color: #fff;
    padding: 5px 15px;
    border-radius: 3px;
  }

  .act_cou_pop input {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    border: 1px solid #ededed;
    border-radius: 3px;
    margin-bottom: 20px;
    box-sizing: border-box;
  }
</style>
