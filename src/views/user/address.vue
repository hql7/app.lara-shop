<template>
  <div id="g-login" class="g-login">
    <!--头部-->
    <div class="g-login-top">
      <h3><i class="iconfont icon-zuo" @click="goBack"></i><span>管理收货地址</span></h3>
    </div>
    <!--头部结束-->
    <!--收货地址-->
    <div class="m-address">
      <ul v-if="user.length>0">
        <li v-for="item in user" @click="chose_addr(item.id)">
          <div class="m-adsBox">
            <h3><span>{{item.accept_name}}</span><span>{{item.mobile}}</span></h3>
            <p>{{item.location}}&nbsp;&nbsp;{{item.addr}}</p>
            <div class="m-operation">
              <p @click="setDef(item.id)"><span v-if="item.is_default===1"><i
                class="iconfont icon-xuanzhong u-xz"></i>默认地址</span><span v-else><i
                class="iconfont icon-iconziti50"></i>设为默认</span></p>
              <p><span @click.stop="editAdd(item.id)"><i class="iconfont icon-shuxiexinxi"></i>编辑</span><span
                @click.stop="del(item.id)"><i class="iconfont icon-iconfont19"></i>删除</span></p>
            </div>
          </div>
        </li>
      </ul>
      <div v-else>
        <p>~还没有收货地址~</p>
        <p>~赶快去新建一个吧~</p>
      </div>
    </div>
    <!--收货地址结束-->
    <!--新增收货地址-->
    <div class="g-add-address">
      <p @click="editAdd('')">新建地址</p>
    </div>
    <div class="g-new-address" v-if="addNew">
      <div class="m-newAdd-top  g-login-top">
        <h3><i class="iconfont icon-zuo" @click="noAdd"></i><span>编辑收货地址</span></h3>
      </div>
      <div class="m-entry">
        <ul>
          <li>
            <span>收&nbsp;货&nbsp;人&nbsp;：</span><input type="text" v-model="address.accept_name">
          </li>
          <li>
            <span>手机号码：</span><input type="number" v-model.number="address.mobile">
          </li>
          <li>
            <span>所在地区：</span>
            <select name="省" id="s1" v-model="add_list.prov_id" @change="get_city">
              <option value="000">请选择</option>
              <option v-for="item in  add_list.prov" :value="item.id">{{item.name}}</option>
            </select>
            <select name="市" id="s2" v-model="add_list.city_id" @change="get_county">
              <option value="000">请选择</option>
              <option v-for="item in add_list.city" :value="item.id">{{item.name}}</option>
            </select>
            <select name="县" id="s3" v-model="add_list.coun_id" class="last-select">
              <option value="000">请选择</option>
              <option v-for="item in add_list.coun" :value="item.id">{{item.name}}</option>
            </select>
          </li>
          <li>
            <span>详细地址：</span><input type="text" placeholder="街道、楼牌号等" v-model="address.addr">
          </li>
          <li>
            <span>固定电话：</span><input type="text" placeholder="非必填" v-model="address.phone">
          </li>
          <li>
            <span>邮编：</span><input type="text" placeholder="非必填" v-model="address.zip">
          </li>
          <li class="m-save-address"><p @click="saveReg">保存</p></li>
        </ul>
      </div>
    </div>
    <!--新增收货地址结束-->
    <!--遮罩层-->
    <div class="g-mask" v-if="maskShow"></div>
    <!--遮罩层结束-->
    <!--删除确认弹出层-->
    <div class="g-del-popup" v-if="maskShow">
      <div>确定删除地址吗？</div>
      <div @click="cancel">取消</div>
      <div @click="sure">确定</div>
    </div>
    <!--删除确认弹出层结束-->
    <Load :isLoading="isLoading"></Load>
  </div>
</template>

