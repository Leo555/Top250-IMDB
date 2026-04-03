<template>
  <section>
    <div v-if="!loaded" class="loading-wrap">
      <p>加载中...</p>
    </div>
    <div v-else-if="current">
      <movie v-for="m in current" :movie="m" :key="m.order"></movie>
      <page-nav :count="pageCount" :page="page"></page-nav>
    </div>
    <div v-else>
      <not-found></not-found>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { SET_CURRENT_PAGE } from 'constants/actions'
  import { getKeywords } from 'helpers'
  import Movie from './Movie.vue'
  import { PAGE_NUM, KEYWORDS } from 'constants/index'
  import PageNav from 'components/page/PageNav.vue'
  export default {
    name: 'MainPage',
    computed: {
      ...mapGetters(['current', 'movies', 'page', 'loaded']),
      pageCount () {
        return Math.ceil(this.movies.length / PAGE_NUM)
      }
    },
    components: {Movie, PageNav},
    metaInfo () {
      return {
        meta: [{
          vmid: 'keywords',
          name: 'keywords',
          content: this.current ? (getKeywords(this.current) + ',' + KEYWORDS) : KEYWORDS
        }]
      }
    },
    methods: {
      load () {
        this.$store.dispatch(SET_CURRENT_PAGE, this.$route)
      }
    },
    watch: {
      loaded (val) {
        if (val) this.load()
      }
    },
    beforeCreate () {
      if (this.$store.getters.loaded) {
        this.$store.dispatch(SET_CURRENT_PAGE, this.$route)
      }
    },
    beforeRouteEnter: async function (to, from, next) {
      let nx = vm => {
        if (!vm.$isServer && vm.loaded) {
          vm.load()
        }
      }
      next(nx)
    },
    beforeRouteUpdate: async function (to, from, next) {
      await this.$store.dispatch(SET_CURRENT_PAGE, to)
      next()
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
