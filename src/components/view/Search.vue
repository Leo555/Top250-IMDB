<template>
  <div class="movie-search">
    <movie v-for="m in movieList" :movie="m" :key="m.order" :keyword="keyword"></movie>
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
    components: {Movie},
    computed: {
      ...mapGetters(['movies'])
    },
    methods: {
      init () {
        this.keyword = decodeURIComponent(this.$route.params.keyword)
        this.movieList = this.movies.filter(m => {
          if (m.subject) {
            return m.subject.title.includes(this.keyword) || m.subject.original_title.includes(this.keyword)
          } else {
            return m.name.includes(this.keyword)
          }
        })
      }
    },
    activated () {
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .movie-search {
    min-height: calc(~'100vh' - 148px);
  }
</style>