<script>
  import Load from '@/components/loading.vue'

  export default {
    data() {
      return {
        maskShow: false, //是否弹出遮罩层&&确认删除层
        addNew: false, //是否弹出新增地址
        user: [], //地址列表
        add_list: {
          prov_id: '000',
          prov: [],
          city_id: '000',
          city: [],
          coun_id: '000',
          coun: []
        }, // 省市县信息
        address: {
          accept_name: '',
          mobile: '',
          addr: '',
          phone: '',
          zip: ''
        }, // 新增或编辑地址信息
        index: null, //记录删除地址的id
        type: null, //记录新增还是编辑类型 用于保存时区分
        addrID: null, //记录地址id 用于保存时区分
        isLoading: true
      }
    },
    created() {
      this.new_getAddr(); //加载完毕获取地址信息
    },
    mounted: function () {
    },
    methods: {
      // 后退
      goBack: function () {
        this.$router.go(-1)
      },
      // 请求收货地址
      new_getAddr: function () {
        this.axios.post(this.getApi('web/address_list'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token
          })
        ).then((response) => {
          this.isLoading = false;
          if (response.data.code === 0) {
            this.user = response.data.list
          } else {
            this.$message(response.data.msg)
          }
        }).catch((error) => {
          this.isLoading = false;
          this.$message('请重试')
        })
      },
      // 设置默认地址
      setDef: function (id) {
        this.isLoading = true;
        this.axios.post(this.getApi('web/address_default'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            address_id: id
          })
        ).then((response) => {
          this.isLoading = false;
          this.$message(response.data.msg);
          if (response.data.code === 0) {
            this.new_getAddr();
          }
        }).catch((error) => {
          this.isLoading = false;
          this.$message('请重试')
        })
      },
      // 弹出删除确认 并记录id
      del: function (id) {
        this.maskShow = true;
        this.index = id;
      },
      // 确认删除 并更新列表
      sure: function () {
        this.isLoading = true;
        this.axios.post(this.getApi('web/address_del'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            address_id: this.index
          })
        ).then((response) => {
          this.isLoading = false;
          this.$message(response.data.msg);
          if (response.data.code === 0) {
            this.new_getAddr()
          }
        }).catch((error) => {
          this.isLoading = false;
          this.$message('请重试')
        });
        this.maskShow = false;
      },
      // 取消删除
      cancel: function () {
        this.maskShow = false;
        this.index = null
      },
      // 取消添加新地址
      noAdd: function () {
        this.addNew = false;
      },
      // 地址信息校验
      saveReg: function () {
        let name = this.address.accept_name;
        let phone = /^1[3|4|5|7|8]\d{9}$/.test(this.address.mobile);
        let s1 = this.add_list.prov_id === 0;
        let s2 = this.add_list.city_id === 0;
        let s3 = this.add_list.coun_id === 0;
        let detail = /^[\S]{6,}$/.test(this.address.addr);
        if (!name) {
          this.$message('请检查收货人信息')
        } else if (!phone) {
          this.$message('请检查手机号')
        } else if (s1 || s2 || s3) {
          this.$message('请检查地址信息')
        } else if (!detail) {
          this.$message('详细地址要在6个字符以上')
        } else {
          this.saveAdd()
        }
      },
      // 保存地址
      saveAdd() {
        this.isLoading = true;
        this.axios.post(this.getApi('web/address_save'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            id: this.addrID,
            accept_name: this.address.accept_name,
            province: this.add_list.prov_id,
            city: this.add_list.city_id,
            county: this.add_list.coun_id,
            addr: this.address.addr,
            mobile: this.address.mobile,
            pnone: this.address.phone,
            zip: this.address.zip
          })
        ).then(res => {
          this.isLoading = false;
          this.$message(res.data.msg);
          if (res.data.code === 0) {
            this.addNew = false;
            this.new_getAddr();
          }
        }).catch(err => {
          this.isLoading = false;
          this.$message('请重试');
        })
      },
      // 编辑地址
      editAdd: function (id) {
        this.addrID = id; //记录地址id用于保存
        //this.addrID ? this.type = 1 : this.type = 0; //记录新增还是编辑类型
        this.addNew = true;
        // 地址编辑请求
        this.axios.post(this.getApi('web/address_edit'),
          this.dafa({
            user_id: this.getobjS('user').id,
            token: this.getobjS('user').token,
            address_id: id
          })
        ).then((response) => {
          if (response.data.code === 0) {
            this.address = response.data.info;
            if (id !== '') {
              this.add_list.prov_id = response.data.info.province_id;
              // this.add_list.prov = [{id: response.data.info.province_id, name: response.data.info.province_name}];
              this.get_prov(1);
              this.add_list.city_id = response.data.info.city_id;
              this.add_list.city = [{id: response.data.info.city_id, name: response.data.info.city_name}];
              this.add_list.coun_id = response.data.info.county_id;
              this.add_list.coun = [{id: response.data.info.county_id, name: response.data.info.county_name}];
            } else {
              this.get_prov();
              this.add_list.city_id = this.add_list.coun_id = '000';
            }
          } else {
            this.$message(response.data.msg)
          }
        })
      },
      // 获取省份
      get_prov(open) {
        this.axios.post(this.getApi('coms/get_area'),
          this.dafa({id: 0, web: ''})
        ).then(res => {
          if (res.data.code === 0) {
            this.add_list.prov = res.data.list;
            if (open !== 1) {
              this.add_list.prov_id = '000';
            }
          }
        })
      },
      // 省份改变请求城市
      get_city: function () {
        this.axios.post(this.getApi('coms/get_area'),
          this.dafa({id: this.add_list.prov_id, web: ''})
        ).then((response) => {
          if (response.data.code === 0) {
            this.add_list.city = response.data.list;
            this.add_list.city_id = this.add_list.coun_id = '000';
          } else {
            this.$message(response.data.msg)
          }
        })
      },
      // 城市改变请求区县
      get_county: function () {
        this.axios.post(this.getApi('coms/get_area'),
          this.dafa({id: this.add_list.city_id, web: ''})
        ).then((response) => {
          if (response.data.code === 0) {
            this.add_list.coun = response.data.list;
            this.add_list.coun_id = '000'
          } else {
            this.$message(response.data.msg)
          }
        })
      },
      // 选择地址
      chose_addr: function (id) {
        console.log(this.$route.query.ci);
        if (this.$route.query.ci) {
          this.$router.push({path: '/firm-order', query: {aid: id}})
        }
      }
    },
    components: {Load}
  }
