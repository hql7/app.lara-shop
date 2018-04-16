<template>
  <div class="index">
    <transition name="move" mode="out-in">
      <router-view></router-view>
    </transition>
    <Tab></Tab>
  </div>
</template>

<script>

  import Tab from '../../components/tob.vue'

  export default {
    data() {
      return {}
    },
    components: {Tab}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
