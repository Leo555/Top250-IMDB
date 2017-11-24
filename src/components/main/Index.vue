<template>
  <div class="movie-container">
    <movie v-for="m in movies" :movie="m" :key="m.order"></movie>
    <page-nav></page-nav>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Movie from './Movie.vue'
  import PageNav from 'components/page/PageNav.vue'
  export default {
    name: 'Main',
    methods: {
      backToTop () {
        let time = setInterval(() => {
          let osTop = document.documentElement.scrollTop || document.body.scrollTop
          let speed = Math.floor(-osTop / 10)
          document.documentElement.scrollTop = document.body.scrollTop = osTop + speed
          if (osTop === 0) {
            clearInterval(time)
          }
        }, 10)
      }
    },
    computed: {
      ...mapGetters(['movies'])
    },
    components: {Movie, PageNav}
  }
</script>
