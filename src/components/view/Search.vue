<template>
  <section class="movie-search">
    <div v-if="!loaded" class="loading-wrap">
      <p>加载中...</p>
    </div>
    <template v-else>
      <movie v-for="m in movieList" :movie="m" :key="m.order" :keyword="keyword"></movie>
      <empty v-if="!movieList.length"></empty>
    </template>
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
      ...mapGetters(['movies', 'loaded'])
    },
    metaInfo () {
      return {
        title: `搜索：${this.keyword} - ${TITLE}`,
        meta: [{
          vmid: 'keywords',
          name: 'keywords',
          content: this.movieList.length ? (getKeywords(this.movieList) + ',' + KEYWORDS) : KEYWORDS
        }]
      }
    },
    methods: {
      init () {
        this.keyword = decodeURIComponent(this.$route.params.keyword)
        this.movieList = this.movies.filter(m => {
          let keyword = this.keyword.toLowerCase()
          let title = m.subject ? m.subject.title : m.name
          let name = m.name || ''
          let englishName = (m.englishName || '').toLowerCase()
          return title.toLowerCase().includes(keyword) ||
            name.toLowerCase().includes(keyword) ||
            englishName.includes(keyword)
        })
      }
    },
    watch: {
      loaded (val) {
        if (val) this.init()
      }
    },
    activated () {
      if (this.loaded) this.init()
    }
  }
</script>
<style scoped>
  .loading-wrap {
    text-align: center;
    padding: 100px 0;
  }
  .loading-wrap p {
    font-size: 18px;
    color: #999;
  }
</style>
