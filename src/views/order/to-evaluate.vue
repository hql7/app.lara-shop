<template>
  <div id="g-login" class="g-login">
    <!--头部-->
    <div class="g-login-top">
      <i class="iconfont icon-zuo" @click="goBack"></i><span>商品评价</span>
      <button @click="issue">发布</button>
    </div>
    <!--商品评价-->
    <div class="g-evaluate">
      <p>订单编号：{{info.order_no}}</p>
      <p>下单时间：{{info.create_time}}</p>
      <ul>
        <li v-for="item in info.goods">
          <div class="block m-ping_jia">
            <div class="goods_img">
              <img :src="item.good_img" alt="">
              <span>评价</span>
            </div>
            <el-rate class="ping_fen" v-model="item.star" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
          </div>
          <div class="m-liu_yan">
            <textarea placeholder="请填写你的评价，分享给想买的他们吧" v-model="item.evaluate"></textarea>
          </div>
          <div class="up-img-box">
            <!--<up-load :good="item" :onSuccess="handleAvatarSuccess" :onRemove="handleRemove"></up-load>-->
            <item-upload
              :onSuccess="(res,file,fileList)=>{handleAvatarSuccess(res,file,fileList,item)}"
              :onRemove="(file,fileList)=>{handleRemove(file,fileList,item)}"
              :severType=7>
            </item-upload>
            <el-dialog :visible.sync="dialogVisible" size="large">
              <img width="100%" :src="imageUrl" alt="评价_lara-shop">
            </el-dialog>
          </div>
        </li>
      </ul>
    </div>
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'
  import ItemUpload from '@/components/upload.vue'

  export default {
    data() {
      return {
        oid: this.$route.query.oid,
        info: {},
        reviews: [],
        dialogVisible: false,
        imageUrl: '',
        isLoading: true
      }
    },
    created() {
      this.getReviewInfo()
    },
    methods: {
      // 返回
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取评价商品
      getReviewInfo() {
        this.axios.post(this.getApi('web/review_page'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            order_id: this.oid
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            res.data.info.goods.forEach(item => {
              item.evaluate = '';
              item.imgs = []
            });
            this.info = res.data.info;
          }
        }).catch(err => {
          this.isLoading = false;
        })
      },
      // 发布评价
      issue: function () {
        this.isLoading = true;

        // 处理评价数据
        let arr = [];
        this.info.goods.forEach(item => {
          let obj = {};
          obj.good_id = item.good_id;
          obj.product_id = item.product_id;
          obj.point = item.star;
          obj.content = item.evaluate;
          obj.imgs = item.imgs || [];
          arr.push(obj)
        });
        //评价请求
        this.axios.post(this.getApi('web/review_act'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            order_id: this.info.order_id,
            order_no: this.info.order_no,
            reviews: arr
          })
        ).then(response => {
          this.isLoading = false;
          this.$message(response.data.msg);
          if (response.data.code === 0) {
            this.$router.go(-1)
          }
        }).catch(err => {
          this.isLoading = false;
          this.$message('请重试');
        })
      },
      // 成功回调
      handleAvatarSuccess(res, file, fileList, data) {
        this.imageUrl = URL.createObjectURL(file.raw);
        if (res.key) {
          data.imgs.push(res.key)
        }
      },
      // 上传前钩子
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 移除图片
      handleRemove(file, fileList, data) {
        let arr = [];
        data.imgs.forEach(item => {
          if (file.response.key !== item) {
            arr.push(item)
          }
        });
        data.imgs = arr
      },
      // 查看大图
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    },
    components: {Load, ItemUpload}
  }
</script>

<style scoped>
  .g-login {
    padding-top: 45px;
    box-sizing: border-box;
  }

  /*头部*/
  .g-login-top {
    padding: 0 5px;
    width: 100%;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    color: #333;
    letter-spacing: 1px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    background: #f9f9f9;
  }

  .g-login-top span {
    font-weight: bold;
  }

  .g-login-top i {
    display: inline-block;
    width: 40px;
    height: 40px;
    color: #666;
    text-align: center;
    margin-right: 10px;
  }

  .g-login-top button {
    position: absolute;
    top: 0;
    right: 10px;
    border: none;
    background: transparent;
    color: #f40000;
    width: 60px;
    height: 45px;
    box-sizing: border-box;
    outline: none;
  }

  /*评价*/
  .g-evaluate {
    padding-top: 15px;
  }

  .g-evaluate > p {
    line-height: 22px;
    padding: 0 15px;
  }

  .g-evaluate li {
    width: 92%;
    margin: 15px 0 0 4%;
    padding: 12px;
    border: 1px solid #ededed;
    box-sizing: border-box;
    border-radius: 4px;
  }

  .m-ping_jia {
    height: 85px;
    line-height: 85px;
    display: flex;
  }

  .goods_img img {
    width: 55px;
    height: 55px;
    margin: 15px 10px;
    vertical-align: top;
  }

  .goods_img span {
    font-size: 14px;
    color: #333;
  }

  .ping_fen {
    margin: 33px 0 0 10px;
  }

  /*留言*/
  .m-liu_yan {
    height: 80px;
    border: 1px solid #ededed;
    margin: 10px 0;
    border-radius: 3px;
  }

  .m-liu_yan textarea {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    box-sizing: border-box;
    padding: 0 10px;
    line-height: 22px;
    outline: none;
  }

  /*图片上传*/
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader .el-upload--picture-card {
    font-size: 22px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    line-height: 86px;
    text-align: center;
  }

  .avatar {
    width: 78px;
    height: 78px;
    display: block;
  }
</style>
