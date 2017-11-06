<template>
  <div class="movie-container">
    <m-header></m-header>
    <div>
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
<style scoped>
  #app {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    min-width: 980px;
  }
</style>

