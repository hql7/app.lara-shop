import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    indexRouter: 0,
    loading: true
  },
  mutations: {
    setIndexRouter(state, val) {
      state.indexRouter = val
    },
    setLoading(state, val) {
      state.loading = val
    }
  }
})

export default store
