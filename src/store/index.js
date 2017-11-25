import Vue from 'vue'
import Vuex from 'vuex'
import chunk from 'lodash.chunk'
import { SET_MOVIES_DATA, INIT_MOVIES_DATA, SET_CURRENT_PAGE } from 'constants/actions'
import { PAGE_NUM } from 'constants/index'
let movies = require('movies.json')
movies.sort((a, b) => a.order - b.order)
const movieChunks = chunk(movies, PAGE_NUM)

Vue.use(Vuex)

export default new Vuex.Store({

  plugins: [],

  state: {
    movies: movies,
    page: 1
  },

  getters: {
    movies (state) {
      return state.movies
    },
    page (state) {
      return state.page
    },
    current (state) {
      return movieChunks[state.page - 1]
    }
  },
  modules: {},

  actions: {
    [INIT_MOVIES_DATA]: ({commit}, movies) => {
      commit(SET_MOVIES_DATA, movies)
    },
    [SET_CURRENT_PAGE]: ({state}, to = {}) => {
      state.page = parseInt(to.params.p || 1)
      return state.page
    }
  },

  mutations: {
    [SET_MOVIES_DATA]: (state, movies) => {
      state.movies = movies
    }
  }
})
