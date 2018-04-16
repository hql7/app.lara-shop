<template>
  <div class="tab">
    <div class="loading" v-show="isLoading"><img src="../assets/imgs/Spinner.gif" alt="loading"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: {
      isLoading: {
        type: Boolean,
        default: false
      }
    },
    methods: {},
    computed: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 9999;
    margin-left: -45px;
    margin-top: -45px;
    width: 90px;
    height: 90px;
  }

  .loading > img {
    width: 100%;
    height: 100%;
  }
</style>
