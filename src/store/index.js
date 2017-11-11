import Vue from 'vue'
import Vuex from 'vuex'
import { SET_MOVIES_DATA, INIT_MOVIES_DATA } from 'constants/actions'
const movies = require('movies.json')

Vue.use(Vuex)

export default new Vuex.Store({

  plugins: [],

  state: {
    movies: movies.sort((a, b) => a.order - b.order)
  },

  getters: {
    movies (state) {
      return state.movies
    }
  },
  modules: {},

  actions: {
    [INIT_MOVIES_DATA]: ({commit}, movies) => {
      commit(SET_MOVIES_DATA, movies)
    }
  },

  mutations: {
    [SET_MOVIES_DATA]: (state, movies) => {
      state.movies = movies
    }
  }
})
