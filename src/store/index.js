import Vue from 'vue'
import Vuex from 'vuex'
import chunk from 'lodash.chunk'
import { SET_MOVIES_DATA, SET_CURRENT_PAGE_MUTATION, INIT_MOVIES_DATA, SET_CURRENT_PAGE } from 'constants/actions'
import { PAGE_NUM } from 'constants/index'

Vue.use(Vuex)

let movieChunks = []
let movieById = {}
let movieByOrder = {}

function buildIndex (movies) {
  movieChunks = chunk(movies, PAGE_NUM)
  movieById = {}
  movieByOrder = {}
  movies.forEach(m => {
    movieById[m.id] = m
    movieByOrder[m.order] = m
  })
}

export default new Vuex.Store({

  plugins: [],

  state: {
    movies: [],
    page: 1,
    loaded: false
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
    },
    loaded (state) {
      return state.loaded
    },
    movieById () {
      return movieById
    },
    movieByOrder () {
      return movieByOrder
    }
  },
  modules: {},

  actions: {
    [INIT_MOVIES_DATA]: ({commit}) => {
      return import(/* webpackChunkName: "movies-data" */ 'data/movies.json').then(data => {
        let movies = Array.isArray(data) ? data : (data.default || [])
        movies.sort((a, b) => a.order - b.order)
        buildIndex(movies)
        commit(SET_MOVIES_DATA, movies)
      })
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
      state.loaded = true
    },
    [SET_CURRENT_PAGE_MUTATION]: (state, page) => {
      state.page = page
    }
  }
})
