<template>
  <div class="movie-container">
    <movie v-for="m in movies" :movie="m" :key="m.order"></movie>
  </div>
</template>

<script>
  import Movie from './Movie.vue'
  const movies = require('movies.json')
  export default {
    name: 'Main',
    data () {
      return {
        movies: movies
      }
    },
    components: {Movie}
  }
</script>
<style scoped>
  .movie-container {
    padding: 0 30px;
  }
</style>

