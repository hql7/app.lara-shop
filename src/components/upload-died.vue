<template>
  <el-upload class="avatar-uploader"
             :action="getApi('coms/upload-img')"
             list-type="picture-card"
             :on-success="imgSuccess"
             :before-upload="beforeAvatarUpload"
             :on-remove="imgRemove"
             :multiple="true"
             :limit="5">
    <i class="el-icon-plus"></i>
  </el-upload>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: {
      good: {
        type: Object
      },
      onSuccess: Function,
      onRemove: Function
    },
    methods: {
      // 图片上传
      // 成功回调
      imgSuccess(res, file, fileList) {
        // this.imageUrl = URL.createObjectURL(file.raw);
        let arg = [].slice.call(arguments);
        arg.push(this.good);
        this.onSuccess.apply(this, arg)
      },
      // 上传前钩子
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isJPG && isLt2M;
      },
      // 移除图片
      imgRemove(file, fileList) {
        let arg = [].slice.call(arguments);
        arg.push(this.good);
        this.onRemove.apply(this, arg)
      }
    },
    computed: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
