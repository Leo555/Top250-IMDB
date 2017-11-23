<template>
  <div class="movie-container">
    <div class="movie-search">
      <movie v-for="m in movieList" :movie="m" :key="m.order" :keyword="keyword"></movie>
      <empty v-if="!movieList.length"></empty>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Movie from 'components/main/Movie'
  import Empty from 'components/view/Empty'

  export default {
    name: 'search',
    data () {
      return {
        keyword: '',
        movieList: []
      }
    },
    components: {Movie, Empty},
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
