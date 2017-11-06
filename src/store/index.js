import Vue from 'vue'
import Vuex from 'vuex'
import { SET_MOVIES_DATA } from 'constants/actions'

Vue.use(Vuex)

export default new Vuex.Store({

  plugins: [],

  state: {
    movies: []
  },

  getters: {
    movies (state) {
      return state.movies
    }
  },
  modules: {},

  actions: {
    INIT_MOVIES_DATA ({commit}, movies) {
      commit(SET_MOVIES_DATA, movies)
    }
  },

  mutations: {
    [SET_MOVIES_DATA]: (state, movies) => {
      state.movies = movies
    }
  }
})
