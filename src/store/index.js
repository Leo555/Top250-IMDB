import Vue from 'vue'
import Vuex from 'vuex'
import chunk from 'lodash.chunk'
import { SET_MOVIES_DATA, SET_CURRENT_PAGE_MUTATION, INIT_MOVIES_DATA, SET_CURRENT_PAGE } from 'constants/actions'
import { PAGE_NUM } from 'constants/index'
import movies from 'data/movies.json'
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
    [SET_CURRENT_PAGE]: ({commit}, to = {}) => {
      let page = parseInt(to.params.p || 1)
      commit(SET_CURRENT_PAGE_MUTATION, page)
      return page
    }
  },

  mutations: {
    [SET_MOVIES_DATA]: (state, movies) => {
      state.movies = movies
    },
    [SET_CURRENT_PAGE_MUTATION]: (state, page) => {
      state.page = page
    }
  }
})
