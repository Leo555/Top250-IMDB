<template>
  <div class="main-container">
    <m-header></m-header>
    <div class="movie-container">
      <movie v-for="m in movies" :movie="m" :key="m.order"></movie>
    </div>
    <button @click="backToTop">Top</button>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Header from '../Header.vue'
  import Movie from './Movie.vue'
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
    components: {Movie, 'm-header': Header}
  }
</script>
<style lang="less" scoped>
  .main-container {
    min-width: 820px;
    overflow-x: auto;
    .movie-container {
      overflow: hidden;
      background: #e9e9e9;
    }
    button {
      position: fixed;
      bottom: 20px;
      right: 30px;
      z-index: 99;
      border: none;
      outline: none;
      background-color: #111111;
      color: white;
      cursor: pointer;
      padding: 15px;
      border-radius: 10px;
    }
  }
</style>
