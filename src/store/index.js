import Vue from 'vue'
import Vuex from 'vuex'
import { SET_MOVIES_DATA } from 'constants/actions'

Vue.use(Vuex)

export default new Vuex.Store({

  plugins: [],

  getters: {
    movies (state) {
      return state.movies
    }
  },

  modules: {},

  state: {
    movies: []
  },

  mutations: {
    [SET_MOVIES_DATA]: (state, movies) => {
      debugger
      state.movies = movies
    }
  }
})
