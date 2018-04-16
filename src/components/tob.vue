<template>
  <div class="tab">
    <ul>
      <li v-for="(item, index) in tab" @click="indTab(index)" :class="{act:index==indexRouter}">
        <router-link :to="item.router">
          <p><i class="iconfont" :class="item.icon"></i></p>
          <h3>{{item.name}}</h3>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tab: [
          {router: '/home', icon: 'icon-fangzi012', name: '首页'},
          {router: '/classify', icon: 'icon-shangcheng4', name: '分类'},
          {router: '/cart', icon: 'icon-gouwuche11', name: '购物车'},
          {router: '/mine', icon: 'icon-gerenzhongxin3', name: '我的'}
        ]
      }
    },
    methods: {
      indTab (val) {
        this.$store.commit('setIndexRouter', val)
      }
    },
    computed: {
      indexRouter () {
        return this.$store.state.indexRouter
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tab {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 999;
    width: 100%;
    height: 1.6rem;
    text-align: center;
    background-color: #fff;
    box-shadow: 0 -2px 2px rgba(255, 235, 230, .9);
  }

  .tab a {
    color: #8e8e8e;
  }

  .tab > ul {
    overflow: hidden;
  }

  .tab li {
    float: left;
    width: 25%;
    height: 100%;
    /*padding: 5px 0;*/
    box-sizing: border-box;
  }

  /* .tab p {
     margin-top: -5px;
   }*/

  .tab h3 {
    /*font-size: 14px;*/
    margin-top: -3px;
  }

  .tab i {
    font-size: 0.6rem;
  }

  .act a {
    color: #f51322;
  }
</style>
