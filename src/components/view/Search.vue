<template>
  <section class="movie-search">
    <movie v-for="m in movieList" :movie="m" :key="m.order" :keyword="keyword"></movie>
    <empty v-if="!movieList.length"></empty>
  </section>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { getKeywords } from 'helpers'
  import Movie from 'components/main/Movie'
  import Empty from 'components/view/Empty'
  import { TITLE, KEYWORDS } from 'constants/index'

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
    metaInfo () {
      return {
        title: `搜索：${this.keyword} - ${TITLE}`,
        meta: [{
          vmid: 'keywords',
          name: 'keywords',
          content: getKeywords(this.movieList) + ',' + KEYWORDS
        }]
      }
    },
    methods: {
      init () {
        this.keyword = decodeURIComponent(this.$route.params.keyword)
        this.movieList = this.movies.filter(m => {
          if (m.subject) {
            return m.subject.title.includes(this.keyword)
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
