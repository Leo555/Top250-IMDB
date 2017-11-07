<template>
  <div class="main-container">
    <m-header></m-header>
    <div class="movie-container">
      <movie v-for="m in movies" :movie="m" :key="m.order"></movie>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Header from '../Header.vue'
  import Movie from './Movie.vue'
  export default {
    name: 'Main',
    computed: {
      ...mapGetters(['movies'])
    },
    components: {Movie, 'm-header': Header}
  }
</script>
<style>
  .movie-container {
    overflow: hidden;
  }
</style>
