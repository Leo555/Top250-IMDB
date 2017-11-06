<template>
  <div class="movie-container">
    <m-header></m-header>
    <div>
      <movie v-for="m in movies" :movie="m" :key="m.order"></movie>
    </div>
  </div>
</template>

<script>
  import Header from './Header.vue'
  import Movie from './Movie.vue'
  const movies = require('movies.json')
  export default {
    name: 'Main',
    data () {
      return {
        movies: movies
      }
    },
    components: {Movie, 'm-header': Header}
  }
</script>
<style scoped>
  #app{
    position : absolute;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    min-width: 980px;
  }
</style>

