<template>
  <div id="app">
    <div class="new-moon" ref="container" v-show="show">
      <img class="new-moon-img" src="./assets/imgs/Spinner.gif" alt="刷新loading">
    </div>
    <router-view/>
  </div>
</template>

<script>

  export default {
    name: 'app',
    data() {
      return {
        flag: 0, // 表示是否达到刷新条件
        loading: 0,  // 表示是否正在刷新中
        touchStart: 0, // 手指触摸屏幕的起点
        distance: 0, // 手指滑动的距离
        show: false
      }
    },
    mounted() {
      const container = this.$refs.container;
      window.addEventListener('touchstart', (e) => {
        // 如果loading为true就代表刷新函数正在进行，此时阻止下拉操作，返回
        if (this.loading) {
          e.preventDefault();
          return
        }
        // 取第一个手指的触摸点作为起始点
        this.touchStart = e.targetTouches[0].clientY;
      });
      window.addEventListener('touchmove', (e) => {
        // 如果没有触摸起始点，返回
        if (!this.touchStart) {
          return
        }
        if (this.loading) {
          e.preventDefault();
          return
        }
        const touch = e.targetTouches[0];
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollTop === 0) {
          this.show = true;
          this.distance = touch.clientY - this.touchStart;
          if (this.distance > 0) {
            e.preventDefault();
            if (this.distance < 80) {
              container.style.transform = `translateY(${this.distance}px)`;
              if (this.distance > 70) {
                this.flag = 1;
              }
            }
          }
        }
      });
      window.addEventListener('touchend', (e) => {
        if (this.distance === 0) {
          return
        }
        if (this.loading) {
          e.preventDefault();
          return
        }
        if (this.flag && this.distance > 0) {
          container.style.transform = 'translateY(50px)';
          this.loading = 1;
          this.$router.go(0);
          setTimeout(() => {
            this.flag = 0;
            this.loading = 0;
            container.scrollTop = 0;
            container.style.transform = 'translateY(0)';
            this.show = false;
          }, 1000);
          return
        }
        // 重置变量
        this.flag = 0;
        container.style.transform = 'translateY(0)';
        this.show = false;
      })
    }
  }

</script>

<style scoped>
  .new-moon {
    position: fixed;
    top: -80px;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #fff;
    padding-top: 30px;
  }

  .new-moon > .new-moon-img {
    width: 50px;
    height: 50px;
  }
</style>

