<template>
  <div class="movie-search">
    <movie v-for="m in movieList" :movie="m" :key="m.order"></movie>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Movie from 'components/main/Movie'

  export default {
    name: 'search',
    data () {
      return {
        keyword: '',
        movieList: []
      }
    },
    components: { Movie },
    computed: {
      ...mapGetters(['movies'])
    },
    methods: {
      init () {
        this.keyword = this.$route.params.keyword
        this.movieList = this.movies
      }
    },
    activated () {
      this.init()
    }
  }
</script>
<style lang="less" scoped>

</style>