</script>

<style scoped>
  .g-login {
    background-color: #f4f4f4;
  }

  /*头部*/
  .g-login-top {
    height: 110px;
    box-sizing: border-box;
    font-size: 18px;
    color: #fff;
    text-align: center;
    background: linear-gradient(to right, #ff2764, #f72543);
  }

  .g-login-top h3 {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 50px;
    line-height: 50px;
  }

  .g-login-top i {
    position: absolute;
    top: 15px;
    left: 0;
    font-size: 20px;
    line-height: 15px;
    display: inline-block;
    width: 40px;
    height: 40px;
  }

  /*头部结束*/

  /*收货地址*/
  .m-address {
    margin-top: -40px;
  }

  .m-address ul {
    padding: 0 15px 60px;
    box-sizing: border-box;
  }

  .m-address li {
    padding: 15px 10px 10px;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 3px rgba(166, 33, 33, .2);
  }

  .m-adsBox h3 {
    font-size: 16px;
    line-height: 40px;
    color: #333333;
  }

  .m-adsBox h3 span:nth-child(2) {
    margin-left: 35px;
  }

  .m-adsBox > p {
    margin-bottom: 15px;
    font-size: 14px;
  }

  .m-operation {
    overflow: hidden;
    margin-top: 5px;
    border-top: 1px dashed #e1e1e1;
    padding-top: 5px;
  }

  .m-operation p {
    width: 50%;
    float: left;
    color: #333;
    line-height: 40px;
  }

  .m-operation p:nth-child(2) {
    text-align: right;
    color: #999;
  }

  .m-operation p:nth-child(2) span:nth-child(1) {
    margin-right: 15px;
  }

  .m-operation i {
    margin-right: 7px;
    color: #999;
    font-size: 18px;
  }

  .m-operation .u-xz {
    color: #f40000;
  }

  .m-address > div {
    padding: 20px 0;
    height: 100px;
    line-height: 30px;
    background: #f6f6f6;
    color: #999;
    text-align: center;
    box-sizing: border-box;
  }

  /*收货地址结束*/

  /*新增收货地址*/
  .g-add-address {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    position: fixed;
    z-index: 9;
    bottom: 10px;
    left: 0;
  }

  .g-add-address p {
    height: 45px;
    line-height: 45px;
    background: linear-gradient(to right, #ff2764, #f72543);
    color: #fff;
    text-align: center;
    font-size: 18px;
    border-radius: 5px;
  }

  .g-new-address {
    position: fixed;
    top: 0;
    left: 0;
    background-color: #f4f4f4;
    z-index: 299;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    animation: move .4s linear forwards;
  }

  @keyframes move {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  .m-entry {
    position: relative;
  }

  .m-entry ul {
    width: 92%;
    padding: 35px 15px;
    box-sizing: border-box;
    position: absolute;
    top: -47px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
    background-color: #fff;
  }

  .m-entry li {
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    color: #333;
    margin-bottom: 15px;
  }

  .m-entry li span {
    display: inline-block;
    float: left;
    width: 27%;
    text-align: center;
  }

  .m-entry li input {
    float: left;
    padding-left: 10px;
    font-size: 12px;
    width: 73%;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid #e6e6e6;
  }

  .m-entry li select {
    font-size: 12px;
    float: left;
    width: 23%;
    margin-right: 2%;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid #e6e6e6;
  }

  .m-entry .last-select {
    margin-right: 0;
  }

  .m-save-address {
    margin-top: 45px;
    height: 45px;
  }

  .m-save-address p {
    width: 100%;
    height: 100%;
    line-height: 45px;
    font-size: 16px;
    border-radius: 3px;
    text-align: center;
    background: linear-gradient(to right, #ff2764, #f72543);
    color: #fff;
  }

  /*新增收货地址结束*/

  /*遮罩层开始*/
  .g-mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
  }

  /*遮罩层结束*/

  /*删除确认弹出层*/
  .g-del-popup {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 199;
    width: 80%;
    height: 125px;
    border-radius: 7px;
    background-color: #fff;
    text-align: center;
    font-size: 14px;
    color: #333;
  }

  .g-del-popup div:nth-child(1) {
    width: 100%;
    height: 85px;
    line-height: 85px;
    border-bottom: 1px solid rgba(234, 234, 234, .8);
    box-sizing: border-box;
  }

  .g-del-popup div:nth-child(2) {
    float: left;
    width: 50%;
    height: 40px;
    line-height: 40px;
    border-radius: 0 0 0 7px;
  }

  .g-del-popup div:nth-child(3) {
    float: left;
    width: 50%;
    background-color: #f40000;
    color: #fff;
    height: 40px;
    line-height: 40px;
    border-radius: 0 0 7px 0;
  }

  /*删除确认遮罩层结束*/
</style>
