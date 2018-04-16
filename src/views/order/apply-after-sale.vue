<template>
  <div id="g-myOrder" class="g-myOrder">
    <!--头部-->
    <!--<div class="g-order-top"></div>-->
    <div class="order-top-h3"><i class="iconfont icon-zuo" @click="goBack"></i><span>申请售后</span><i
      class="iconfont icon-gengduo"></i></div>
    <!--订单信息-->
    <div class="or-info ol-box">
      <div class="img-box">
        <img :src="goods_info.img" alt="good">
      </div>
      <div class="good-box">
        <h3>{{goods_info.name}}</h3>
        <p><span class="c-red">￥{{goods_info.price}}</span><span class="u-right">x{{goods_info.goods_nums}}</span></p>
        <p>可申请售后数量：{{goods_info.after_nums}}</p>
      </div>
    </div>
    <!--售后表单-->
    <div class="apply-form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="95px">
        <el-form-item label="服务类型" prop="type">
          <span @click="choiceType(0)" :class="{act:ruleForm.type===0}">退货退款 <i
            class="iconfont icon-xuanzhong3"></i></span>
          <span @click="choiceType(1)" :class="{act:ruleForm.type===1}">换货 <i
            class="iconfont icon-xuanzhong3"></i></span>
          <span @click="choiceType(2)" :class="{act:ruleForm.type===2}">维修 <i
            class="iconfont icon-xuanzhong3"></i></span>
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <input type="text" v-model.number="ruleForm.num" class="apply-num" @change="choiceNum"><b
          class="c-999">您最多申请{{goods_info.after_nums}}件</b>
        </el-form-item>
        <el-form-item label="退款方式" prop="way" v-if="ruleForm.type===0">
          <span :class="{act:ruleForm.way===0}" @click="choiceWay(0)">账户余额 <i
            class="iconfont icon-xuanzhong3"></i></span>
          <span :class="{act:ruleForm.way===1}" @click="choiceWay(1)">支付宝 <i
            class="iconfont icon-xuanzhong3"></i></span>
        </el-form-item>
        <el-form-item label="支付宝账户" prop="account" v-if="ruleForm.way===1">
          <input type="text" v-model="ruleForm.account" class="apply-way apl_input">
        </el-form-item>
        <el-form-item label="真实姓名" prop="rel_name" v-if="ruleForm.way===1">
          <input type="text" v-model="ruleForm.rel_name" class="apply-way apl_input">
        </el-form-item>
        <el-form-item label="货物状态" prop="status">
          <span :class="{act:ruleForm.status===1}" @click="choiceStatus(1)">未收到货 <i
            class="iconfont icon-xuanzhong3"></i></span>
          <span :class="{act:ruleForm.status===0}" @click="choiceStatus(0)">已收到货 <i
            class="iconfont icon-xuanzhong3"></i></span>
        </el-form-item>
        <el-form-item label="提交原因" prop="reason">
          <input type="text" v-model="ruleForm.reason" class="apply-way apl_input">
        </el-form-item>
        <el-form-item label="问题描述" prop="desc">
          <textarea v-model="ruleForm.desc" class="apply-desc"></textarea>
        </el-form-item>
        <el-form-item label="上传图片">
          <!--<el-upload
            :action="getApi('coms/upload-img')"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :on-success="upSuccess"
            :on-error="upError"
            :multiple="true">
            <i class="el-icon-plus"></i>
          </el-upload>-->
          <item-upload
            :onSuccess="upSuccess"
            :onRemove="handleRemove"
            :severType=8>
          </item-upload>
          <el-dialog v-model="dialogVisible" size="large">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="申请凭据" prop="evid">
          <span :class="{act:ruleForm.evid===0}" @click="choiceEvid(0)">有发票 <i
            class="iconfont icon-xuanzhong3"></i></span>
          <span :class="{act:ruleForm.evid===1}" @click="choiceEvid(1)">无发票 <i
            class="iconfont icon-xuanzhong3"></i></span>
        </el-form-item>
        <el-form-item label="收货地址">
          <p class="c-999">{{user_info.location}}</p>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <input type="text" v-model="ruleForm.name" class="apl_input">
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <input type="text" v-model="ruleForm.phone" class="apl_input">
          <p class="apl-ts">提交申请后客服专员可能与您电话沟通，请保持手机畅通</p>
        </el-form-item>
        <el-form-item>
          <button type="button" class="submitButton" @click="submitForm('ruleForm')">提交申请</button>
        </el-form-item>
      </el-form>
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
        og_id: this.$route.query.id,
        goods_info: {},
        user_info: {},
        ruleForm: {
          type: null, // 售后类型  0=退货退款 1=换货 2=维修
          num: 1, // 申请数量
          way: null, // 退款方式 0=退款到账户余额 1=支付宝
          account: '', // 支付宝账户
          rel_name: '', // 支付宝姓名
          status: null, // 货物状态 0=已收到货 1=未收到货
          evid: null, // 申请凭据 0=有发票  1=无发票
          reason: '', // 申请原因
          desc: '', // 问题描述
          name: '', // 联系人
          phone: null, // 联系方式
          imgs: [] // 申请售后图片
        },
        rules: {
          type: [
            {required: true, type: 'number', message: '请选择售后类型', trigger: 'blur'}
          ],
          num: [
            {required: true, type: 'number', message: '请选择可申请的数量', trigger: 'blur'}
          ],
          way: [
            {required: true, type: 'number', message: '请选择退款方式', trigger: 'blur'}
          ],
          account: [
            {required: true, message: '请填写支付宝账户', trigger: 'blur'}
          ],
          rel_name: [
            {required: true, message: '请填写开户人姓名', trigger: 'blur'}
          ],
          status: [
            {required: true, type: 'number', message: '请选择货物状态', trigger: 'blur'}
          ],
          evid: [
            {required: true, type: 'number', message: '请选择申请凭据', trigger: 'blur'}
          ],
          reason: [
            {required: true, message: '请填写申请原因', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请填写问题描述', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请填写联系人姓名', trigger: 'blur'}
          ],
          phone: [
            {validator: this.va.vaPhone, trigger: 'blur'}
          ]
        },
        dialogImageUrl: '',
        dialogVisible: false,
        isLoading: true
      }
    },
    created() {
      this.getApplyOrder()
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 获取申请订单信息
      getApplyOrder() {
        this.axios.post(this.getApi('web/after_page'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            og_id: this.og_id
          })
        ).then(res => {
          this.isLoading = false;
          if (res.data.code === 0) {
            this.goods_info = res.data.goods_info;
            this.user_info = res.data.user_info;
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.isLoading = false;
        })
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isLoading = true;
            this.axios.post(this.getApi('web/after_save'),
              this.dafa({
                user_id: this.getobjS('user').id,
                token: this.getobjS('user').token,
                og_id: this.og_id,
                num: this.ruleForm.num,
                type: this.ruleForm.type,
                payee_account: this.ruleForm.account,
                payee_real_name: this.ruleForm.rel_name,
                refund_type: this.ruleForm.way,
                reason: this.ruleForm.reason,
                description: this.ruleForm.desc,
                invoice: this.ruleForm.evid,
                is_take: this.ruleForm.status,
                accept_name: this.ruleForm.name,
                mobile: this.ruleForm.phone,
                imgs: this.ruleForm.imgs
              })
            ).then(res => {
              this.isLoading = false;
              this.$message(res.data.msg);
              if (res.data.code === 0) {
                this.$router.push('/after-sale-order')
              }
            }).catch(err => {
              this.isLoading = false;
              this.$message('请重试');
            })
          }
        })
      },
      // 选择类型
      choiceType(val) {
        this.ruleForm.type = val;
        if (val !== 0) {
          this.ruleForm.way = ''
        }
      },
      // 选择数量
      choiceNum() {
        let num = /^[1-9][0-9]*$/.test(this.ruleForm.num);
        let max = this.ruleForm.num <= this.goods_info.after_nums;
        if (!num || !max) {
          this.ruleForm.num = 1
        }
      },
      // 选择退回方式
      choiceWay(val) {
        this.ruleForm.way = val
      },
      // 选择货物状态
      choiceStatus(val) {
        this.ruleForm.status = val
      },
      // 选择申请凭据
      choiceEvid(val) {
        this.ruleForm.evid = val
      },
      // 图片上传前钩子
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式');
        }
        /*if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }*/
        return isJPG;
      },
      // 删除图片
      handleRemove(file, fileList) {
      },
      // 预览图片
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 上传成功
      upSuccess(response, file, fileList) {
        this.ruleForm.imgs.push(response.key)
      },
      // 上传失败
      upError(err, file, fileList) {
        this.$message(err)
      }
    },
    components: {Load, ItemUpload}
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

  /*订单信息*/

  .ol-box {
    padding: 20px 15px;
    overflow: hidden;
    background-color: #fff;
    border-bottom: 1px solid #e4e4e4;
    margin-bottom: 20px;
  }

  .img-box {
    float: left;
    width: 70px;
    height: 70px;
  }

  .img-box img {
    width: 100%;
    height: 100%;
  }

  .good-box {
    margin-left: 70px;
    padding-left: 15px;
    height: 70px;
    line-height: 24px;
  }

  .good-box > h3 {
    color: #333;
    height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .good-box > p {
    color: #999;
  }

  /*申请表单*/
  .apply-form {
    background-color: #fff;
    padding: 15px;
    font-size: 12px !important;
  }

  .apply-form span {
    padding: 4px 12px;
    border: 1px solid #e6e6e6;
    margin-right: 10px;
    position: relative;
  }

  .apply-form span i {
    position: absolute;
    top: -7px;
    right: 0;
    line-height: 28px;
    color: #f51322;
    display: none;
  }

  .apply-num {
    width: 82px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid #e6e6e6;
    margin-right: 10px;
  }

  .apl_input {
    width: 100%;
    height: 30px;
    line-height: 28px;
    padding-left: 10px;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
  }

  .apply-desc {
    width: 100%;
    height: 84px;
    line-height: 20px;
    padding: 10px;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
  }

  .apl-ts {
    color: #999;
    line-height: 20px;
  }

  .submitButton {
    width: 100px;
    height: 40px;
    color: #333;
    background-color: #f0f9e9;
    border: 1px solid #bfd6af;
  }

  .apply-form .act {
    border-color: #f51322;
  }

  .apply-form .act i {
    display: inline-block;
  }
</style>
