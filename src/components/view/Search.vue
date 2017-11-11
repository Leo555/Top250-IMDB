<template>
  <div class="movie-search">
    <ul>
      <li v-for="m in movieList">{{m}}</li>
    </ul>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { constructMoviesData } from 'helpers'
  import {
    INIT_MOVIES_DATA
  } from 'constants/actions'
  const movies = require('movies.json')

  export default {
    name: 'search',
    data () {
      return {
        keyword: '',
        movieList: []
      }
    },
    computed: {
      ...mapGetters(['movies'])
    },
    methods: {
      init () {
        debugger
        this.keyword = this.$route.params.keyword
        this.movieList = constructMoviesData(this.movies)
      }
    },
    beforeCreate () {
      this.$store.dispatch(INIT_MOVIES_DATA, movies)
    },
    activated () {
      this.init()
    }
  }
</script>
<style lang="less" scoped>

</style>
