<template>
  <!--<el-upload v-if="listType == 'picture'"
             class="head-pic"
             :action="getApi('coms/upload-img')"
             :show-file-list="false"
             :data="{type:6}"
             :on-success="handleAvatarSuccess"
             :before-upload="beforeAvatarUpload">
    <img v-if="imageUrlBase" :src="imageUrlBase" class="avatar-pic">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>-->
  <el-upload
    class="avatar-uploader"
    :action="storageAddress"
    :data="form"
    :list-type="listType"
    :on-success="imgSuccess"
    :on-remove="imgRemove"
    :before-upload="beforeAvatarUpload"
    :on-exceed="onExceed"
    :file-list="fileList"
    :multiple="multiple"
    :limit="limit">
    <i class="el-icon-plus"></i>
  </el-upload>
</template>

<script>

  // 前端生成七牛token代码
  /*  let CryptoJS = require('crypto-js');

    /!**
     * 上传凭证算法实现参考
     * 请注意External Resources项中引用的第三方CryptoJS库
     *!/
    function utf16to8(str) {
      var out, i, len, c;
      out = "";
      len = str.length;
      for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
          out += str.charAt(i);
        } else if (c > 0x07FF) {
          out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
          out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
          out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
      }
      return out;
    }

    function utf8to16(str) {
      var out, i, len, c;
      var char2, char3;
      out = "";
      len = str.length;
      i = 0;
      while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            // 0xxxxxxx
            out += str.charAt(i - 1);
            break;
          case 12:
          case 13:
            // 110x xxxx 10xx xxxx
            char2 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
          case 14:
            // 1110 xxxx 10xx xxxx 10xx xxxx
            char2 = str.charCodeAt(i++);
            char3 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
            break;
        }
      }
      return out;
    }

    /!*
     * Interfaces:
     * b64 = base64encode(data);
     * data = base64decode(b64);
     *!/


    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    function base64encode(str) {
      var out, i, len;
      var c1, c2, c3;
      len = str.length;
      i = 0;
      out = "";
      while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
          out += base64EncodeChars.charAt(c1 >> 2);
          out += base64EncodeChars.charAt((c1 & 0x3) << 4);
          out += "==";
          break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
          out += base64EncodeChars.charAt(c1 >> 2);
          out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
          out += base64EncodeChars.charAt((c2 & 0xF) << 2);
          out += "=";
          break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
      }
      return out;
    }

    function base64decode(str) {
      var c1, c2, c3, c4;
      var i, len, out;
      len = str.length;
      i = 0;
      out = "";
      while (i < len) {
        /!* c1 *!/
        do {
          c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1) break;
        /!* c2 *!/
        do {
          c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1) break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /!* c3 *!/
        do {
          c3 = str.charCodeAt(i++) & 0xff;
          if (c3 == 61) return out;
          c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1) break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /!* c4 *!/
        do {
          c4 = str.charCodeAt(i++) & 0xff;
          if (c4 == 61) return out;
          c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1) break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
      }
      return out;
    }

    function safe64(base64) {
      base64 = base64.replace(/\+/g, "-");
      base64 = base64.replace(/\//g, "_");
      return base64;
    }

    function genUpToken(accessKey, secretKey, putPolicy) {
      //SETP 2
      var put_policy = JSON.stringify(putPolicy);
      console && console.log("put_policy = ", put_policy);

      //SETP 3
      var encoded = base64encode(utf16to8(put_policy));
      console && console.log("encoded = ", encoded);

      //SETP 4
      var hash = CryptoJS.HmacSHA1(encoded, secretKey);
      var encoded_signed = hash.toString(CryptoJS.enc.Base64);
      console && console.log("encoded_signed=", encoded_signed)

      //SETP 5
      var upload_token = accessKey + ":" + safe64(encoded_signed) + ":" + encoded;
      console && console.log("upload_token=", upload_token)
      return upload_token;
    }*/

  export default {
    data() {
      return {
        qiniu: {}, // 七牛云存储参数
        open: 0,
        form: {}, // 上传携带数据
        url: '', // 当前模式前缀域名
        imageUrl: '' // 头像模式时图片路径
      }
    },
    props: {
      onSuccess: Function, // 成功回调
      onRemove: Function, // 删除回调
      /*className: {
        type: String,
        default: 'avatar-uploader'
      }, // 样式类名*/
      severType: {
        type: Number,
        default: 0
      }, // 当选择服务器上传时图片类型
      fileList: {
        type: Array,
        default: function () {
          return []
        }
      },
      listType: {
        type: String,
        default: 'picture-card'
      }, // 卡片类型
      multiple: {
        type: Boolean,
        default: false
      }, // 开启多图上传
      limit: {
        type: Number,
        default: 5
      }
    },
    methods: {
      // 图片上传
      // 上传前钩子
      beforeAvatarUpload(file) {
        if (this.open == 1) {
          this.form.token = this.qiniu.js_token
        } else {
          this.form.type = this.severType
        }
        let isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/jpeg' || 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 1;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG,PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 1MB!');
        }
        return isJPG && isLt2M;
      },
      // 成功回调
      imgSuccess(res, file, fileList) {
        this.imageUrl = URL.createObjectURL(file.raw);
        let arg = [].slice.call(arguments);
        this.url = this.open == 0 ? this.getApi('coms/upload-img') : this.qiniu.domain;
        arg.push(this.url);
        this.onSuccess.apply(this, arg)
      },
      // 移除图片
      imgRemove(file, fileList) {
        /*let arg = [].slice.call(arguments);
        arg.push(this.good);*/
        this.onRemove.apply(this, arguments)
      },
      // 超出上传个数限制
      onExceed() {
        this.$message(`最多上传${this.limit}张图片`)
      },
      // 七牛云存储参数
      /*getQiNiu() {
        if (!this.getobjS('qiniu')) {
          this.axios.post(this.getApi('web/config_info'),
            `title=qiniu`
          ).then(res => {
            if (res.data.code === 0) {
              this.qiniu = Object.assign(this.qiniu, res.data.info);
              this.setobjS('qiniu', this.qiniu)
            }
          }).catch(err => {
            console.log(err);
          })
        } else {
          this.qiniu = this.getobjS('qiniu')
        }
      },*/
      // 获取功能开关
      getSwitch() {
        if (!this.getobjS('switch')) {
          this.axios.post(this.getApi('web/config_info'),
            `title=switch`
          ).then(res => {
            if (res.data.code === 0) {
              this.open = res.data.info.qiniu;
              this.setobjS('switch', res.data.info)
            }
          }).catch(err => {
            console.log(err);
          })
        } else {
          this.open = this.getobjS('switch').qiniu;
        }
      },
      // 获取服务端生成token
      getQiNiuToken() {
        this.axios.post(this.getApi('coms/qiniu_token'),
          this.dafa({
            port: 1, // 0平台 1pc
            id: this.getobjS('user').id,
            name: this.getobjS('user').name
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.qiniu = Object.assign(this.qiniu, {
              js_token: res.data.token,
              dead_time: res.data.dead_time,
              domain: res.data.domain,
              region: res.data.region
            });
            // 存储在本地
            this.setobjS('qiniu', this.qiniu);
          } else {
            this.$message(res.data.msg);
            this.delobjS('qiniu');
          }
        }).catch(err => {
          console.log(err);
        })
        // 前端生成token模式
        /* return this.axios.post(this.getApi('coms/qiniu_token')
         )*/
      },
    },
    created() {
      // 获取功能开关
      this.getSwitch();
      // 处理七牛权限
      if (this.getobjS('qiniu')) {
        this.qiniu = this.getobjS('qiniu');
        // 初始化七牛上传
        let new_time = Date.parse(new Date()) / 1000;
        if (new_time >= parseInt(this.qiniu.dead_time)) {
          this.getQiNiuToken();
        }
      } else {
        this.getQiNiuToken()
      }
    },
    computed: {
      storageAddress() {
        let http = '';
        switch (this.qiniu.region) {
          case 'z0': // 华东区
            http = 'http://upload.qiniup.com';
            break;
          case 'z1': // 华北区
            http = 'http://upload-z1.qiniup.com';
            break;
          case 'z2': // 华南区
            http = 'http://upload-z2.qiniup.com';
            break;
          case 'na0': // 北美
            http = 'http://upload-na0.qiniup.com';
            break;
          default:
            http = 'http://upload.qiniup.com';
        }
        return this.open == 0 ? this.getApi('coms/upload-img') : http;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  /*头像模式*/

  .head-pic .avatar-uploader-icon {
    font-size: 18px;
    color: #8c939d;
    width: 68px;
    height: 68px;
    line-height: 68px;
    text-align: center;
  }

  .avatar-pic {
    width: 70px;
    height: 70px;
  }
</style>
